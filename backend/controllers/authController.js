const crypto = require('crypto');
const pool = require('../models/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { accessTokenSecret } = require('../config');

function generateRefreshToken() {
  // Un token vraiment aléatoire et long
  return crypto.randomBytes(64).toString('hex');
}

exports.login = async (req, res) => {
  const { email, mot_de_passe } = req.body;

  try {
    const result = await pool.query('SELECT * FROM clients WHERE email = $1', [email]);
    const client = result.rows[0];

    if (!client) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const valid = await bcrypt.compare(mot_de_passe, client.mot_de_passe);
    if (!valid) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const accessToken = jwt.sign(
        { id: client.id, role: client.role },
        accessTokenSecret,
        { expiresIn: '15m' } // + court !
    );
    const refreshToken = generateRefreshToken();

    // Stocker le refresh token en BDD
    await pool.query(
        'UPDATE clients SET refresh_token = $1 WHERE id = $2',
        [refreshToken, client.id]
    );

    // On ne renvoie pas le mot de passe ni le refresh_token
    const { mot_de_passe: _, refresh_token: __, ...userSansMDP } = client;

    res.json({
      message: 'Connexion réussie',
      accessToken,
      refreshToken,
      user: userSansMDP
    });
  } catch (err) {
    console.error('❌ Erreur complète lors de la connexion :', err);
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
};

exports.register = async (req, res) => {
  const { nom, prenom, email, adresse, telephone, mot_de_passe } = req.body;
  const role = 'user'; // rôle par défaut

  try {
    const hash = await bcrypt.hash(mot_de_passe, 10);
    const result = await pool.query(
        'INSERT INTO clients (nom, prenom, email, adresse, telephone, mot_de_passe, role) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, nom, prenom, email, adresse, telephone, role',
        [nom, prenom, email, adresse, telephone, hash, role]
    );

    const client = result.rows[0];
    res.status(201).json({ message: 'Compte créé !', client });
  } catch (err) {
    console.error('❌ Erreur lors de l’inscription :', err);
    res.status(500).json({ error: 'Erreur lors de l’inscription' });
  }
};


exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) return res.status(400).json({ error: 'Refresh token manquant' });

  try {
    // Trouver l'utilisateur ayant ce refreshToken
    const result = await pool.query(
        'SELECT * FROM clients WHERE refresh_token = $1',
        [refreshToken]
    );
    const client = result.rows[0];

    if (!client) return res.status(403).json({ error: 'Refresh token invalide' });

    // Générer un nouvel access token
    const accessToken = jwt.sign(
        { id: client.id, role: client.role },
        accessTokenSecret,
        { expiresIn: '15m' }
    );
    // Générer un NOUVEAU refresh token (rotation)
    const newRefreshToken = generateRefreshToken();
    await pool.query(
        'UPDATE clients SET refresh_token = $1 WHERE id = $2',
        [newRefreshToken, client.id]
    );

    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (err) {
    console.error('❌ Erreur refresh token :', err);
    res.status(500).json({ error: 'Erreur lors du refresh' });
  }
};

exports.logout = async (req, res) => {
  try {
    // req.user.id est dispo via authenticateToken
    await pool.query('UPDATE clients SET refresh_token = NULL WHERE id = $1', [req.user.id]);
    res.json({ message: 'Déconnexion réussie 📴' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la déconnexion' });
  }
};
