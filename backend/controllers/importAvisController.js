const path = require('path');

module.exports = async function importAvisHandler(req, res) {
    try {
        const importer = require(path.join(__dirname, '../services/scrapping/importAvisService'));
        await importer.run(); // Assure-toi que ton service expose `run()`
        res.status(200).json({ message: 'Importation terminée avec succès.' });
    } catch (err) {
        console.error('Erreur importation AVIS :', err);
        res.status(500).json({ error: 'Erreur lors de l’importation AVIS.' });
    }
};
