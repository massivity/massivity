const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const verifyToken = require('../middleware/authMiddleware');
const pool = require('../models/db');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Créer un compte client
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               email:
 *                 type: string
 *               adresse:
 *                 type: string
 *               telephone:
 *                 type: string
 *               mot_de_passe:
 *                 type: string
 *     responses:
 *       201:
 *         description: Compte créé avec succès
 */
router.post('/register', register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connexion client
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               mot_de_passe:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie, tokens retournés
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/profil:
 *   get:
 *     summary: Obtenir le profil de l'utilisateur connecté
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Détails du profil utilisateur
 */
router.get('/profil', verifyToken, (req, res) => {
  res.json({ message: `Bienvenue, utilisateur #${req.user.id} ! 🎉` });
});

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Déconnexion - Invalider le refresh token
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 */
router.post('/logout', verifyToken, async (req, res) => {
  try {
    await pool.query('UPDATE clients SET refresh_token = NULL WHERE id = $1', [req.user.id]);
    res.json({ message: 'Déconnexion réussie 📴' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la déconnexion' });
  }
});

/**
 * @swagger
 * /api/auth/account:
 *   delete:
 *     summary: Supprimer le compte de l'utilisateur connecté
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Compte supprimé avec succès
 *       500:
 *         description: Erreur serveur
 */
router.delete('/account', verifyToken, async (req, res) => {
  try {
    await pool.query('DELETE FROM clients WHERE id = $1', [req.user.id]);
    res.json({ message: 'Compte supprimé avec succès 🗑️' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la suppression du compte' });
  }
});
/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Rafraîchir un access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Nouveau accessToken retourné
 *       403:
 *         description: Refresh token invalide
 */
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ error: 'Token requis' });

  try {
    const result = await pool.query('SELECT * FROM clients WHERE refresh_token = $1', [refreshToken]);
    const user = result.rows[0];

    if (!user) return res.status(403).json({ error: 'Refresh token invalide' });

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err || decoded.id !== user.id) {
        return res.status(403).json({ error: 'Refresh token non valide ou expiré' });
      }

      const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
      res.json({ accessToken });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors du rafraîchissement' });
  }
});

module.exports = router;
