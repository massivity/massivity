const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);

// Route protégée
router.get('/profil', verifyToken, (req, res) => {
  res.json({ message: `Bienvenue, utilisateur #${req.user.id} ! 🎉` });
});

module.exports = router;

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

