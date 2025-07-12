const express = require('express');
const router = express.Router();
const agenciesCtrl = require('../../controllers/scrappingAgencies.controller');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Middlewares d’authentification/autorisation
const { authenticateToken, authorizeRole } = require('../../middleware/auth');

// GET : accessible à tous les utilisateurs connectés
router.get('/', authenticateToken, (req, res, next) => {
    console.log(`[${new Date().toISOString()}] [USER:${req.user?.id || 'inconnu'}] GET agencies - concurrent: ${req.query.concurrent || 'ALL'}`);
    return agenciesCtrl.list(req, res, next);
});

// Les routes suivantes : uniquement admin
router.post('/', authenticateToken, authorizeRole('admin'), (req, res, next) => {
    console.log(`[${new Date().toISOString()}] [ADMIN:${req.user?.id}] POST create agency - ${JSON.stringify(req.body)}`);
    return agenciesCtrl.create(req, res, next);
});

router.patch('/:id', authenticateToken, authorizeRole('admin'), (req, res, next) => {
    console.log(`[${new Date().toISOString()}] [ADMIN:${req.user?.id}] PATCH update agency #${req.params.id} - ${JSON.stringify(req.body)}`);
    return agenciesCtrl.update(req, res, next);
});

router.patch('/:id/activate', authenticateToken, authorizeRole('admin'), (req, res, next) => {
    console.log(`[${new Date().toISOString()}] [ADMIN:${req.user?.id}] PATCH activate/deactivate agency #${req.params.id}`);
    return agenciesCtrl.toggleActive(req, res, next);
});

router.delete('/:id', authenticateToken, authorizeRole('admin'), (req, res, next) => {
    console.log(`[${new Date().toISOString()}] [ADMIN:${req.user?.id}] DELETE agency #${req.params.id}`);
    return agenciesCtrl.delete(req, res, next);
});

router.post('/import', authenticateToken, authorizeRole('admin'), upload.single('file'), (req, res, next) => {
    console.log(`[${new Date().toISOString()}] [ADMIN:${req.user?.id}] IMPORT agencies file - concurrent: ${req.body.concurrent || req.query.concurrent || '???'}`);
    return agenciesCtrl.importXlsx(req, res, next);
});

module.exports = router;
