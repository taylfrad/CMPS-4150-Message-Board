const express = require('express');
const ctrl = require('../controllers/topicController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

router.get('/', ctrl.index);
router.get('/new', requireAuth, ctrl.newForm);
router.post('/', requireAuth, ctrl.create);
router.get('/:id', ctrl.show);
router.post('/:id/messages', requireAuth, ctrl.postMessage);
router.post('/:id/subscribe', requireAuth, ctrl.subscribe);
router.post('/:id/unsubscribe', requireAuth, ctrl.unsubscribe);

module.exports = router;
