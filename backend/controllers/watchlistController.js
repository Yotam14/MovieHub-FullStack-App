const Watchlist = require("../models/watchlistModel");

//    - **Description:** Removes a movie from a user's watchlist.

//    - **Method:** HTTP DELETE

//    - **Route:** `/watchlist/:movieId`

//    - **URL Parameters:**

//      - `movieId`: The ID of the movie to be removed from the watchlist.

//    - **Request Body:**

//      - `userEmail`: Email of the user whose watchlist is being modified.

//    - **Response:** Returns the removed movie object.

//    - **Status Codes:**

//      - 201: Created, movie removed from the watchlist successfully.

//      - 400: Bad Request, if there's an error in the request or removing the movie from the watchlist fails.
exports.removeMovieFromWatchlist = async (req, res) => {
    const { movieId } = req.params; // Assuming userId and movieId are passed as URL parameters
    const userEmail = req.body.userEmail;
    try {
        const movie = await Watchlist.removeFromWatchlist(userEmail, movieId);
        res.status(201).json(movie);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// **Description:** Adds a movie to a user's watchlist.

// - **Method:** HTTP POST

// - **Route:** `/watchlist/:movieId`

// - **URL Parameters:**

//   - `movieId`: The ID of the movie to be added to the watchlist.

// - **Request Body:**

//   - `userEmail`: Email of the user whose watchlist is being modified.

// - **Response:** Returns a success message indicating that the movie was added to the watchlist successfully.

// - **Status Codes:**

//   - 201: Created, movie added to the watchlist successfully.

//   - 400: Bad Request, if there's an error in the request or adding the movie to the watchlist fails.

exports.addMovieToWatchlist = async (req, res) => {
    const { movieId } = req.params; // Assuming userId and movieId are passed as URL parameters
    const userEmail = req.body.userEmail;

    try {
        await Watchlist.addToWatchlist(userEmail, movieId);
        res.status(201).json({
            message: "Movie added to watchlist successfully",
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Description:** Fetches the watchlist for a user.

//    - **Method:** HTTP GET

//    - **Route:** `/watchlist/:userId`

//    - **URL Parameters:**

//      - `userId`: The ID of the user whose watchlist is being fetched.

//    - **Response:** Returns an array of movie objects representing the user's watchlist.

//    - **Status Codes:**

//      - 200: Success, returns the user's watchlist.

//      - 400: Bad Request, if there's an error in the request or fetching the watchlist fails.

exports.fetchWatchlist = async (req, res) => {
    const { userId } = req.params; // Assuming userId is passed as a URL parameter

    try {
        const movies = await Watchlist.fetchWatchlist(userId);
        res.status(200).json(movies);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
