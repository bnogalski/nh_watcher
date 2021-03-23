const express = require('express');

const statusController = require('../controllers/status');
const isAuth = require('../middleware/is-auth').isAuthExpress;

const router = express.Router();

// GET /status/rigs
router.get('/rigs', statusController.getRigs);

router.post('/rigs/stop/:rigId', isAuth, statusController.stopRig);
router.post('/rigs/start/:rigId', isAuth, statusController.startRig);
router.post('/rigs/restart/:rigId', isAuth, statusController.restartRig);

router.post('/rigs/control', isAuth, statusController.control);

module.exports = router;
