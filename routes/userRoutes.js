const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

// 🔐 Autenticación
router.post('/register', userController.createUser);
router.post('/login', userController.loginUser);

// 👥 Usuarios
router.get('/getUsers', authMiddleware, userController.getUsers);
router.get('/searchUser/:username', authMiddleware, userController.searchUser);

// 🤝 Solicitudes de amistad
router.post('/sendFriendRequest', authMiddleware, userController.sendFriendRequest);
router.post('/acceptFriendRequest', authMiddleware, userController.acceptFriendRequest);
router.post('/rejectFriendRequest', authMiddleware, userController.rejectFriendRequest);

// 📥 Consultas relacionadas con amistad
router.get('/getFriendRequestsReceived', authMiddleware, userController.getFriendRequestsReceived);
router.get('/getFriends', authMiddleware, userController.getFriends);

module.exports = router;
