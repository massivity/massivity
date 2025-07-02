module.exports = function authorizeRole(roleAttendu) {
    return (req, res, next) => {
        const utilisateur = req.utilisateur; // injecté par authMiddleware
        if (!utilisateur || utilisateur.role !== roleAttendu) {
            return res.status(403).json({ error: 'Accès interdit : rôle insuffisant' });
        }
        next();
    };
};
