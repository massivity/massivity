const express = require('express');
const router = express.Router();
const pool = require('../models/db');
const { authenticateToken } = require('../middleware/auth');


router.get('/profil', authenticateToken, (req, res) => {
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

module.exports = router;