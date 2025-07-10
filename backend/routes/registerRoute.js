const express = require('express');
const router = express.Router();
const { register } = require('../controllers/authController');
const pool = require('../models/db');
const { authenticateToken } = require('../middleware/auth');

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

module.exports = router;
