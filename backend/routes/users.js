var express = require('express');
const { register, login } = require('../controllers/userController');
var router = express.Router();

router.post('/', login);
router.put('/', register);

module.exports = router;
