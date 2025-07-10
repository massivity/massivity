const express = require('express');
const router = express.Router();
const pool = require('../models/db');
const { authenticateToken } = require('../middleware/auth');


router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ error: 'Token requis' });

  try {
    const result = await pool.query('SELECT * FROM clients WHERE refresh_token = $1', [refreshToken]);
    const user = result.rows[0];

    if (!user) return res.status(403).json({ error: 'Refresh token invalide' });

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err || decoded.id !== user.id) {
        return res.status(403).json({ error: 'Refresh token non valide ou expiré' });
      }

      const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
      res.json({ accessToken });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors du rafraîchissement' });
  }
});

module.exports = router;

module.exports = router;