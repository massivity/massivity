const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const importAvisHandler = require('../controllers/importAvisController');
const { getAllAvisLocations } = require('../controllers/avisController');


// Route GET : dashboard admin
router.get('/dashboard', authenticateToken, authorizeRole('admin'), (req, res) => {
    res.json({ message: 'Bienvenue dans le dashboard admin 🛠️' });
});

// Route POST : importation AVIS protégée par token + rôle admin
router.post('/import-avis', authenticateToken, authorizeRole('admin'), importAvisHandler);

// Route pour lire les données AVIS, protégée par token + rôle admin
router.get('/avis', authenticateToken, authorizeRole('admin'), getAllAvisLocations);


module.exports = router;
