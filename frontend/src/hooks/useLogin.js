import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

/**
 * Custom hook to handle user login functionality.
 *
 * @returns {Object} An object containing the login function, loading state, and error state.
 */
export const useLogin = () => {
    const [error, setError] = useState(null);   // State for tracking errors
    const [isLoading, setIsLoading] = useState(null);   // State for tracking loading status
    const { dispatch } = useAuthContext();  // Get dispatch function from AuthContext

      /**
     * Function to log in a user.
     *
     * @param {string} email - User's email.
     * @param {string} password - User's password.
     */
    const login = async (email, password) => {
        setIsLoading(true); // Set loading state to true
        setError(null); // Reset error state

        // Make POST request to login endpoint
        const response = await fetch(
            "https://moviehub-server.onrender.com:443" + "/api/user/login",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }), // Send email and password in the request body
            }
        );
        const json = await response.json(); // Parse the JSON response

        // If the response is not ok, set the error state
        if (!response.ok) {
            setIsLoading(false);
            setError(json.error);
        }

        // If the response is ok
        if (response.ok) {
            // save the user to local storage
            localStorage.setItem("user", JSON.stringify(json));

            // update the auth context
            dispatch({ type: "LOGIN", payload: json });

            // update loading state
            setIsLoading(false);
        }
    };

    // Return the login function, loading state, and error state
    return { login, isLoading, error };
};
