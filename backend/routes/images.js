var express = require('express');
const { addImage, getImage } = require('../controllers/imageController');
const { authenticate } = require('../middleware/authenticate');
var router = express.Router();

router.get('/:id', authenticate, getImage);
router.post('/', authenticate, addImage);

module.exports = router;
