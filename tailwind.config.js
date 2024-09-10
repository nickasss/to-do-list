/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./dashboard.html",
    "./src/**/*.{html,js,ts}",
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
        'background-gradient': 'linear-gradient(140deg, #ADBC9F, #12372A)',
        'list-gradient' : 'linear-gradient(to right, #ADBC9F, #436850)',
      },
    },
  },
  plugins: [],
}
