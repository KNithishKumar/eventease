/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Vibrant Coral Pink from the reference UI
        primary: {
          50: '#fff0f4',
          100: '#ffe2e8',
          200: '#ffc5d2',
          300: '#ff98af',
          400: '#ff6c8f',
          500: '#ff4d79', // Main reference pink
          600: '#f03362',
          700: '#cc214c',
          800: '#a81e41',
          900: '#8c1c3a',
          950: '#4e2608'
        },
        // Deep Navy / Indigo from the reference UI
        indigo: {
          50: '#f0f3fa',
          100: '#e0e7f5',
          200: '#c5d3ee',
          300: '#9bb5e2',
          400: '#6991d2',
          500: '#436fc1',
          600: '#28336d', // Main reference navy
          700: '#222b5e',
          800: '#1e244f',
          900: '#1b2043',
          950: '#0e1227'
        },
        brand: {
          pink: '#ff4d79',
          pinkHover: '#f03362',
          pinkLight: '#fff0f4',
          pinkBorder: '#ffd1dc',
          navy: '#28336d',
          navyDark: '#1e2448',
          navyLight: '#37468d',
          canvas: '#eaf0f8',
          card: '#ffffff'
        },
        neutral: {
          50: '#fafbfd',
          100: '#f1f5fa',
          200: '#e4ebf5',
          300: '#cbd7e6',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#060a13'
        },
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Outfit', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'Inter', 'sans-serif']
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2.25rem'
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(40, 51, 109, 0.04)',
        'soft-lg': '0 14px 40px rgba(40, 51, 109, 0.08)',
        'pink-glow': '0 8px 24px rgba(255, 77, 121, 0.28)'
      }
    }
  },
  plugins: []
};
