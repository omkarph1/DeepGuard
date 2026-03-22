/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00D4E8',
          light: '#0891B2',
          dark: '#00D4E8',
        },
        accent: {
          DEFAULT: '#7B61FF',
          light: '#6D5ACF',
          dark: '#7B61FF',
        },
        surface: {
          dark: '#111827',
          light: '#F8FAFC',
        },
        bg: {
          dark: '#0A0E1A',
          light: '#F0F4F8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'scan': 'scan 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
      },
      keyframes: {
        scan: {
          '0%, 100%': { transform: 'translateY(-100%)' },
          '50%': { transform: 'translateY(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 212, 232, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 212, 232, 0.6)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideRight: {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
