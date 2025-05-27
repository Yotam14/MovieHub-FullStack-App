import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
// For testing purposes only
const testCredentials = {
    user: {
        email: "user@app.app",
        password: "123456",
    },
    admin: {
        email: "admin@app.app",
        password: "123456",
    },
};

const Login = () => {
    // State variables to manage email and password input
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // Custom hook to handle login functionality
    const { login, isLoading, error } = useLogin();
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
        } catch (err) {
            console.error(err);
        }
        if (error) {
            console.error(error);
        }
    };

    // Function to handle test login with predefined credentials
    const handleTestLogin = (role) => {
        const { email, password } = testCredentials[role];
        setEmail(email);
        setPassword(password);
    };

    return (
        <form
            className="max-w-md mx-auto mt-8 dark:bg-gray-800"
            onSubmit={handleSubmit}
            style={{ height: "100vh" }}
        >
            <div className="text-center mb-4">
                <img src="/logo.png" alt="logo" />
                <h3 className="text-lg font-semibold text-black dark:text-gray-300">
                    Login
                </h3>
            </div>
            <div className="mb-4">
                <label className="block mb-2 text-black dark:text-gray-300">
                    Email:
                </label>
                <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-gray-300"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2 text-black dark:text-gray-300">
                    Password:
                </label>
                <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-white"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />
            </div>
            <button
                type="submit"
                className="w-full bg-blue-500 text-white px-4 py-2 rounded dark:bg-blue-800"
                disabled={isLoading}
            >
                {isLoading ? "Logging in..." : "Login"}
            </button>
            {error && <div className="text-red-500 mt-4">{error}</div>}
            <div className="mt-4 text-center">
                <button
                    className="text-white underline bg-blue-500 dark:bg-blue-800"
                    onClick={() => handleTestLogin("user")}
                >
                    Test User Login
                </button>{" "}
                |{" "}
                <button
                    className="text-white underline bg-blue-500 dark:bg-blue-800"
                    onClick={() => handleTestLogin("admin")}
                >
                    Test Admin Login
                </button>
            </div>
        </form>
    );
};

export default Login;
