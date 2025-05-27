import { createContext, useReducer } from "react";

export const WatchlistContext = createContext();

export const watchlistReducer = (state, action) => {
    switch (action.type) {
        case "SET_WATCHLIST":
            return {
                ...state,
                watchlist: action.payload,
            };
        case "REMOVE_FROM_WATCHLIST":
            return {
                ...state,
                watchlist: state.watchlist.filter(
                    (movie) => movie._id !== action.payload
                ),
            };
        default:
            return state;
    }
};

export const WatchlistContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(watchlistReducer, { watchlist: [] });
    return (
        <WatchlistContext.Provider value={{ ...state, dispatch }}>
            {children}
        </WatchlistContext.Provider>
    );
};
