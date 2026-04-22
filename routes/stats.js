const express = require('express');
const ctrl = require('../controllers/statsController');

const router = express.Router();
router.get('/', ctrl.index);

module.exports = router;
