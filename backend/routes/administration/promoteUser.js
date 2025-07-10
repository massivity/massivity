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
 * PATCH /api/admin/promote/:userId
 * Body attendu : { role: 'user' | 'admin' }
 */
router.patch('/promote/:userId', authenticateToken, authorizeAdmin, async (req, res) => {
    const { userId } = req.params;
    const { role } = req.body;

    // Pour la sécurité, on limite les rôles valides
    if (!['user', 'admin'].includes(role)) {
        return res.status(400).json({ error: "Rôle invalide" });
    }

    // On empêche un admin de se rétrograder lui-même (optionnel mais conseillé)
    if (parseInt(userId, 10) === req.user.id && role !== 'admin') {
        return res.status(400).json({ error: "Impossible de rétrograder son propre compte admin" });
    }

    try {
        const result = await pool.query(
            'UPDATE clients SET role = $1 WHERE id = $2 RETURNING id, nom, prenom, email, role',
            [role, userId]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }
        // Log dans la console
        console.log(`🔄 [ADMIN] ${req.user.email} a changé le rôle de l'utilisateur #${userId} en "${role}"`);
        res.json({ user: result.rows[0], message: "Rôle mis à jour" });
    } catch (err) {
        console.error('Erreur promote user:', err);
        res.status(500).json({ error: "Erreur lors de la promotion" });
    }
});

module.exports = router;
