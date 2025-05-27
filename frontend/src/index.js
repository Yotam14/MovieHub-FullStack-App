import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { MoviesContextProvider } from "./context/MoviesContext";
import { AuthContextProvider } from "./context/AuthContext";
import { UsersContextProvider } from "./context/UsersContext";
// Import WatchlistContextProvider
import { WatchlistContextProvider } from "./context/WatchlistContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <AuthContextProvider>
            <MoviesContextProvider>
                <UsersContextProvider>
                    <WatchlistContextProvider>
                        <App />
                    </WatchlistContextProvider>
                </UsersContextProvider>
            </MoviesContextProvider>
        </AuthContextProvider>
    </React.StrictMode>
);
