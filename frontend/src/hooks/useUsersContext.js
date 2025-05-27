import { UsersContext } from "../context/UsersContext"; // Importing the UsersContext from the context file
import { useContext } from "react"; // Importing the useContext hook from React

/**
 * Custom hook to access the users context.
 *
 * @returns {Object} The users context.
 */
export const useUsersContext = () => {
    // Accessing the users context using useContext hook
    const context = useContext(UsersContext);
    if (!context) {
        // If the context is null or undefined
        throw Error(
            "useUsersContext must be used within a UsersContextProvider"
        );// Throw an error indicating that this hook must be used within a UsersContextProvider
    }
    // Return the users context
    return context;
};
