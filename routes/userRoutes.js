const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');
const router = express.Router();

router.get('/get-users', authMiddleware, userController.getUsers);
router.post('/login', userController.loginUser);
router.post('/register', userController.createUser);

module.exports = router;
