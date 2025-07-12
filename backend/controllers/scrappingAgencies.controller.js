// backend/controllers/scrappingAgencies.controller.js

const pool = require('../models/db');
const ExcelJS = require('exceljs');
const fs = require('fs');

function now() { return new Date().toISOString(); }

// Liste des agences
exports.list = async (req, res) => {
    try {
        const { concurrent } = req.query;
        console.log(`[${now()}] [LIST] concurrent=${concurrent || 'ALL'} demandé par user:${req.user?.id || 'inconnu'}`);
        let query = 'SELECT * FROM scraping_agencies';
        let params = [];
        if (concurrent) {
            query += ' WHERE concurrent = $1';
            params.push(concurrent);
        }
        query += ' ORDER BY concurrent, ville, agence';
        const { rows } = await pool.query(query, params);
        console.log(`[${now()}] [LIST] ${rows.length} agences trouvées`);
        res.json(rows);
    } catch (err) {
        console.error(`[${now()}] [ERROR][LIST]`, err);
        res.status(500).json({ error: err.message });
    }
};

// Ajouter une agence
exports.create = async (req, res) => {
    try {
        const { concurrent, ville, agence, meta } = req.body;
        console.log(`[${now()}] [CREATE] Demande de création : concurrent=${concurrent} / ville=${ville} / agence=${agence} par user:${req.user?.id || 'inconnu'}`);
        const exists = await pool.query(
            'SELECT 1 FROM scraping_agencies WHERE concurrent=$1 AND LOWER(ville)=LOWER($2) AND LOWER(agence)=LOWER($3)',
            [concurrent, ville.trim(), agence.trim()]
        );
        if (exists.rowCount > 0) {
            console.log(`[${now()}] [CREATE] Agence déjà existante`);
            return res.status(409).json({ error: 'Déjà existante.' });
        }

        const { rows } = await pool.query(
            `INSERT INTO scraping_agencies (concurrent, ville, agence, active, meta, created_at, updated_at)
             VALUES ($1, $2, $3, true, $4, NOW(), NOW()) RETURNING *`,
            [concurrent, ville.trim(), agence.trim(), meta ? JSON.stringify(meta) : null]
        );
        console.log(`[${now()}] [CREATE] Agence créée avec succès (id=${rows[0].id})`);
        res.status(201).json(rows[0]);
    } catch (err) {
        console.error(`[${now()}] [ERROR][CREATE]`, err);
        res.status(500).json({ error: err.message });
    }
};

// Modifier une agence
exports.update = async (req, res) => {
    try {
        const id = req.params.id;
        const { ville, agence, meta } = req.body;
        console.log(`[${now()}] [UPDATE] Agence #${id} nouvelle valeurs : ville=${ville}, agence=${agence} par user:${req.user?.id || 'inconnu'}`);
        const { rows } = await pool.query(
            `UPDATE scraping_agencies SET ville=$1, agence=$2, meta=$3, updated_at=NOW() WHERE id=$4 RETURNING *`,
            [ville.trim(), agence.trim(), meta ? JSON.stringify(meta) : null, id]
        );
        if (rows.length === 0) {
            console.log(`[${now()}] [UPDATE] Agence non trouvée`);
            return res.status(404).json({ error: 'Non trouvée.' });
        }
        console.log(`[${now()}] [UPDATE] Agence #${id} modifiée avec succès`);
        res.json(rows[0]);
    } catch (err) {
        console.error(`[${now()}] [ERROR][UPDATE]`, err);
        res.status(500).json({ error: err.message });
    }
};

// Activer/désactiver une agence
exports.toggleActive = async (req, res) => {
    try {
        const id = req.params.id;
        console.log(`[${now()}] [TOGGLE] Changement statut actif agence #${id} par user:${req.user?.id || 'inconnu'}`);
        const { rows } = await pool.query('SELECT active FROM scraping_agencies WHERE id=$1', [id]);
        if (rows.length === 0) {
            console.log(`[${now()}] [TOGGLE] Agence non trouvée`);
            return res.status(404).json({ error: 'Non trouvée.' });
        }
        const newActive = !rows[0].active;
        const { rows: updated } = await pool.query(
            'UPDATE scraping_agencies SET active=$1, updated_at=NOW() WHERE id=$2 RETURNING *',
            [newActive, id]
        );
        console.log(`[${now()}] [TOGGLE] Agence #${id} => active=${newActive}`);
        res.json(updated[0]);
    } catch (err) {
        console.error(`[${now()}] [ERROR][TOGGLE]`, err);
        res.status(500).json({ error: err.message });
    }
};

// Supprimer une agence
exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        console.log(`[${now()}] [DELETE] Suppression agence #${id} par user:${req.user?.id || 'inconnu'}`);
        await pool.query('DELETE FROM scraping_agencies WHERE id=$1', [id]);
        res.status(204).send();
        console.log(`[${now()}] [DELETE] Agence #${id} supprimée`);
    } catch (err) {
        console.error(`[${now()}] [ERROR][DELETE]`, err);
        res.status(500).json({ error: err.message });
    }
};

// Import XLSX avec SKIP des doublons
exports.importXlsx = async (req, res) => {
    try {
        const filePath = req.file.path;
        const concurrent = req.body.concurrent || req.query.concurrent;
        console.log(`[${now()}] [IMPORT] Import d'agences concurrent=${concurrent} lancé par user:${req.user?.id || 'inconnu'}`);
        if (!concurrent) {
            console.log(`[${now()}] [IMPORT] Concurrent manquant`);
            return res.status(400).json({ error: "Concurrent manquant" });
        }

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        const sheet = workbook.worksheets[0];
        const agencies = [];
        sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            if (rowNumber === 1) return; // header
            agencies.push({
                ville: (row.getCell(1).text || '').trim(),
                agence: (row.getCell(2).text || '').trim(),
            });
        });

        const existQuery = await pool.query('SELECT ville, agence FROM scraping_agencies WHERE concurrent=$1', [concurrent]);
        const skipSet = new Set(existQuery.rows.map(a => `${a.ville.toLowerCase().trim()}|||${a.agence.toLowerCase().trim()}`));

        let imported = 0, skipped = 0;
        for (const row of agencies) {
            const key = `${row.ville.toLowerCase().trim()}|||${row.agence.toLowerCase().trim()}`;
            if (skipSet.has(key)) {
                skipped++;
                continue;
            }
            await pool.query(
                `INSERT INTO scraping_agencies (concurrent, ville, agence, active, created_at, updated_at)
                 VALUES ($1, $2, $3, true, NOW(), NOW())`,
                [concurrent, row.ville, row.agence]
            );
            imported++;
            skipSet.add(key);
        }
        fs.unlinkSync(filePath);

        console.log(`[${now()}] [IMPORT] Import terminé. Ajoutées: ${imported}, doublons: ${skipped}, total: ${agencies.length}`);
        res.json({ imported, skipped, total: agencies.length });
    } catch (err) {
        console.error(`[${now()}] [ERROR][IMPORT]`, err);
        res.status(500).json({ error: err.message });
    }
};
