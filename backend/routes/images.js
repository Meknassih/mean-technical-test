var express = require('express');
const { addImage, getImage, getImages } = require('../controllers/imageController');
const { authenticate } = require('../middleware/authenticate');
var router = express.Router();

router.get('/', authenticate, getImages);
router.post('/', authenticate, addImage);
router.get('/:id', authenticate, getImage);

module.exports = router;
