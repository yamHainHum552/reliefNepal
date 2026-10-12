/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        forest: { 50: '#eff6f0', 100: '#dcebdd', 600: '#287247', 700: '#1e5b39', 800: '#19492f', 900: '#123a27' },
        ivory: '#faf8f1',
        gold: '#c99a3d',
      },
      fontFamily: { sans: ['Arial', 'Helvetica', 'sans-serif'] },
    },
  },
  plugins: [],
};
