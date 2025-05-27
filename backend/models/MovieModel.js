const mongoose = require("mongoose");


// This function defines the schema for the "Movie" collection in MongoDB. 

//It specifies the structure of documents stored in the "Movie" collection, 

//including fields such as title, genre, summary, director, year, and image, along with their data types and validation rules. 

// Parameters: 

// - None 

// Returns: 

// - A Mongoose schema object representing the structure and validation rules for documents in the "Movie" collection. 

 

// Notes: 

// - This schema ensures that documents inserted into the "Movie" collection adhere to the specified structure and constraints. 

// - Fields such as `title`, `genre`, `summary`, `director`, `year`, and `image` are required and must be of type String. 

// -The schema facilitates consistent storage and retrieval of movie data in MongoDB. 

  
const Schema = mongoose.Schema;
//Defines the structure of the Movie model using Mongoose Schema. 
 //- **Fields:** 

//     - `title` (String): The title of the movie. 

//     - `genre` (String): The genre of the movie. 

 //    - `summary` (String): A brief summary or description of the movie. 

  //   - `director` (String): The director of the movie. 

  //   - `year` (String): The release year of the movie. 

  //   - `image` (String): The URL to the image associated with the movie. 

  // - **Validation:** 

  //   - All fields are required. 

   //- **Exports:** The Movie model created using `mongoose.model`.

const movieSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    genre: {
        type: String,
        required: true,
    },
    summary: {
        type: String,
        required: true,
    },
    director: {
        type: String,
        required: true,
    },
    year: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Movie", movieSchema);
