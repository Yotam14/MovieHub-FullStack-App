const Movie = require("../models/MovieModel");
const mongoose = require("mongoose");

 
//    - **Description:** Retrieves all movies from the database and returns them as a JSON array. 

//    - **Method:** HTTP GET 

//    - **Route:** `/movies` 

//    - **Response:** Returns an array of movie objects sorted by their creation date in descending order. 

//    - **Status Codes:** 

//      - 200: Success, returns the list of movies. 

//      - 500:: Internal Server Error, if there's an issue with the server.
const getMovies = async (req, res) => {
    const movies = await Movie.find({}).sort({ ceratedAt: -1 });
    res.status(200).json(movies);
};
// - **Description:** Retrieves a single movie by its ID from the database and returns it. 

//    - **Method:** HTTP GET 

//    - **Route:** `/movies/:id` 

//    - **Parameters:** 

//      - `id`: The ID of the movie to retrieve. 

//    - **Response:** Returns a single movie object if found, otherwise returns an error indicating that the movie was not found. 

//    - **Status Codes:** 

//      - 200: Success, returns the movie. 

//      - 400: Bad Request, if the provided ID is not valid or no such movie exists. 

//      - 500: Internal Server Error, if there's an issue with the server. 

const getMovie = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "no such movie" });
    }

    const movie = await Movie.findById(id);

    if (!movie) return res.status(400).json({ error: "Movie not found" });
    res.status(200).json(movie);
};


// Creates a new movie in the database based on the provided data. 

//    - **Method:** HTTP POST 

//    - **Route:** `/movies` 

//    - **Request Body:** 

//      - `title`: Title of the movie. 

//      - `genre`: Genre of the movie. 

//      - `summary`: Summary of the movie. 

//      - `director`: Director of the movie. 

//      - `year`: Year of release of the movie. 

//      - `image`: URL or path to the image of the movie. 

//    - **Response:** Returns the newly created movie object. 

//    - **Status Codes:** 

//      - 201: Created, movie successfully created. 

//      - 400: Bad Request, if any required field is missing in the request body. 

//      - 500: Internal Server Error, if there's an issue with the server. 

const createMovie = async (req, res) => {
    const { title, genre, summary, director, year, image } = req.body;
    let emptyFields = [];
    if (!title) emptyFields.push("title");
    if (!genre) emptyFields.push("genre");
    if (!summary) emptyFields.push("summary");
    if (!director) emptyFields.push("director");
    if (!year) emptyFields.push("year");
    if (!image) emptyFields.push("image");
    if (emptyFields.length > 0) {
        return res.status(400).json({
            error: "Please fill in all fields",
            emptyFields,
        });
    }
    //add doc to db
    try {
        const movie = await Movie.create({
            title,
            genre,
            summary,
            director,
            year,
            image,
        });
        res.status(201).json(movie);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// - **Description:** Deletes a movie from the database by its ID. 

// - **Method:** HTTP DELETE 

// - **Route:** `/movies/:id` 

// - **Parameters:** 

//   - `id`: The ID of the movie to delete. 

// - **Response:** Returns the deleted movie object if found and deleted successfully. 

// - **Status Codes:** 

//   - 200: Success, movie deleted. 

//   - 400: Bad Request, if the provided ID is not valid or no such movie exists. 

//   - 500: Internal Server Error, if there's an issue with the server. 
const deleteMovie = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "no such movie" });
    }

    const movie = await Movie.findOneAndDelete({ _id: id });

    if (!movie) return res.status(400).json({ error: "Movie not found" });
    res.status(200).json(movie);
};

// - **Description:** Updates a movie in the database by its ID with the provided data. 

//    - **Method:** HTTP PATCH 

//    - **Route:** `/movies/:id` 

//    - **Parameters:** 

//      - `id`: The ID of the movie to update. 

//    - **Request Body:** Any fields of the movie object to be updated. 

//    - **Response:** Returns the updated movie object. 

//    - **Status Codes:** 

//      - 200: Success, movie updated. 

//      - 400: Bad Request, if the provided ID is not valid or no such movie exists. 

//      - 500: Internal Server Error, if there's an issue with the server
const updateMovie = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "no such movie" });
    }

    const movie = await Movie.findOneAndUpdate({ _id: id }, { ...req.body });
    if (!movie) return res.status(400).json({ error: "Movie not found" });
    res.status(200).json(movie);
};

module.exports = {
    createMovie,
    getMovies,
    getMovie,
    deleteMovie,
    updateMovie,
};
