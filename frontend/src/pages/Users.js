import { useEffect } from "react";
import { useUsersContext } from "../hooks/useUsersContext";
import { useAuthContext } from "../hooks/useAuthContext";
// components
import UserDetails from "../components/UserDetails";
const Users = () => {
    // Contexts to manage users and authentication
    const { users, dispatch } = useUsersContext();
    const { user } = useAuthContext();

    // Fetch users when the component mounts or when the user changes
    useEffect(() => {
        const fetchUsers = async () => {
            // Fetch users from the API with the authorization header
            const response = await fetch(
                "https://moviehub-server.onrender.com:443" +
                    "/api/user/getUsers",
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );
            const json = await response.json();

            // Update state with fetched users if the response is OK
            if (response.ok) {
                dispatch({ type: "SET_USERS", payload: json });
            }
        };
        // Fetch users only if the logged-in user is an admin
        if (user.role === "admin") {
            fetchUsers();
        }
    }, [dispatch, user]);

    return (
        <div className="users min-h-screen">
            {users && users.map((us) => <UserDetails key={us._id} user={us} />)}
        </div>
    );
};

export default Users;
