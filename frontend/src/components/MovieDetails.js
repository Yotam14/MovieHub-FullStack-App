import { useMoviesContext } from "../hooks/useMoviesContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useState } from "react";
import { Slide, Fade } from "react-awesome-reveal";
import { HiOutlineInformationCircle } from "react-icons/hi2";
import { CiCirclePlus } from "react-icons/ci";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { AiOutlineDelete } from "react-icons/ai";


/**
 * MovieDetails Component
 * Displays details about a movie and provides options like viewing more details, adding to the watchlist, and deleting the movie (for admins).
 * @param {object} props - Props for the MovieDetails component.
 * @param {object} props.movie - The movie object containing details.
 * @param {Function} props.onDelete - Callback function to delete a movie.
 * @returns {JSX.Element} MovieDetails component.
 */
const MovieDetails = ({ movie, onDelete }) => {
    // Accesses the movies context to dispatch actions related to movies.
    const { dispatch } = useMoviesContext();
    // Accesses the authentication context to retrieve user information.
    const { user } = useAuthContext();
    // State to toggle the display of additional movie details.
    const [showDetails, setShowDetails] = useState(false);

    // Handles the deletion of a movie.
    const handleDelete = async () => {
        if (!user) {
            return;
        }
        if (user.role !== "admin") {
            return;
        }
        const response = await fetch(
            "https://moviehub-server.onrender.com:443" +
                "/api/movies/" +
                movie._id,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }
        );
        const json = await response.json();
        if (response.ok) {
            dispatch({ type: "DELETE_MOVIE", payload: movie._id });
            onDelete(movie._id); // Invokes the callback function to update the UI.
            alert("Movie Deleted Successfully.");
        }
    };

    //Toggles the display of additional movie details modal.
    const handleModalToggle = () => {
        setShowDetails(!showDetails); 
    };

    // Updated function to handle adding a movie to the watchlist
    const handleAddToWatchlistClick = async () => {
        if (!user) {
            return;
        }
        // Include the user's email in the body of the request
        const body = JSON.stringify({
            userEmail: user.email, // Assuming 'user' object contains an 'email' field
            movieId: movie._id, // This might be redundant if you're already specifying the movie ID in the URL
        });

        const response = await fetch(
            "https://moviehub-server.onrender.com:443" +
                "/api/watchlist/add/" +
                movie._id,
            {
                method: "POST", // Keep as POST since we're adding to the watchlist
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
                body: body, // Include the body in the request
            }
        );
        const json = await response.json();
        if (response.ok) {
            // Assuming you have a dispatch action for adding to the watchlist
            dispatch({ type: "ADD_MOVIE_TO_WATCHLIST", payload: json });
            alert("Movie Added To Watchlist Successfully.");
        } else {
            alert("The Movie Is Already In Watchlist!");
        }
    };

    return (
        <div className="movie-card bg-gray-100 rounded-lg overflow-hidden shadow-lg mb-6 mr-15 w-[250px] relative flex flex-col group">
            <img
                src={movie.image}
                alt={movie.title}
                className="w-[300px] h-[300px] rounded-lg "
            />
            <div className="absolute left-0 top-0 bottom-0 opacity-0 group-hover:opacity-100 p-4 w-full bg-black/60 group-hover:backdrop-blur-sm duration-500">
                <div className="h-full flex flex-col justify-center text-white text-center">
                    <Slide cascade>
                        <h1 className="text-3xl font-bold mb-4">
                            {movie.title}
                        </h1>
                        <div>
                            <button
                                title="More Details"
                                className="bg-transplant text-white px-3 py-3 rounded-lg duration-300 hover:bg-gray-400"
                                onClick={handleModalToggle}
                            >
                                <HiOutlineInformationCircle className="text-3xl" />
                            </button>
                            <button
                                title="Add to Watchlist"
                                className="bg-transplant text-white ml-5 px-3 py-3 rounded-lg duration-300 hover:bg-gray-400"
                                onClick={handleAddToWatchlistClick}
                            >
                                <CiCirclePlus className="text-3xl" />
                            </button>
                            {user && user.role === "admin" && (
                                <button
                                    title="Delete Movie"
                                    className="bg-transplant text-white ml-5 px-3 py-3 rounded-lg duration-300 hover:bg-gray-400"
                                    onClick={handleDelete}
                                >
                                    <AiOutlineDelete className="text-3xl" />
                                </button>
                            )}
                        </div>
                    </Slide>
                </div>
            </div>

            {showDetails && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center z-50 ">
                    <div className="bg-white p-8 rounded-lg w-4/6 relative flex dark:bg-gray-600 dark:text-gray-100">
                        <img
                            src={movie.image}
                            alt={movie.title}
                            className="w-[300px] h-[300px] rounded-lg mr-4"
                        />
                        <button
                            onClick={() => setShowDetails(false)}
                            className="absolute top-4 right-4 text-xl text-gray-800 hover:text-gray-600 dark:hover:text-gray-100"
                        >
                            <IoIosCloseCircleOutline className="w-8 h-8" />
                        </button>
                        <div className="flex flex-col">
                            <h2 className="text-2xl font-bold mb-4 flex flex-col items-center">
                                {movie.title}
                            </h2>
                            <p className="mb-2">
                                <strong>Genre: </strong>
                                {movie.genre}
                            </p>
                            <p className="mb-2">
                                <strong>Summary: </strong>
                                {movie.summary}
                            </p>
                            <p className="mb-2">
                                <strong>Director: </strong>
                                {movie.director}
                            </p>
                            <p className="mb-2">
                                <strong>Year: </strong>
                                {movie.year}
                            </p>
                            <div className="flex justify-center">
                                <button
                                    onClick={handleAddToWatchlistClick}
                                    className="bg-green-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-green-400"
                                >
                                    Add to watchlist
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MovieDetails;
