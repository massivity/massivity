const express = require('express');
const router = express.Router();
const pool = require('../models/db');
const jwt = require('jsonwebtoken'); // 👈 AJOUT OBLIGATOIRE !
const { accessTokenSecret } = require('../config');

// Route POST /api/auth/refresh
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ error: 'Token requis' });

  try {
    // Vérifie que le refresh token existe bien pour un user
    const result = await pool.query('SELECT * FROM clients WHERE refresh_token = $1', [refreshToken]);
    const user = result.rows[0];

    if (!user) return res.status(403).json({ error: 'Refresh token invalide' });

    // Si on arrive ici : refresh token valide. On peut regénérer un access token
    const accessToken = jwt.sign(
        { id: user.id, role: user.role },
        accessTokenSecret,
        { expiresIn: '15m' }
    );

    res.json({ accessToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors du rafraîchissement' });
  }
});

module.exports = router;
