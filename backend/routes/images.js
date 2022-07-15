var express = require('express');
const { addImage } = require('../controllers/imageController');
const { authenticate } = require('../middleware/authenticate');
var router = express.Router();

router.post('/', authenticate, addImage);

module.exports = router;
