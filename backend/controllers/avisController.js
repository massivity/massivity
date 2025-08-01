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

        console.log('📥 Requête reçue avec filtres :', { ville, modele, agence, date, limit, offset });

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
        console.log('🔍 WHERE SQL:', whereSQL);
        console.log('📦 Valeurs SQL:', values);

        // Requête de comptage total
        const countQuery = `SELECT COUNT(*) FROM avis_location ${whereSQL}`;
        console.log('📊 Exécution de la requête de comptage...');
        const countResult = await db.query(countQuery, values);
        const totalCount = parseInt(countResult.rows[0].count);
        console.log(`📊 Total d’enregistrements trouvés : ${totalCount}`);

        // Requête paginée
        const dataQuery = `
            SELECT id, pays, region, departement, code_postal,
                   ville, agence, categorie, genre, modele, kilometrage,
                   prix, periode, duree, ip,
                   date_location, date_maj
            FROM avis_location
            ${whereSQL}
            ORDER BY date_location DESC
            LIMIT $${count++}
            OFFSET $${count}
        `;
        const pagedValues = [...values, limit, offset];

        console.log('📥 Exécution de la requête paginée...');
        const result = await db.query(dataQuery, pagedValues);
        console.log(`✅ Résultats récupérés : ${result.rowCount}`);

        res.status(200).json({
            count: totalCount,
            data: result.rows
        });
    } catch (err) {
        console.error('❌ Erreur récupération AVIS :', err.message);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
