import { useEffect } from "react";
import { useMoviesContext } from "../hooks/useMoviesContext";
import { useAuthContext } from "../hooks/useAuthContext";
// components
import MovieDetails from "../components/MovieDetails";
import MovieForm from "../components/MovieForm";
const Movies = () => {
    // Contexts to manage movies and authentication
    const { movies, dispatch } = useMoviesContext();
    const { user } = useAuthContext();

    // Fetch movies when the component mounts or when user changes
    useEffect(() => {
        const fetchMovies = async () => {
            const response = await fetch(
                "https://moviehub-server.onrender.com:443" + "/api/movies",
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );
            const json = await response.json();

            // Update state with fetched movies if the response is OK
            if (response.ok) {
                dispatch({ type: "SET_MOVIES", payload: json });
            }
        };
        // Fetch movies only if user is logged in
        if (user) {
            fetchMovies();
        }
    }, [dispatch, user]);

    return (
        <div className="movies dark:bg-gray-800" style={{ height: "100vh" }}>
            <MovieForm />
        </div>
    );
};

export default Movies;
