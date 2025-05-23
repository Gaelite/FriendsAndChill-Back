const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, groupController.createGroup);
router.get('/', authMiddleware, groupController.getUserGroups);

router.post('/:groupId/movies', authMiddleware, groupController.addMovieToGroup);
router.get('/:groupId/movies', authMiddleware, groupController.getGroupMovies);
router.delete('/:groupId/movies/:tmdbId', authMiddleware, groupController.deleteMovieFromGroup);
router.post('/add-member/:groupId', authMiddleware, groupController.addMemberToGroup);
module.exports = router;
