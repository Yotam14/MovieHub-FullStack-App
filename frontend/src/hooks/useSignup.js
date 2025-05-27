import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

/**
 * Custom hook to handle user signup functionality.
 *
 * @returns {Object} An object containing the signup function, isLoading state, and error state.
 */
export const useSignup = () => {
    const [error, setError] = useState(null); // State to handle errors during signup
    const [isLoading, setIsLoading] = useState(null); // State to track loading state during signup
    const { dispatch } = useAuthContext(); // Accessing dispatch function from the auth context

    /**
     * Function to sign up a user.
     *
     * @param {string} email - User's email.
     * @param {string} password - User's password.
     */
    const signup = async (email, password) => {
        setIsLoading(true); // Set loading state to true
        setError(null); // Clear any previous error

        const response = await fetch(
            "https://moviehub-server.onrender.com:443" + "/api/user/signup",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            }
        );
        // Parse response data to JSON format
        const json = await response.json();

        if (!response.ok) {
            // If response status is not OK
            setIsLoading(false);    // Set loading state to false
            setError(json.error);   // Set error message received from server
        }
        if (response.ok) {
            // save the user to local storage
            localStorage.setItem("user", JSON.stringify(json));

            // update the auth context
            dispatch({ type: "LOGIN", payload: json });

            // update loading state
            setIsLoading(false);
        }
    };

    // Return signup function, isLoading state, and error state
    return { signup, isLoading, error };
};
