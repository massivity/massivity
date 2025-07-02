const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware//authorizeRole');

router.get('/dashboard', authMiddleware, authorizeRole('admin'), (req, res) => {
    res.json({ message: 'Bienvenue dans le dashboard admin 🛠️' });
});

module.exports = router;
