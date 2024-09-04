/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html", // Main HTML file
    "./src/**/*.{html,js,ts}", // Include all HTML, JS, and TS files in the `src` directory
  ],
  theme: {
    extend: {
      colors: {
        customGreenDark: '#12372A',
        customGreen: '#436850',
        customGreenLight: '#ADBC9F',
        customCream: '#FBFADA',
      },
      backgroundImage: {
        'background-gradient': 'linear-gradient(to bottom, #FBFADA, #ADBC9F, #436850, #12372A)',
        'list-gradient' : 'linear-gradient(to right, #ADBC9F, #436850)',
      },
    },
  },
  plugins: [],
}
