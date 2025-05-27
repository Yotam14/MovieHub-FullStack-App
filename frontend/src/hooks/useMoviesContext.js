import { MoviesContext } from "../context/MoviesContext"; // Importing the MoviesContext from the context file
import { useContext } from "react"; // Importing the useContext hook from React

/**
 * Custom hook to access the movies context.
 *
 * @returns {Object} The movies context.
 */
export const useMoviesContext = () => {
    const context = useContext(MoviesContext);// Accessing the movies context using useContext hook
    // If the context is null or undefined
    if (!context) {
        throw Error(
            "useMoviesContext must be used within a MoviesContextProvider"
        );// Throw an error indicating that this hook must be used within a MoviesContextProvider
    }
    // Return the movies context
    return context;
};
