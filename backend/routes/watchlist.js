const express = require('express');
const watchlistController = require('../controllers/watchlistController'); // Adjust the path as needed
const requireAuth = require('../middleware/requireAuth'); // Assuming you have an authentication middleware

const router = express.Router();

// Require authentication for all watchlist routes
router.use(requireAuth);

// Add a movie to the watchlist
// Now using the movieId in the route and relying on authentication to know the user
router.post('/add/:movieId', watchlistController.addMovieToWatchlist);

// Remove a movie from the watchlist
// Assuming removal also uses authentication to identify the user rather than URL parameters
router.delete('/remove/:movieId', watchlistController.removeMovieFromWatchlist);

// Fetch the user's watchlist
// Now simply relying on authentication to identify the user, no need for userId in the URL
router.get('/:userId', watchlistController.fetchWatchlist);

module.exports = router;
