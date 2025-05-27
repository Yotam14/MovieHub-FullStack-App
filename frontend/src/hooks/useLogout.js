import { useAuthContext } from "./useAuthContext";

/**
 * Custom hook to handle user logout functionality.
 *
 * @returns {Object} An object containing the logout function.
 */
export const useLogout = () => {
    const { dispatch } = useAuthContext();// Get dispatch function from AuthContext
    const logout = () => {
        //remove user from local storage
        localStorage.removeItem("user");

        // Dispatch logout action to update the auth context
        dispatch({ type: "LOGOUT" });
    };
    return { logout };// Return the logout function
};
