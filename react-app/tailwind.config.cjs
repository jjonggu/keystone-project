/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        gmarket: ["GmarketSans", "sans-serif"], // G마켓 산스 추가
      },
      colors: {
        amber: {
          200: "#FCD34D", // 연한 갈색
        },
      },
    },
  },
  plugins: [],
};
