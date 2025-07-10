const jwt = require('jsonwebtoken');
const { accessTokenSecret } = require('../../config');
console.log('🔐 Clé secrète utilisée pour verify :', accessTokenSecret);

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token manquant ou mal formé' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, accessTokenSecret, (err, decoded) => {
        if (err) {
            console.error('❌ Erreur de vérification JWT :', err.message);
            return res.status(403).json({ message: 'Token invalide ou expiré' });
        }

        console.log('✅ Utilisateur décodé :', decoded);
        req.user = decoded;
        next();
    });
}

module.exports = authenticateToken;
