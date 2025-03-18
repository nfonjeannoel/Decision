/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          purple: '#7E22CE', // Deep purple
          indigo: '#4F46E5', // Indigo
          teal: '#0D9488',   // Teal
          light: '#8B5CF6',  
          DEFAULT: '#7C3AED',
          dark: '#6D28D9',
        },
        secondary: {
          light: '#93C5FD',
          DEFAULT: '#3B82F6',
          dark: '#2563EB',
        },
        rating: {
          poor: '#EF4444',      // Red
          fair: '#F97316',      // Orange
          good: '#EAB308',      // Yellow
          great: '#22C55E',     // Green
          excellent: '#0EA5E9', // Blue
        },
        ai: {
          glow: '#A855F7',      // Purple for AI glow effects
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, #7E22CE, #4F46E5, #0D9488)',
        'gradient-card': 'linear-gradient(145deg, rgba(255,255,255,0.6), rgba(255,255,255,0.1))',
      },
      boxShadow: {
        'glow': '0 0 15px rgba(168, 85, 247, 0.5)',
        'top': '0 -2px 10px rgba(0, 0, 0, 0.1)',
      },
      screens: {
        'xs': '375px',
      },
    },
  },
  plugins: [],
} 