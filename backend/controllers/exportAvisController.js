const db = require('../models/db');
const XLSX = require('xlsx');

exports.exportAvisToXlsx = async (req, res) => {
    try {
        const { ville, modele, agence, date } = req.query;

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
            whereClauses.push(`DATE(date_location) = $${count++}`);
            values.push(date);
        }

        const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

        const query = `
            SELECT date_location, ville, agence, modele, prix, periode, duree, ip
            FROM avis_location
            ${whereSQL}
            ORDER BY date_location DESC
        `;

        const result = await db.query(query, values);

        const formattedRows = result.rows.map(row => ({
            Date: row.date_location?.toISOString().split('T')[0],
            Ville: row.ville,
            Agence: row.agence,
            Modèle: row.modele,
            Prix: row.prix,
            Période: row.periode,
            Durée: row.duree,
            IP: row.ip
        }));

        const worksheet = XLSX.utils.json_to_sheet(formattedRows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Locations AVIS');

        const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

        res.setHeader('Content-Disposition', 'attachment; filename="avis_export.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer);
    } catch (err) {
        console.error('❌ Erreur export XLSX :', err.message);
        res.status(500).json({ error: 'Erreur export' });
    }
};
