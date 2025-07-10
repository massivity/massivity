// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();

router.use(require('./registerRoute'));
router.use(require('./loginRoute'));
router.use(require('./profilRoute'));
router.use(require('./logoutRoute'));
router.use(require('./accountRoute'));
router.use(require('./refreshRoute'));

module.exports = router;
