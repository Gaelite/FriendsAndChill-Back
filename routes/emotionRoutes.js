const express = require('express');
const router = express.Router();
const { getMovieRecommendation } = require('../controllers/emotionController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/emotion/predict
router.post('/predict', getMovieRecommendation);

module.exports = router;
