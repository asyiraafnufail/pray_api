const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

router.post('/generate-key', apiController.generateKey);
router.get('/schedule', apiController.getSchedule);

module.exports = router;