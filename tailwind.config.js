/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'subsphere': {
                    'light': '#F8FAFC',
                    'blue': '#EFF6FF',
                    'purple': '#7b39fc',
                    'dark-purple': '#6b29ec',
                },
            },
            backdropBlur: {
                'xs': '2px',
                'glass': '24px',
            },
            borderRadius: {
                '3xl': '24px',
                '4xl': '32px',
            },
            boxShadow: {
                'glass': '0 8px 32px rgba(0, 0, 0, 0.1)',
                'glass-lg': '0 12px 48px rgba(0, 0, 0, 0.15)',
                'glow': '0 0 20px rgba(123, 57, 252, 0.3)',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
    ],
}
