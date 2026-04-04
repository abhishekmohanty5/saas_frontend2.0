import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    // Try to get theme from localStorage, or default to 'system'
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'system';
    });

    // Function to apply theme to body class
    const applyTheme = (targetTheme) => {
        const root = window.document.documentElement;
        
        // Remove old classes
        root.classList.remove('light-theme', 'dark-theme', 'dark');
        
        let activeTheme = targetTheme;
        if (targetTheme === 'system') {
            activeTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }

        root.classList.add(`${activeTheme}-theme`);
        if (activeTheme === 'dark') {
            root.classList.add('dark');
        }
        root.setAttribute('data-theme', activeTheme);
        
        // Store the preference
        localStorage.setItem('theme', targetTheme);
    };

    useEffect(() => {
        applyTheme(theme);
        
        // Listen for system theme changes if in 'system' mode
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (theme === 'system') {
                applyTheme('system');
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
