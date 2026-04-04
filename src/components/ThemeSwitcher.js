import React from 'react';
import { useTheme } from '../utils/ThemeContext';
import { Moon, Sun } from 'lucide-react';

const ThemeSwitcher = () => {
    const { theme, setTheme } = useTheme();
    const [isHovered, setIsHovered] = React.useState(false);

    // Determine effectively active theme
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    const handleToggle = () => {
        setTheme(isDark ? 'light' : 'dark');
    };

    return (
        <button
            onClick={handleToggle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                border: '1px solid var(--theme-border)',
                background: isHovered ? 'var(--theme-border)' : 'transparent',
                color: 'var(--theme-text)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                padding: 0
            }}
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
        >
            {isDark ? <Sun size={18} strokeWidth={2.5} /> : <Moon size={18} strokeWidth={2.5} />}
        </button>
    );
};

export default ThemeSwitcher;
