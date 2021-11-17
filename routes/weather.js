const express = require('express');
const router = express.Router();

router.use('/', require('./places/index'));
router.use('/', require('./places/place'));

module.exports = router;