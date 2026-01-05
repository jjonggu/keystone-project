import React from "react";
import { Link } from "react-router-dom";
import mainrogoImg from "../../assets/images/MainRoGo.png";

interface MenubarProps {
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Menubar: React.FC<MenubarProps> = ({
  menuOpen,
  setMenuOpen,
}) => {
  return (
    <aside
      className={`
        fixed top-0 left-0 z-30
        h-full w-[350px]
        bg-white shadow-2xl
        transform transition-transform duration-300
        ${menuOpen ? "translate-x-0" : "-translate-x-full"}
        p-6
      `}
    >
      {/* 닫기 버튼 */}
      <button
        onClick={() => setMenuOpen(false)}
        className="absolute top-4 right-4 text-xl font-bold text-gray-800"
        aria-label="Close menu"
      >
        ✕
      </button>

      {/* 로고 */}
      <Link to="/" className="flex justify-center mb-8 -mt-[30px]">
        <img
          src={mainrogoImg}
          alt="Home Logo"
          className="h-[280px] w-auto"
        />
      </Link>

      <hr className="border-gray-300 mb-6 -mt-[90px]" />

      {/* 네비게이션 */}
      <nav className="flex flex-col space-y-4 text-[30px]">
        <Link
          to="/about"
          className="font-extrabold text-black hover:text-gray-600 transition"
        >
          About
        </Link>

        <Link
          to="/reservation"
          className="font-extrabold text-black hover:text-gray-600 transition"
        >
          Reservation
        </Link>

        <Link
          to="/map"
          className="font-extrabold text-black hover:text-gray-600 transition"
        >
          Map
        </Link>
        <Link
          to="/notice"
          className="font-extrabold text-black hover:text-gray-600 transition"
        >
          Notice
        </Link>
      </nav>
    </aside>
  );
};

export default Menubar;
