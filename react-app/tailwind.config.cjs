/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // 전체 기본 폰트로 gmarket 사용 가능
        sans: ["GmarketSans", "sans-serif"], // Tailwind의 기본 sans를 오버라이드
        gmarket: ["GmarketSans", "sans-serif"], // 필요시 font-gmarket으로도 사용 가능
      },
      colors: {
      },
    },
  },
  plugins: [],
};
