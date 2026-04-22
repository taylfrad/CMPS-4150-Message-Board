const express = require('express');
const ctrl = require('../controllers/authController');

const router = express.Router();

router.get('/register', ctrl.getRegister);
router.post('/register', ctrl.postRegister);
router.get('/login', ctrl.getLogin);
router.post('/login', ctrl.postLogin);
router.post('/logout', ctrl.postLogout);

module.exports = router;
