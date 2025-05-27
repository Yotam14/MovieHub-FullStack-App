import React, { useEffect } from "react";
import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import WatchlistDetails from "../components/WatchlistDetails";
import { useWatchlistContext } from "../hooks/useWatchlistContext";
import Filter from "../components/Filter";
import SearchBar from "../components/SearchBar";
const Watchlist = () => {
    // Contexts to manage watchlist and authentication
    const { watchlist, dispatch } = useWatchlistContext();
    const { user } = useAuthContext();
    // State variables for search term, pagination, and filtered movies
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [moviesPerPage, setMoviesPerPage] = useState(12); // Default movies per page
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

    // Fetch watchlist when the component mounts or when the user changes
    useEffect(() => {
        const fetchWatchlist = async () => {
            // Fetch watchlist from the API with the authorization header
            const response = await fetch(
                "https://moviehub-server.onrender.com:443" +
                    "/api/watchlist/" +
                    user.email,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );
            const json = await response.json();
            if (response.ok) {
                dispatch({ type: "SET_WATCHLIST", payload: json });
                setFilteredMovies(json);
            }
        };
         // Fetch watchlist only if the user is logged in
        if (user) {
            fetchWatchlist();
        }
    }, [dispatch, user]);

    // Handle filter change
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
        if (activeFilters.length === 0 || activeFilters[0] === "All") {
            setFilteredMovies(watchlist);
        } else {
            const filteredMovies = watchlist.filter((movie) =>
                activeFilters.some((filter) =>
                    movie.genre.toLowerCase().includes(filter.toLowerCase())
                )
            );
            setFilteredMovies(filteredMovies);
        }
    };

    // Handle search input
    const handleSearch = (e) => {
        const term = e.target.value.trim().toLowerCase();
        setSearchTerm(term);
        setCurrentPage(1);
        const updatedFilters = [...filters];
        updatedFilters[0].options = updatedFilters[0].options.map((option) => ({
            ...option,
            checked: term === "" ? false : option.value === "All",
        }));
        setFilters(updatedFilters);
        if (term === "") {
            setFilteredMovies(watchlist);
        } else {
            const searchResults = watchlist.filter((movie) =>
                movie.title.toLowerCase().includes(term)
            );
            setFilteredMovies(searchResults);
        }
    };

    // Handle movie deletion
    const handleMovieDelete = (deletedMovieId) => {
        setFilteredMovies(
            filteredMovies.filter((movie) => movie._id !== deletedMovieId)
        );
    };

    // Pagination
    const indexOfLastMovie = currentPage * moviesPerPage;
    const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
    const currentMovies = filteredMovies.slice(
        indexOfFirstMovie,
        indexOfLastMovie
    );

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Change movies per page
    const handleMoviesPerPageChange = (e) => {
        setMoviesPerPage(parseInt(e.target.value));
        setCurrentPage(1); // Reset to first page when changing movies per page
    };

    return (
        <div className="watchlist dark:bg-gray-800 min-h-screen">
            <div
                className="text-center text-gray-700 dark:text-gray-100 mt-4"
                style={{ fontSize: "2rem" }}
            >
                My Watchlist
            </div>

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
                    {watchlist.length === 0 && (
                        <div className="text-center text-gray-700 dark:text-gray-100 mt-4 text-lg">
                            Your watchlist is empty.
                        </div>
                    )}
                    <div className="mt-5 border-t border-gray-200 dark:text-gray-100"></div>
                    <div className="container mx-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mt-4">
                            {watchlist && watchlist.length > 0
                                ? currentMovies.map((movie) => (
                                      <WatchlistDetails
                                          key={movie._id}
                                          movie={movie}
                                          onDelete={handleMovieDelete}
                                      />
                                  ))
                                : null}
                        </div>
                        {watchlist.length > 0 && currentMovies.length === 0 ? (
                            <div
                                className="justify-center text-center text-gray-700 dark:text-gray-100 mt-4"
                                style={{ fontSize: "2rem" }}
                            >
                                No movies found.
                            </div>
                        ) : null}
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

export default Watchlist;
