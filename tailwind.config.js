/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Skeuomorphic color palette
                'skeu-light': '#f5f0e8',
                'skeu-cream': '#e8e0d0',
                'skeu-tan': '#d4c4a8',
                'skeu-brown': '#8b7355',
                'skeu-dark': '#4a3728',
                'skeu-gold': '#c9a227',
                'skeu-bronze': '#cd7f32',
                'skeu-silver': '#c0c0c0',
                'skeu-copper': '#b87333',
                'primary': {
                    50: '#fff7ed',
                    100: '#ffedd5',
                    200: '#fed7aa',
                    300: '#fdba74',
                    400: '#fb923c',
                    500: '#f97316',
                    600: '#ea580c',
                    700: '#c2410c',
                    800: '#9a3412',
                    900: '#7c2d12',
                },
                secondary: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    300: '#86efac',
                    400: '#4ade80',
                    500: '#22c55e',
                    600: '#16a34a',
                    700: '#15803d',
                    800: '#166534',
                    900: '#14532d',
                },
            },
            boxShadow: {
                'skeu-raised': '0 2px 4px rgba(0,0,0,0.2), 0 4px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.5)',
                'skeu-inset': 'inset 0 2px 4px rgba(0,0,0,0.2), inset 0 1px 2px rgba(0,0,0,0.1)',
                'skeu-button': '0 4px 6px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.3) inset',
                'skeu-button-hover': '0 6px 10px rgba(0,0,0,0.35), 0 1px 0 rgba(255,255,255,0.3) inset',
                'skeu-card': '0 8px 16px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.1)',
                'skeu-badge': '0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(0,0,0,0.2)',
                'metallic': '0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.2)',
            },
            backgroundImage: {
                'skeu-noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
                'skeu-gradient': 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.05) 100%)',
                'metallic-gold': 'linear-gradient(135deg, #f7e98e 0%, #c9a227 25%, #f7e98e 50%, #c9a227 75%, #f7e98e 100%)',
                'metallic-silver': 'linear-gradient(135deg, #e8e8e8 0%, #a0a0a0 25%, #e8e8e8 50%, #a0a0a0 75%, #e8e8e8 100%)',
                'metallic-bronze': 'linear-gradient(135deg, #e8a860 0%, #cd7f32 25%, #e8a860 50%, #cd7f32 75%, #e8a860 100%)',
                'leather': 'linear-gradient(135deg, #8b7355 0%, #6b5344 50%, #8b7355 100%)',
                'paper': 'linear-gradient(180deg, #faf8f5 0%, #f5f0e8 100%)',
            },
            fontFamily: {
                'display': ['Georgia', 'Times New Roman', 'serif'],
                'body': ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
            },
            animation: {
                'shine': 'shine 2s ease-in-out infinite',
                'pulse-slow': 'pulse 3s ease-in-out infinite',
            },
            keyframes: {
                shine: {
                    '0%': { backgroundPosition: '-200% center' },
                    '100%': { backgroundPosition: '200% center' },
                },
            },
        },
    },
    plugins: [],
}
