const pool = require('../models/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { nom, prenom, email, adresse, telephone, mot_de_passe } = req.body;
  const role = 'user'; // rôle par défaut

  try {
    console.log('📥 Tentative d’inscription avec :', { nom, prenom, email, adresse, telephone });

    const hash = await bcrypt.hash(mot_de_passe, 10);
    const result = await pool.query(
        'INSERT INTO clients (nom, prenom, email, adresse, telephone, mot_de_passe, role) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [nom, prenom, email, adresse, telephone, hash, role]
    );

    const client = result.rows[0];
    console.log('✅ Utilisateur créé en BDD :', client);

    res.status(201).json({ message: 'Compte créé !', client: { ...client, mot_de_passe: undefined } });
  } catch (err) {
    console.error('❌ Erreur lors de l’inscription :', err);
    res.status(500).json({ error: 'Erreur lors de l’inscription' });
  }
};

exports.login = async (req, res) => {
  const { email, mot_de_passe } = req.body;

  try {
    console.log('🔐 Tentative de connexion avec email :', email);

    const result = await pool.query('SELECT * FROM clients WHERE email = $1', [email]);
    const client = result.rows[0];

    if (!client) {
      console.warn('❌ Aucun utilisateur trouvé avec cet email.');
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    console.log('🧠 Utilisateur trouvé :', {
      id: client.id,
      email: client.email,
      mot_de_passe_existe: !!client.mot_de_passe,
      role: client.role,
    });

    const valid = await bcrypt.compare(mot_de_passe, client.mot_de_passe);
    if (!valid) {
      console.warn('❌ Mot de passe incorrect');
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const token = jwt.sign(
        { id: client.id, role: client.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    console.log('✅ Connexion réussie, token généré');

    res.json({
      message: 'Connexion réussie',
      token,
      user: {
        id: client.id,
        nom: client.nom,
        prenom: client.prenom,
        email: client.email,
        role: client.role,
      }
    });
  } catch (err) {
    console.error('❌ Erreur complète lors de la connexion :', err);
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
};
