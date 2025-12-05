// src/components/ui/Menubar.tsx
import React from "react";
import mainrogoImg from "../../assets/images/MainRoGo.png";
import { Link } from "react-router-dom";

interface MenubarProps {
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Menubar: React.FC<MenubarProps> = ({ menuOpen, setMenuOpen }) => {
  return (
    <div className={`fixed shadow-2xl top-0 left-0 h-full w-[350px] bg-white z-30 transform ${menuOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 p-6`}>
      <Link to="/" className="block mb-8 -mt-[30px] flex justify-center">
        <img src={mainrogoImg} alt="Home Logo" className="h-[280px] w-auto" />
      </Link>

      <hr className="border-t border-gray-300 mb-6 -mt-[90px]" />

      <button onClick={() => setMenuOpen(false)} className="absolute top-4 right-4 text-gray-800 font-bold text-xl">✕</button>

      <nav className="flex flex-col space-y-4 text-[30px]">
        <Link to="/themes" className="text-black font-extrabold hover:text-gray-600">About</Link>
        <Link to="/reservations" className="text-black font-extrabold hover:text-gray-600">Reservation</Link>
        <Link to="/map" className="text-black font-extrabold hover:text-gray-600">Map</Link>
      </nav>
    </div>
  );
};

export default Menubar;
