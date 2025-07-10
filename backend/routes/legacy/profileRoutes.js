const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const pool = require('../models/db');

router.get('/profile', authenticateToken, async (req, res) => {
    console.log("📥 req.user.id :", req.user.id);
    const result = await pool.query(
        'SELECT id, nom, prenom, email FROM clients WHERE id = $1',
        [req.user.id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json(result.rows[0]);
});

module.exports = router;
