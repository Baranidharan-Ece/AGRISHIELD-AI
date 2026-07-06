/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f2fdf5',
          100: '#e1fbe9',
          200: '#c5f7d2',
          300: '#97eeaf',
          400: '#5edd82',
          500: '#34c25c',
          600: '#25a049',
          700: '#1f7e3c',
          800: '#1d6433',
          900: '#19522c',
          950: '#0a2e16',
        }
      }
    },
  },
  plugins: [],
}
