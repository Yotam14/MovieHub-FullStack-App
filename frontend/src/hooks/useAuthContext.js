import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
/**
 * Custom hook to access authentication context.
 *
 * @returns {object} The context value for authentication.
 * @throws Will throw an error if used outside of an AuthContextProvider.
 */
export const useAuthContext = () => {
    const context = useContext(AuthContext);
    // Check if the hook is used within a valid AuthContextProvider
    if (!context) {
        throw Error("useAuthContext must be used within a AuthContextProvider");
    }
    return context;
};
