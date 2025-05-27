import { createContext, useReducer } from "react";

export const MoviesContext = createContext();
export const moviesReducer = (state, action) => {
    switch (action.type) {
        case "SET_MOVIES":
            return {
                movies: action.payload,
            };
        case "CREATE_MOVIE":
            return {
                movies: [action.payload, ...state.movies],
            };
        case "DELETE_MOVIE":
            return {
                ...state,
                movies: state.movies.filter(
                    (movie) => movie._id !== action.payload
                ),
            };
        case "ADD_TO_WATCHLIST":
            return {
                ...state,
                watchlist: [...state.watchlist, action.payload],
            };
        // case "REMOVE_FROM_WATCHLIST":
        //     return {
        //         ...state,
        //         watchlist: state.watchlist.filter(
        //             (movie) => movie._id !== action.payload._id
        //         ),
        //     };
        default:
            return state;
    }
};
export const MoviesContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(moviesReducer, {
        movies: null,
        watchlist: [],
    });
    return (
        <MoviesContext.Provider value={{ ...state, dispatch }}>
            {children}
        </MoviesContext.Provider>
    );
};
