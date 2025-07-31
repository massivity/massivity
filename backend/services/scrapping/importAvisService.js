const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const db = require('../../models/db'); // Connexion pg
const { parse } = require('date-fns');
const { fr } = require('date-fns/locale');

const SOURCE_DIR = path.join(__dirname, '..', '..', 'data', 'avis');
const PROCESSED_DIR = path.join(SOURCE_DIR, 'processed');

if (!fs.existsSync(PROCESSED_DIR)) {
    fs.mkdirSync(PROCESSED_DIR);
}

const importAvisFromFile = async (filePath) => {
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    for (const row of data) {
        try {
            const parsedDate = parse(row['Date'], 'dd/MM/yyyy', new Date(), { locale: fr });
            const parsedMaj = parse(row['MAJ'], 'dd/MM/yyyy', new Date(), { locale: fr });

            const exists = await db.query(
                `SELECT 1 FROM avis_location
                 WHERE agence = $1 AND modele = $2 AND date_location = $3`,
                [row['Agence'], row['Modele'], parsedDate]
            );

            if (exists.rowCount === 0) {
                await db.query(
                    `INSERT INTO avis_location (
                        pays, region, departement, code_postal, ville, agence,
                        categorie, genre, modele, kilometrage, prix,
                        periode, duree, date_location, date_maj, ip
                    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)`,
                    [
                        row['Pays'],
                        row['Région'],
                        row['Département'],
                        row['Code Postal'],
                        row['ville'],
                        row['Agence'],
                        row['Catégorie'],
                        row['Genre'],
                        row['Modele'],
                        row['kilometrage'],
                        parseFloat(row['Prix']),
                        row['Période'],
                        row['Durée'],
                        parsedDate,
                        parsedMaj,
                        row['IP']
                    ]
                );
                console.log(`✅ Inséré : ${row['Agence']} - ${row['Modele']} - ${row['Date']}`);
            } else {
                console.log(`↪️ Déjà existant : ${row['Agence']} - ${row['Modele']} - ${row['Date']}`);
            }
        } catch (err) {
            console.error('❌ Erreur lors de l’insertion :', err.message);
        }
    }

    const destPath = path.join(PROCESSED_DIR, path.basename(filePath));
    fs.renameSync(filePath, destPath);
    console.log(`📁 Fichier déplacé : ${destPath}`);
};

const runImport = async () => {
    const files = fs.readdirSync(SOURCE_DIR).filter(f => f.endsWith('.xlsx'));

    for (const file of files) {
        const fullPath = path.join(SOURCE_DIR, file);
        console.log(`📄 Traitement du fichier : ${file}`);
        await importAvisFromFile(fullPath);
    }

    console.log('✅ Importation terminée.');
};

module.exports = { run: runImport };

if (require.main === module) {
    runImport().then(() => process.exit(0));
}
