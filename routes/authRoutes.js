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
