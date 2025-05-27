import { WatchlistContext } from "../context/WatchlistContext";
import { useContext } from "react";

/**
 * Custom hook to access the watchlist context.
 *
 * @returns {Object} The watchlist context.
 */
export const useWatchlistContext = () => {
    // Accessing the watchlist context using useContext hook
    const context = useContext(WatchlistContext);
    if (!context) {
        // If the context is null or undefined
        throw Error(
            "useWatchlistContext must be used within a WatchlistContextProvider"
        );// Throw an error indicating that this hook must be used within a WatchlistContextProvider
    }
    // Return the watchlist context
    return context;
};
