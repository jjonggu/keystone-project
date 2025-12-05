import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar } from "../components/ui/Calendar";
import {
  toadImg,
  pinokioImg,
  reverbImg,
  goallthewayImg,
  luciddreamImg,
  apartmentImg,
  Banner,
  mainrogo
} from "../assets/images/common";
import Menubar from "../components/ui/Menubar";

export default function ReservationPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const themesData = [
    { title: "두껍아 두껍아 헌집줄께 새집다오", imageUrl: toadImg, description: "두꺼비 테마 설명이 여기에 들어갑니다." },
    { title: "피노키오", imageUrl: pinokioImg, description: "피노키오 테마 설명이 여기에 들어갑니다." },
    { title: "잔향", imageUrl: reverbImg, description: "잔향 테마 설명이 여기에 들어갑니다." },
    { title: "끝까지 간다", imageUrl: goallthewayImg, description: "끝까지 간다 테마 설명이 여기에 들어갑니다." },
    { title: "루시드 드림", imageUrl: luciddreamImg, description: "루시드 드림 테마 설명이 여기에 들어갑니다." },
    { title: "201호 202호", imageUrl: apartmentImg, description: "201호 202호 테마 설명이 여기에 들어갑니다." },
  ];

  const themeData = themesData[Number(id) - 1];
  const [selectedTime, setSelectedTime] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const nextBtn = () => {
    if (!selectedTime) {
      alert("시간을 선택해주세요.");
      return;
    }

    navigate(`/reservation/${id}/payment`, {
      state: {
        themeData,
        selectedTime,
      },
    });
  };

  return (
    <div className="relative min-h-screen">
      <Menubar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <header className="fixed top-0 left-0 w-full z-50 flex justify-center pt-6 mt-9 ">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`transition-all duration-300 py-[13px] px-5 bg-white rounded-lg shadow-all-xl flex items-center justify-start space-x-3 max-w-[1400px] w-full
            ${menuOpen ? 'ml-[350px]' : 'ml-0'}`}
        >
          <span className="font-[1000] text-gray-900 text-4xl mb-1">MENU</span>
        </button>
      </header>

      <div className={`min-h-screen flex justify-center transition-all duration-300 ${menuOpen ? 'ml-[350px]' : 'ml-0'}`}>
        {/* 지도 넣을곳 메뉴바 map 클릭시 이동가능 */}
      </div>
    </div>
  );
}
