/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["GmarketSans", "sans-serif"],
        gmarket: ["GmarketSans", "sans-serif"],
      },
      colors: {
      },
    },
  },
  plugins: [],
};
