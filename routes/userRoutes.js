const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', authMiddleware, userController.getUsers);
router.post('/', userController.createUser);

module.exports = router;
