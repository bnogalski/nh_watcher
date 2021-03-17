const express = require('express');

const statusController = require('../controllers/status');

const router = express.Router();

// GET /status/rigs
router.get('/rigs', statusController.gitRigs);

module.exports = router;