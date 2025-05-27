const express = require("express");

const router = express.Router();


// 1. **Express Setup**: It imports Express and sets up a router. 

// 2. **Middleware**: It imports `requireAuth`, presumably a middleware function that ensures authentication before allowing access to the routes. 

// 3. **Route Definitions**: 

//    - **Adding a Movie to Watchlist**: This route handles POST requests to add a movie to the watchlist. The `:movieId` parameter in the route URL specifies which movie to add. It calls the `addMovieToWatchlist` function from the `watchlistController`. 

//    - **Removing a Movie from Watchlist**: This route handles DELETE requests to remove a movie from the watchlist. Similar to the adding route, it uses the `:movieId` parameter and calls the `removeMovieFromWatchlist` function. 

//    - **Fetching User's Watchlist**: This route handles GET requests to fetch a user's watchlist. It relies on the authenticated user's identity, presumably extracted from the authentication middleware. There's no need to include `userId` in the URL since the authentication middleware handles user identification. 

// 4. **Export**: It exports the router for use in other parts of the application. 

// This setup assumes that authentication is handled separately, likely by the `requireAuth` middleware, which ensures that only authenticated users can access these routes. The controller functions (`addMovieToWatchlist`, `removeMovieFromWatchlist`, and `fetchWatchlist`) are responsible for the business logic associated with these actions. 
const {
    signupUser,
    loginUser,
    getUsers,
    changeUserRole,
    deleteUser,
} = require("../controllers/userController");
const requireRole = require("../middleware/requireRole");
const { get } = require("mongoose");

// Handles user login requests.
router.post("/login", loginUser);

// Handles user signup requests.
router.post("/signup", signupUser);

//Requires admin role for the following routes.
router.use(requireRole);

// Retrieves all users from the database. 

router.get("/getUsers", getUsers);

// change user role
router.post("/changeUserRole/:id", changeUserRole);

// DELETE a movie
router.delete("/:id", deleteUser);

module.exports = router;
