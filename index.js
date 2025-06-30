require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/authRoutes');
const setupDocs = require('./swagger');

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
setupDocs(app);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Serveur lancé sur le port ${PORT}`));
