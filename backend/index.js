const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const setupDocs = require('./swagger');
const authRoutes = require('./routes/authRoutes');
const changelogRoutes = require('./routes/changelogRoutes');
const adminRoutes = require('./routes/adminRoutes');

dotenv.config();
console.log('🔐 Clé secrète JWT chargée :', process.env.JWT_SECRET ? '✅ OK' : '❌ ABSENTE');


const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/changelog', changelogRoutes);
app.use('/api/admin', adminRoutes);

setupDocs(app);

app.use('/api/auth', authRoutes);
app.use('/api/changelogs', changelogRoutes);


app.listen(port, () => {
    console.log(`🚀 Serveur lancé sur le port ${port}`);
});
