const express = require('express');
const ctrl = require('../controllers/notificationController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

router.use(requireAuth);
router.get('/', ctrl.index);
router.post('/read-all', ctrl.markAllRead);
router.post('/:id/read', ctrl.markRead);

module.exports = router;
