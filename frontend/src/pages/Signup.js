import { useState } from "react";
import { useSignup } from "../hooks/useSignup";
const Signup = () => {
    // State variables to manage email and password input
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // Custom hook to handle signup functionality
    const { signup, isLoading, error } = useSignup();
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        await signup(email, password);
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
                    Sign Up
                </h3>
            </div>
            <div className="mb-4">
                <label className="block mb-2 text-black dark:text-gray-300">
                    Email:
                </label>
                <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-white"
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
                {isLoading ? "Signing up..." : "Sign up"}
            </button>
            {error && <div className="text-red-500 mt-4">{error}</div>}
        </form>
    );
};

export default Signup;
