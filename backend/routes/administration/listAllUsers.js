const express = require('express');
const router = express.Router();
const pool = require('../../models/db');
const authenticateToken = require('../../middleware/auth/authenticateToken');

// Middleware : admin only
function authorizeAdmin(req, res, next) {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: "Accès interdit : admin uniquement" });
    }
    next();
}

/**
 * GET /api/admin/users
 * Liste tous les utilisateurs (admin seulement)
 */
router.get('/users', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        // --- LOG ICI ---
        console.log(`👑 [ADMIN] Liste des utilisateurs demandée par: ${req.user.email} (id=${req.user.id})`);
        // --------------

        const result = await pool.query('SELECT id, nom, prenom, email, role FROM clients ORDER BY id ASC');
        res.json({ users: result.rows });
    } catch (err) {
        console.error('Erreur get users:', err);
        res.status(500).json({ error: "Erreur lors de la récupération des utilisateurs" });
    }
});

module.exports = router;
