import { useState } from "react";
import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";
import Switcher from "./Switcher";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"; // Ensure you've installed @heroicons/react for these icons

/**
 * Navbar Component
 * Renders a navigation bar with links and actions based on user authentication status and role.
 * @returns {JSX.Element} Navbar component.
 */
const Navbar = () => {
    const { logout } = useLogout(); // Retrieves logout function from custom hook.
    const { user } = useAuthContext(); // Retrieves user object from custom hook.
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State to track mobile menu visibility.

    // Handles logout action.
    const handleClick = () => {
        logout();
    };

    return (
        <header className="bg-gray-600 text-white">
            <div className="container mx-auto flex justify-between items-center p-4 sm:p-6">
                <Link to="/" className="flex-shrink-0">
                    <h1 className="font-bold text-xl text-white">MovieHub</h1>
                </Link>
                <div className="sm:hidden">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                    >
                        {isMobileMenuOpen ? (
                            <XMarkIcon
                                className="block h-6 w-6"
                                aria-hidden="true"
                            />
                        ) : (
                            <Bars3Icon
                                className="block h-6 w-6"
                                aria-hidden="true"
                            />
                        )}
                    </button>
                </div>
                <nav
                    className={`${
                        isMobileMenuOpen ? "block" : "hidden"
                    } sm:flex sm:items-center sm:space-x-4`}
                >
                    {user && user.role === "admin" && (
                        <div className="flex flex-col sm:flex-row items-center sm:space-x-4">
                            <span>{user.email}</span>
                            <Link to="/users">
                                <button
                                    type="button"
                                    className="px-3 py-2 bg-gray-700 rounded-md hover:bg-gray-600"
                                >
                                    Users
                                </button>
                            </Link>
                            <Link to="/movies">
                                <button
                                    type="button"
                                    className="px-3 py-2 bg-gray-700 rounded-md hover:bg-gray-600"
                                >
                                    Add movies
                                </button>
                            </Link>
                            <Link to="/watchlist">
                                <button
                                    type="button"
                                    className="px-3 py-2 bg-gray-700 rounded-md hover:bg-gray-600"
                                >
                                    Watchlist
                                </button>
                            </Link>

                            <button
                                onClick={handleClick}
                                className="px-3 py-2 bg-red-600 rounded-md hover:bg-red-700"
                            >
                                Logout
                            </button>
                            <Switcher />
                        </div>
                    )}
                    {user && user.role !== "admin" && (
                        <div className="flex flex-col sm:flex-row items-center sm:space-x-4">
                            <span>{user.email}</span>
                            <Link to="/watchlist">
                                <button
                                    type="button"
                                    className="px-3 py-2 bg-gray-700 rounded-md hover:bg-gray-600"
                                >
                                    Watchlist
                                </button>
                            </Link>
                            <button
                                onClick={handleClick}
                                className="px-3 py-2 bg-red-600 rounded-md hover:bg-red-700"
                            >
                                Logout
                            </button>
                            <Switcher />
                        </div>
                    )}
                    {!user && (
                        <div className="flex flex-col sm:flex-row items-center sm:space-x-4">
                            <Link
                                to="/login"
                                className="px-3 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="px-3 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                            >
                                Sign Up
                            </Link>
                            <Switcher />
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
