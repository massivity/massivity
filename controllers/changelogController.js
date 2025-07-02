const pool = require('../models/db');

exports.getChangelogs = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM changelogs ORDER BY date DESC');
        console.log('Résultat SQL :', result.rows);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la récupération des changelogs' });
    }
};

exports.createChangelog = async (req, res) => {
    const { titre, description } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO changelogs (titre, description) VALUES ($1, $2) RETURNING *',
            [titre, description]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la création du changelog' });
    }
};
