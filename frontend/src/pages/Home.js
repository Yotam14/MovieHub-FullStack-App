import { useEffect } from "react";
import React, { useState } from "react";
import { useMoviesContext } from "../hooks/useMoviesContext";
import { useAuthContext } from "../hooks/useAuthContext";
// components
import MovieDetails from "../components/MovieDetails";
import Filter from "../components/Filter";
import SearchBar from "../components/SearchBar";
import { useLogout } from "../hooks/useLogout";
const Home = () => {
    // Custom hook to handle user logout
    const { logout } = useLogout();

    // Contexts to manage movies and authentication
    const { movies, dispatch } = useMoviesContext();
    const { user } = useAuthContext();

    // State variables to manage search, filters, pagination, and movie data
    const [searchTerm, setSearchTerm] = useState("");
    const [activeSearch, setActiveSearch] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [moviesPerPage, setMoviesPerPage] = useState(12); // Default movies per page
    const [totalMovies, setTotalMovies] = useState(0);
    
    // State variables for Filter and define the categories.
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [filters, setFilters] = useState([
        {
            id: "category",
            name: "Category",
            options: [
                { value: "All", label: "All", checked: true },
                { value: "Comedy", label: "Comedy", checked: false },
                { value: "Drama", label: "Drama", checked: false },
                { value: "Action", label: "Action", checked: false },
                { value: "Horror", label: "Horror", checked: false },
                { value: "Adventure", label: "Adventure", checked: false },
            ],
        },
    ]);

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

            if (response.status === 401) {// If unauthorized, logout the user
                logout();
            }
            // Parse the response and update states
            const json = await response.json();
            if (response.ok) {
                dispatch({ type: "SET_MOVIES", payload: json });
                setFilteredMovies(json);
                setTotalMovies(json.length);
            }
        };
        // Fetch movies only if user is logged in
        if (user) {
            fetchMovies();
        }
    }, [dispatch, user]);

    // Handle filter changes and update the displayed movies
    const handleFilterChange = (optionIdx) => {
        const updatedFilters = [...filters];
        updatedFilters[0].options = updatedFilters[0].options.map(
            (option, index) => ({
                ...option,
                checked: index === optionIdx ? !option.checked : false,
            })
        );
        setFilters(updatedFilters);

        // Clear the search term
        setSearchTerm("");

        const activeFilters = updatedFilters[0].options
            .filter((option) => option.checked)
            .map((option) => option.value);
        // Filter movies based on selected filters
        if (activeFilters.length === 0 || activeFilters[0] === "All") {
            setFilteredMovies(movies);
        } else {
            const filteredMovies = movies.filter((movie) =>
                activeFilters.some((filter) =>
                    movie.genre.toLowerCase().includes(filter.toLowerCase())
                )
            );
            setFilteredMovies(filteredMovies);
        }
    };

    // Handle search input and update the displayed movies
    const handleSearch = (e) => {
        const term = e.target.value.trim().toLowerCase();
        setSearchTerm(term);
        setCurrentPage(1);
        // Update filter options based on search term
        const updatedFilters = [...filters];
        updatedFilters[0].options = updatedFilters[0].options.map((option) => ({
            ...option,
            checked: term === "" ? false : option.value === "All",
        }));
        setFilters(updatedFilters);
        // Filter movies based on search term
        if (term === "") {
            setFilteredMovies(movies);
        } else {
            const searchResults = movies.filter((movie) =>
                movie.title.toLowerCase().includes(term)
            );
            setFilteredMovies(searchResults);
        }
    };
    // Handle movie deletion and update the displayed movies
    const handleMovieDelete = (deletedMovieId) => {
        setFilteredMovies(
            filteredMovies.filter((movie) => movie._id !== deletedMovieId)
        );
    };
    // Pagination logic to get current movies for the current page
    const indexOfLastMovie = currentPage * moviesPerPage;
    const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
    const currentMovies = filteredMovies.slice(
        indexOfFirstMovie,
        indexOfLastMovie
    );

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Change movies per page and reset to first page
    const handleMoviesPerPageChange = (e) => {
        setMoviesPerPage(parseInt(e.target.value));
        setCurrentPage(1); // Reset to first page when changing movies per page
    };

    return (
        <div className="homepage dark:bg-gray-800 min-h-screen">
            <div className="movies grid grid-cols-1 sm:grid-cols-5 gap-8">
                {/* Filters by categories */}
                <Filter
                    filters={filters}
                    handleFilterChange={handleFilterChange}
                />

                {/* Movies grid */}
                <div className="sm:col-span-4">
                    <SearchBar
                        searchTerm={searchTerm}
                        onSearchChange={handleSearch}
                    />

                    <span className="text-gray-700 text-sm dark:text-gray-100">
                        Movies per page :{" "}
                    </span>
                    <select
                        value={moviesPerPage}
                        onChange={handleMoviesPerPageChange}
                        className="px-2 py-1 border border-gray-300 rounded dark:text-gray-100 dark:bg-gray-700 dark:hover:bg-gray-500"
                    >
                        <option value={6}>6</option>
                        <option value={12}>12</option>
                        <option value={18}>18</option>
                        <option value={24}>24</option>
                    </select>
                    <div className="mt-5 border-t border-gray-200 dark:text-gray-100"></div>
                    <div className="container mx-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mt-4">
                            {currentMovies.map((movie) => (
                                <MovieDetails
                                    key={movie._id}
                                    movie={movie}
                                    onDelete={handleMovieDelete}
                                />
                            ))}
                        </div>
                        {currentMovies.length === 0 && (
                            <div
                                className="text-center text-gray-700 dark:text-gray-100 mt-4"
                                style={{ fontSize: "2rem" }}
                            >
                                No movies found.
                            </div>
                        )}
                        {/* Pagination */}
                        <div className="mt-4 flex justify-center dark:text-gray-100 ">
                            {Array.from({
                                length: Math.ceil(
                                    filteredMovies.length / moviesPerPage
                                ),
                            }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => paginate(index + 1)}
                                    className={`mx-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 dark:bg-gray-700 ${
                                        currentPage === index + 1
                                            ? "dark:bg-gray-300 dark:text-gray-500"
                                            : "bg-gray-300 dark:hover:bg-gray-500"
                                    }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
