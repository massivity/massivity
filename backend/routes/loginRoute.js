const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');
const pool = require('../models/db');
const { authenticateToken } = require('../middleware/auth');


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

module.exports = router;