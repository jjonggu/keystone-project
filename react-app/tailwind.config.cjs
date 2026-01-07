/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["GmarketSans", "sans-serif"],
        gmarket: ["GmarketSans", "sans-serif"],
        title: ['"Cinzel Decorative"', 'serif'],
      },
      colors: {
        // 기존 컬러 유지
      },
      boxShadow: {
        // 전체 테두리 그림자, 더 진하게
        'all-xl': '0 -5px 20px -5px rgba(0,0,0,0.2), 0 15px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.2)',
      },
    },
  },
  plugins: [],
};
