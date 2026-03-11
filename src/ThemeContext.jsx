import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

const themes = {
    dark: {
        '--color1': '#424151',
        '--color2': '#8B728E',
        '--color3': '#1a1d3d3a',
        '--color4': '#262b5f46',
        '--color5': '#EE8D7A',
        '--color6': '#171724',
        '--color7': '#0000072f',
        '--color8': '#B96E82',
        '--background': '#72728f',
    },
    light: {
        '--color1': '#e8e6f0',
        '--color2': '#9b87a0',
        '--color3': '#f0eef5dd',
        '--color4': '#d8d4e2aa',
        '--color5': '#e07060',
        '--color6': '#f5f3fa',
        '--color7': '#ffffff55',
        '--color8': '#c47080',
        '--background': '#dddaf0',
    }
};

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(localStorage.getItem('yusha-theme') || 'dark');

    useEffect(() => {
        const vars = themes[theme];
        for (const [key, value] of Object.entries(vars)) {
            document.documentElement.style.setProperty(key, value);
        }
        // Set text color based on theme
        document.body.style.color = theme === 'light' ? '#222' : '';
        localStorage.setItem('yusha-theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}

export default ThemeContext;
