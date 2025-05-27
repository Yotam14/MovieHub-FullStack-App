import { useState } from "react";
import { useMoviesContext } from "../hooks/useMoviesContext";
import { useAuthContext } from "../hooks/useAuthContext";

/**
 * MovieForm Component
 * Allows admin users to add a new movie with title, genre, summary, director, year, and image.
 * @returns {JSX.Element} MovieForm component.
 */
const MovieForm = () => {
    const { dispatch } = useMoviesContext(); // Accesses the movies context to dispatch actions related to movies.
    const { user } = useAuthContext(); // Accesses the authentication context to retrieve user information.

    const [title, setTitle] = useState(""); // State for movie title.
    const [genre, setGenre] = useState(""); // State for movie genre.
    const [summary, setSummary] = useState(""); // State for movie summary.
    const [director, setDirector] = useState(""); // State for movie director.
    const [year, setYear] = useState(""); // State for movie year.
    const [image, setImage] = useState(""); // State for movie image URL.
    const [error, setError] = useState(null); // State for error message.
    const [emptyFields, setEmptyFields] = useState([]); // State to track empty fields in the form.


    /**
     * Handles form submission to add a new movie.
     * @param {Event} e - Form submission event.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            setError("You need to be logged in to add a movie");
            return;
        }
        const movie = { title, genre, summary, director, year, image };
        const response = await fetch(
            "https://moviehub-server.onrender.com:443" + "/api/movies",
            {
                method: "POST",
                body: JSON.stringify(movie),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            }
        );
        const json = await response.json();

        if (!response.ok) {
            setError(json.error);
            setEmptyFields(json.emptyFields);
        }
        if (response.ok) {
            setError(null);
            setTitle("");
            setGenre("");
            setSummary("");
            setDirector("");
            setYear("");
            setImage("");
            setEmptyFields([]);
            console.log("Movie added successfully", json);
            alert("Movie added successfully");
            dispatch({ type: "CREATE_MOVIE", payload: json });
        }
    };

    return (
        <form
            className="p-4 w-full mx-auto dark:text-gray-100"
            onSubmit={handleSubmit}
        >
            <h3 className="text-center text-lg font-semibold mb-4">
                Add a new Movie
            </h3>

            <label className="block mb-2">Movie title:</label>
            <input
                type="text"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                className={`w-full px-3 py-2 border dark:text-gray-700 ${
                    emptyFields.includes("title")
                        ? "border-red-500"
                        : "border-gray-300"
                } rounded focus:outline-none focus:border-blue-500`}
            />
            <label className="block mb-2">Movie Genre:</label>
            <input
                type="text"
                onChange={(e) => setGenre(e.target.value)}
                value={genre}
                className={`w-full px-3 py-2 border dark:text-gray-700 ${
                    emptyFields.includes("genre")
                        ? "border-red-500"
                        : "border-gray-300"
                } rounded focus:outline-none focus:border-blue-500`}
            />
            <label className="block mb-2">Movie Summary:</label>
            <input
                type="text"
                onChange={(e) => setSummary(e.target.value)}
                value={summary}
                className={`w-full px-3 py-2 border dark:text-gray-700 ${
                    emptyFields.includes("summary")
                        ? "border-red-500"
                        : "border-gray-300"
                } rounded focus:outline-none focus:border-blue-500`}
            />
            <label className="block mb-2">Movie Director:</label>
            <input
                type="text"
                onChange={(e) => setDirector(e.target.value)}
                value={director}
                className={`w-full px-3 py-2 border dark:text-gray-700 ${
                    emptyFields.includes("director")
                        ? "border-red-500"
                        : "border-gray-300"
                } rounded focus:outline-none focus:border-blue-500`}
            />
            <label className="block mb-2">Movie Year:</label>
            <input
                type="text"
                onChange={(e) => setYear(e.target.value)}
                value={year}
                className={`w-full px-3 py-2 border dark:text-gray-700 ${
                    emptyFields.includes("year")
                        ? "border-red-500"
                        : "border-gray-300"
                } rounded focus:outline-none focus:border-blue-500`}
            />
            <label className="block mb-2">Movie Image:</label>
            <input
                type="text"
                onChange={(e) => setImage(e.target.value)}
                value={image}
                className={`w-full px-3 py-2 border dark:text-gray-700 ${
                    emptyFields.includes("image")
                        ? "border-red-500"
                        : "border-gray-300"
                } rounded focus:outline-none focus:border-blue-500`}
            />
            <div className="flex justify-center">
                <button
                    className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline "
                    type="submit"
                >
                    Add Movie
                </button>
            </div>

            {error && <div className="text-red-500 mt-2">{error}</div>}
        </form>
    );
};

export default MovieForm;
