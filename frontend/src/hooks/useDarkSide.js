import { useState, useEffect } from "react";

/**
 * Custom hook to handle dark/light theme toggling.
 *
 * @returns {Array} An array containing the current theme and a function to set the theme.
 */
export default function useDarkSide() {
    // Get the initial theme from localStorage
    const [theme, setTheme] = useState(localStorage.theme);
    // Determine the opposite color theme
    const colorTheme = theme === "dark" ? "light" : "dark";
    // Store the current theme in localStorage
    localStorage.setItem("theme", theme);
    // Apply the theme to the document's root element
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(colorTheme);
        root.classList.add(theme);
        if (localStorage.theme === "dark") localStorage.setItem("theme", theme);
        else localStorage.setItem("theme", theme);
    }, [theme, colorTheme]);
    // Return the opposite color theme and the function to change the theme
    return [colorTheme, setTheme];
}
