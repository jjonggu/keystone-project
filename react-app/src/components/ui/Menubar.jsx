import React from "react";
import mainrogoImg from "../../assets/images/MainRoGo.png";

export default function Munubar({ menuOpen, setMenuOpen }) {
  return (
    <div
      className={`fixed shadow-2xl top-0 left-0 h-full w-[350px] bg-white z-30 transform ${
        menuOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 p-6`}
    >
      {/* 로고: 왼쪽 상단 고정 */}
      <a href="/" className="block mb-8 -mt-[30px] flex justify-center">
        <img src={mainrogoImg} alt="Home Logo" className="h-[280px] w-auto" />
      </a>

      {/* 닫기 버튼 */}
      <button
        onClick={() => setMenuOpen(false)}
        className="absolute top-4 right-4 text-gray-800 font-bold text-xl"
      >
        ✕
      </button>

      {/* 메뉴 항목 */}
      <nav className="flex flex-col space-y-4 text-[30px]">
        <a href="/themes" className="text-black font-extrabold hover:text-gray-600">
          About
        </a>
        <a href="/reservations" className="text-black font-extrabold hover:text-gray-600">
          Notice
        </a>
        <a href="/contact" className="text-black font-extrabold hover:text-gray-600">
          Time
        </a>
      </nav>
    </div>
  );
}
