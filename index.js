const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const setupDocs = require('./swagger');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

setupDocs(app);

app.use('/api/auth', authRoutes);

app.listen(port, () => {
    console.log(`🚀 Serveur lancé sur le port ${port}`);
});
