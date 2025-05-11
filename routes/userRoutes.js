const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');
const router = express.Router();

router.get('/GetUsers', authMiddleware, userController.getUsers);
router.get('/Login', authMiddleware, userController.loginUser);
router.post('/Register', userController.createUser);

module.exports = router;
