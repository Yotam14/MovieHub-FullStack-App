import { CiCirclePlus } from "react-icons/ci";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { AiOutlineDelete } from "react-icons/ai";
import { useWatchlistContext } from "../hooks/useWatchlistContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useState } from "react";
import { Slide, Fade } from "react-awesome-reveal";
import { HiOutlineInformationCircle } from "react-icons/hi2";

/**
 * WatchlistDetails Component
 * Renders details of a movie in the watchlist with options to remove it.
 * @param {Object} movie - The movie object containing movie details.
 * @param {Function} onDelete - Callback function to handle movie deletion.
 * @returns {JSX.Element} WatchlistDetails component.
 */
const WatchlistDetails = ({ movie, onDelete }) => {
    const { dispatch } = useWatchlistContext(); // Retrieves dispatch function from custom hook.
    const { user } = useAuthContext(); // Retrieves current authenticated user object from custom hook.
    const [showDetails, setShowDetails] = useState(false); // State to toggle modal for movie details.


    /**
     * Handles removing a movie from the watchlist.
     * Makes API call to remove the movie from the watchlist.
     */
    const handleRemoveFromWatchlistClick = async () => {
        if (!user) {
            return;
        }

        // API call to remove movie from watchlist
        const response = await fetch(
            "https://moviehub-server.onrender.com:443" +
                "/api/watchlist/remove/" +
                movie._id,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({ userEmail: user.email }),
            }
        );
        // Handle success/error
        if (response.ok) {
            dispatch({ type: "REMOVE_FROM_WATCHLIST", payload: movie._id });
            onDelete(movie._id); // Invoke the callback function
            alert("Movie removed from watchlist successfully.");
        } else {
            alert("There was an issue removing the movie from the watchlist.");
        }
    };

    //Toggles the visibility of the movie details modal.
    const handleModalToggle = () => {
        setShowDetails(!showDetails); 
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
                                title="Delete Movie From Watchlist"
                                className="bg-transplant text-white ml-5 px-3 py-3 rounded-lg duration-300 hover:bg-gray-400"
                                onClick={handleRemoveFromWatchlistClick}
                            >
                                <AiOutlineDelete className="text-3xl" />
                            </button>
                        </div>
                    </Slide>
                </div>
            </div>

            {showDetails && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
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
                                    onClick={handleRemoveFromWatchlistClick}
                                    className="bg-red-500 text-white px-4 py-2 rounded-md mt-4 mr-2 hover:bg-red-400"
                                >
                                    Remove From Watchlist
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WatchlistDetails;
