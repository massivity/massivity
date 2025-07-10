const express = require('express');
const router = express.Router();
const pool = require('../models/db');
const { authenticateToken } = require('../middleware/auth');


router.delete('/account', authenticateToken, async (req, res) => {
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

module.exports = router;