import { useState } from "react";
import { useUsersContext } from "../hooks/useUsersContext";
import { useAuthContext } from "../hooks/useAuthContext";

/**
 * UserDetails Component
 * Renders user details with options to edit user role and delete user (admin only).
 * @param {Object} user - The user object containing user details.
 * @returns {JSX.Element} UserDetails component.
 */
const UserDetails = ({ user }) => {
    const { dispatch } = useUsersContext(); // Retrieves dispatch function from custom hook.
    const { user: currentUser } = useAuthContext(); // Retrieves current authenticated user object from custom hook.
    const [editing, setEditing] = useState(false); // State to track editing mode.
    const [newRole, setNewRole] = useState(user.role); // State to track new role for the user.
    const [error, setError] = useState(null); // State to handle error messages.

    /**
     * Handles editing user role.
     * Makes API call to change user role and updates user details.
     */
    const handleEdit = async () => {
        // Validation checks
        if (!currentUser || currentUser.role !== "admin") {
            setError("You need to be admin to edit a user");
            return;
        }
        if (currentUser.email === user.email) {
            setError("You cant edit your own role");
            return;
        }
        if (newRole !== "admin" && newRole !== "user") {
            setError("Role must be admin or user");
            return;
        }
        // API call to update user role
        const response = await fetch(
            "https://moviehub-server.onrender.com:443" +
                `/api/user/changeUserRole/${user._id}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${currentUser.token}`,
                },
                body: JSON.stringify({ role: newRole }),
            }
        );
        const json = await response.json();
        // Update user details and handle success/error
        if (response.ok) {
            dispatch({ type: "EDIT_USER", payload: json });
            setEditing(false);
            setError(null);
            json.role = newRole;
            dispatch({ type: "EDIT_USER", payload: json });
            alert("User Role changed successfully");
        }
        if (!response.ok) {
            setError(json.error);
        }
    };

    /**
     * Handles deleting user.
     * Makes API call to delete user (admin only).
     */
    const handleDelete = async () => {
        // Validation checks
        if (!currentUser || currentUser.role !== "admin") {
            setError("You need to be admin to delete a user");
            return;
        }
        if (currentUser.email === user.email) {
            setError("You cant delete yourself");
            return;
        }
        // API call to delete user
        const response = await fetch(
            "https://moviehub-server.onrender.com:443" +
                `/api/user/${user._id}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${currentUser.token}`,
                },
            }
        );
        const json = await response.json();
        // Handle success/error
        if (response.ok) {
            setError(null);
            dispatch({ type: "DELETE_USER", payload: json });
            alert(`User:${user.email} has been deleted successfully`);
        }
        if (!response.ok) {
            setError(json.error);
        }
    };

    return (
        <div className="user-details dark:bg-gray-600 dark:text-gray-100">
            <p className="mb-2 dark:text-gray-100">
                <strong>Email: </strong>
                {user.email}
            </p>
            {editing ? (
                <div className="mb-2">
                    <strong>New Role:</strong>{" "}
                    <select
                        className="border rounded px-1 dark:bg-gray-800 dark:text-gray-100"
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                    >
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </select>
                    <br />
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2 dark:bg-blue-700 dark:hover:bg-blue-900 dark:text-gray-100"
                        onClick={handleEdit}
                    >
                        Save
                    </button>
                    <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded dark:bg-red-700 dark:hover:bg-red-900 dark:text-gray-100"
                        onClick={() => setEditing(false)}
                    >
                        Cancel
                    </button>
                </div>
            ) : (
                <p className="mb-2  dark:text-gray-100">
                    <strong>Role: </strong>
                    {user.role}
                    {currentUser && currentUser.role === "admin" && (
                        <button
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded ml-2"
                            onClick={() => setEditing(true)}
                        >
                            Edit
                        </button>
                    )}
                </p>
            )}
            {currentUser &&
                currentUser.role === "admin" &&
                currentUser._id !== user._id && (
                    <span
                        className="material-symbols-outlined"
                        onClick={handleDelete}
                    >
                        delete
                    </span>
                )}
            {error && <div className="error text-red-500">{error}</div>}
        </div>
    );
};

export default UserDetails;
