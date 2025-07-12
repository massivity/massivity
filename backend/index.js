const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const setupDocs = require('./swagger');
const authRoutes = require('./routes/authRoutes');
const changelogRoutes = require('./routes/changelogRoutes');
const adminRoutes = require('./routes/adminRoutes');
const profileRoute = require('./routes/profilRoute');
const listAllUsers = require('./routes/administration/listAllUsers');
const promoteUser = require('./routes/administration/promoteUser');

dotenv.config();

console.log('🔐 Clés JWT chargées :');
console.log('- ACCESS_TOKEN_SECRET :', process.env.ACCESS_TOKEN_SECRET ? '✅ OK' : '❌ Manquante');
console.log('- REFRESH_TOKEN_SECRET :', process.env.REFRESH_TOKEN_SECRET ? '✅ OK' : '❌ Manquante');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/changelog', changelogRoutes);       // Pour compat' ancienne URL ?
app.use('/api/changelogs', changelogRoutes);  // Nouvelle convention ?
app.use('/api/admin', adminRoutes);
app.use('/api/admin', listAllUsers);
app.use('/api/admin', promoteUser);
app.use('/api/scrapping', require('./routes/scrapping'));

// 👉 Toutes les routes liées à l'authentification ET au profil utilisateur :
app.use('/api/auth', authRoutes);
app.use('/api/auth', profileRoute); // <-- On monte ici le profil

setupDocs(app);

app.get('/api/healthcheck', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'API opérationnelle ✅',
        timestamp: new Date().toISOString(),
    });
});

// Optionnel : redirige /api vers la doc
app.get('/api', (req, res) => {
    res.redirect('/api-docs');
});

app.listen(port, () => {
    console.log(`🚀 Serveur lancé sur le port ${port}`);
});
