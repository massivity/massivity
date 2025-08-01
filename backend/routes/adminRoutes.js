const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const importAvisHandler = require('../controllers/importAvisController');
const { getAllAvisLocations } = require('../controllers/avisController');
const { exportAvisToXlsx } = require('../controllers/exportAvisController');


// Route GET : dashboard admin
router.get('/dashboard', authenticateToken, authorizeRole('admin'), (req, res) => {
    res.json({ message: 'Bienvenue dans le dashboard admin 🛠️' });
});

// Route POST : importation AVIS protégée par token + rôle admin
router.post('/import-avis', authenticateToken, authorizeRole('admin'), importAvisHandler);

// Route pour lire les données AVIS, protégée par token + rôle admin
router.get('/avis', authenticateToken, authorizeRole('admin'), getAllAvisLocations);

// Route pour exporter les données AVIS, protégée par token + rôle admin
router.get('/avis/export', authenticateToken, authorizeRole('admin'), exportAvisToXlsx);

module.exports = router;
