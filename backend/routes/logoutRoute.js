const express = require('express');
const router = express.Router();
const pool = require('../models/db');
const { authenticateToken } = require('../middleware/auth');


router.post('/logout', authenticateToken, async (req, res) => {
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

module.exports = router;