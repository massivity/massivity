const db = require('../models/db');

exports.getAllAvisLocations = async (req, res) => {
    try {
        const {
            ville,
            modele,
            agence,
            date,
            limit = 50,
            offset = 0
        } = req.query;

        let whereClauses = [];
        let values = [];
        let count = 1;

        if (ville) {
            whereClauses.push(`ville ILIKE $${count++}`);
            values.push(`%${ville}%`);
        }
        if (modele) {
            whereClauses.push(`modele ILIKE $${count++}`);
            values.push(`%${modele}%`);
        }
        if (agence) {
            whereClauses.push(`agence ILIKE $${count++}`);
            values.push(`%${agence}%`);
        }
        if (date) {
            whereClauses.push(`date_location = $${count++}`);
            values.push(date);
        }

        const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

        const query = `
            SELECT id, pays, ville, agence, modele, categorie, prix, date_location
            FROM avis_location
            ${whereSQL}
            ORDER BY date_location DESC
            LIMIT $${count++}
            OFFSET $${count}
        `;

        values.push(limit);
        values.push(offset);

        const result = await db.query(query, values);

        res.status(200).json({
            count: result.rowCount,
            data: result.rows
        });
    } catch (err) {
        console.error('Erreur récupération AVIS :', err.message);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
