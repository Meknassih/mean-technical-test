var express = require('express');
const { addImage, getImage, getImages, patchImage, deleteImage } = require('../controllers/imageController');
const { authenticate } = require('../middleware/authenticate');
var router = express.Router();

router.get('/', authenticate, getImages);
router.post('/', authenticate, addImage);
router.get('/:id', authenticate, getImage);
router.patch('/:id', authenticate, patchImage);
router.delete('/:id', authenticate, deleteImage);

module.exports = router;
