// routes/watchlistRoutes.js
const express = require('express');
const router = express.Router();
const watchlistController = require('../controllers/watchlistController');
const authMiddleware = require('../middleware/authMiddleware');

// Crear lista
router.post('/',authMiddleware ,watchlistController.createWatchlist);

// Añadir película
router.post('/:listId/add',authMiddleware ,watchlistController.addMovieToList);

// Obtener listas del usuario autenticado
router.get('/my',authMiddleware ,watchlistController.getMyLists);

// Obtener películas de un amigo (si es amigo)
router.get('/friend/:username',authMiddleware ,watchlistController.getFriendLists);

module.exports = router;
