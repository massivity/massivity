const express = require('express');
const router = express.Router();
const pool = require('../models/db');
const { authenticateToken } = require('../middleware/auth');

router.get('/profil', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
        'SELECT id, nom, prenom, email, adresse, telephone, role FROM clients WHERE id = $1',
        [req.user.id]
    );
    const user = result.rows[0];

    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    res.json({ user });
  } catch (err) {
    console.error('❌ Erreur lors de la récupération du profil :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
