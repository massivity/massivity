const express = require('express');
const router = express.Router();
const { getChangelogs, createChangelog } = require('../controllers/changelogController');

router.get('/', getChangelogs);
router.post('/', createChangelog);

module.exports = router;
