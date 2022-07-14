var express = require('express');
const { getHealthCheck } = require('../controllers/sharedController');
var router = express.Router();

/* GET home page. */
router.get('/', getHealthCheck);

module.exports = router;
