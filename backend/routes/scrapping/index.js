const express = require('express');
const router = express.Router();

router.use('/agencies', require('./agencies'));

module.exports = router;