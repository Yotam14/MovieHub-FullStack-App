

// Description: 

// This function defines the routes for handling CRUD operations on movies in the application. 
//It specifies the endpoints for creating, retrieving, updating, and deleting movies, 
//along with the middleware functions required for authentication and role-based authorization. 

 

// Parameters: 

// - None 

 

// Returns: 

// - An Express Router object containing the defined routes for movie operations. 

 

// Notes: 

// - The routes are organized using Express Router to group related endpoints together. 

// - The `requireAuth` middleware is used to ensure that all movie routes require authentication. It verifies the presence and validity of JWTs in the request headers. 

// - The `requireRole` middleware is used to restrict access to routes that require administrative privileges. It ensures that only users with the "admin" role can perform certain operations like creating, updating, and deleting movies. 

// - The routes are mapped to corresponding controller functions (`createMovie`, `getMovies`, `getMovie`, `deleteMovie`, `updateMovie`) defined in the `movieController` module. 

// - Each route specifies the HTTP method (e.g., GET, POST, DELETE) and the URL path. 

// - Middleware functions (`requireAuth` and `requireRole`) are applied using the `router.use` method to enforce authentication and role-based authorization for all movie routes and specific routes respectively. 
const express = require("express");


const {
    createMovie,
    getMovies,
    getMovie,
    deleteMovie,
    updateMovie,
} = require("../controllers/movieController");
const requireAuth = require("../middleware/requireAuth");
const requireRole = require("../middleware/requireRole");
const router = express.Router();

//Requires authentication for all movie routes. 
router.use(requireAuth);

// GET all movies
router.get("/", getMovies);

//GET a single movie
router.get("/:id", getMovie);

// require admin role for the following routes
router.use(requireRole);

//Creates a new movie in the database
router.post("/", createMovie);

//Deletes a movie from the database by its ID
router.delete("/:id", deleteMovie);

// Updates a movie in the database by its ID
router.patch("/:id", updateMovie);

module.exports = router;
