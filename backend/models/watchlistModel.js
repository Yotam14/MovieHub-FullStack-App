const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require('./userModel'); 
const Movie = require('./MovieModel'); 

// Description: 

// This function defines the schema for the "Watchlist" collection in MongoDB. It specifies the structure of 
//documents stored in the "Watchlist" collection, including fields such as user and movies, along with their data types 
//and validation rules. 


// Parameters: 

// - None 


// Returns: 

// - A Mongoose schema object representing the structure and validation rules for documents in the "Watchlist" collection. 

 
// Notes: 

// - The schema ensures that watchlist documents inserted into the "Watchlist" collection adhere to the specified structure and constraints. 

// - The `user` field references the `User` collection using its ObjectId, ensuring a one-to-one relationship between users and their watchlists. 

// - The `movies` field is an array of ObjectIds referencing documents in the `Movie` collection, allowing users to store multiple movies in their watchlists. 

// - The `fetchWatchlist` static method is defined to fetch a user's watchlist by their email. It first finds the user by email, then retrieves their watchlist and populates the `movies` field to return the full movie documents. 

// - The `addToWatchlist` static method is defined to add a movie to a user's watchlist. It validates the provided email and movieId, finds the user and movie by their respective IDs, and either creates a new watchlist document or updates an existing one to include the new movie. 

// - The `removeFromWatchlist` static method is defined to remove a movie from a user's watchlist. It validates the provided email and movieId, finds the user and movie by their respective IDs, ensures the movie is in the user's watchlist, and removes it if found. 

const watchlistSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    unique: true,
    required: true,
  },
  movies: [{
    type: Schema.Types.ObjectId,
    ref: 'Movie',
    required: true,
  }],
}, { timestamps: true });

watchlistSchema.statics.fetchWatchlist = async function (email) {
    if (!email) {
      throw new Error("Email is required to fetch the watchlist.");
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("User not found.");
    }

    const watchlist = await this.findOne({ user: user._id })
                                .populate('movies');
  
    if (!watchlist) {
      throw new Error("Watchlist not found.");
    }

   
    return watchlist.movies;
};


watchlistSchema.statics.addToWatchlist = async function(email, movieId) {
  if (!email || !movieId) {
    throw new Error("Both email and movieId are required.");
  }

  const user = await User.findOne({ email: email });
  if (!user) {
    throw new Error("User not found.");
  }

  const movie = await Movie.findById(movieId);
  if (!movie) {
    throw new Error("Movie not found.");
  }

  let watchlist = await this.findOne({ user: user._id });

  if (!watchlist) {
    watchlist = await this.create({
      user: user._id,
      movies: [movie._id]
    });
  } else {
    if (watchlist.movies.find(movieIdInList => movieIdInList.equals(movieId))) {
      throw new Error("Movie already in watchlist.");
    }
    watchlist.movies.push(movie._id);
    await watchlist.save();
  }

  return watchlist;
};

watchlistSchema.statics.removeFromWatchlist = async function(email, movieId) {

  if (!email || !movieId) {
      throw new Error("Both email and movieId are required.");
  }

  
  const user = await User.findOne({ email: email });
  if (!user) {
      throw new Error("User not found.");
  }


  const movie = await Movie.findById(movieId);
  if (!movie) {
      throw new Error("Movie not found.");
  }


  let watchlist = await this.findOne({ user: user._id });


  if (!watchlist || !watchlist.movies.includes(movieId)) {
      throw new Error("Movie not in watchlist.");
  }


  watchlist.movies = watchlist.movies.filter(id => id.toString() !== movieId.toString());
  await watchlist.save();

  return movieId;
};


module.exports = mongoose.model("Watchlist", watchlistSchema);
