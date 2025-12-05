// ReservationPage.tsx
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
} from "../assets/images/common";
import Menubar from "../components/ui/Menubar";

interface ThemeData {
  title: string;
  imageUrl: string;
  description: string;
}

export default function ReservationPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const themesData: ThemeData[] = [
    { title: "두껍아 두껍아 헌집줄께 새집다오", imageUrl: toadImg, description: "두꺼비 테마 설명이 여기에 들어갑니다." },
    { title: "피노키오", imageUrl: pinokioImg, description: "피노키오 테마 설명이 여기에 들어갑니다." },
    { title: "잔향", imageUrl: reverbImg, description: "잔향 테마 설명이 여기에 들어갑니다." },
    { title: "끝까지 간다", imageUrl: goallthewayImg, description: "끝까지 간다 테마 설명이 여기에 들어갑니다." },
    { title: "루시드 드림", imageUrl: luciddreamImg, description: "루시드 드림 테마 설명이 여기에 들어갑니다." },
    { title: "201호 202호", imageUrl: apartmentImg, description: "201호 202호 테마 설명이 여기에 들어갑니다." },
  ];

  const themeData: ThemeData | undefined = themesData[Number(id) - 1];

  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const nextBtn = () => {
    if (!themeData) return;
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

  if (!themeData) {
    return <div>잘못된 접근입니다.</div>;
  }

  return (
    <div className="relative min-h-screen">
      <Menubar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

        <header className="fixed top-0 left-0 w-full z-50 flex justify-center pt-6 mt-9 ">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`transition-all duration-300 py-[13px] px-5 bg-white rounded-lg shadow-all-xl flex items-center justify-start space-x-3 max-w-[1400px] w-full
              ${menuOpen ? 'ml-[350px]' : 'ml-0'}`}
          >
            <svg
              className="w-12 h-12 text-gray-900"
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 5h16M4 12h16M4 19h16"></path>
            </svg>
            <span className="font-[1000] text-gray-900 text-4xl mb-1">MENU</span>
          </button>
        </header>

      <div className={`min-h-screen flex justify-center transition-all duration-300 ${menuOpen ? 'ml-[350px]' : 'ml-0'}`}>
        <div className="bg-white w-full max-w-[1400px] rounded-xl shadow-all-xl p-5 flex gap-6 mt-[150px]">

          {/* 왼쪽 박스: 테마 이미지 + 제목 + 설명 */}
          <div className="w-[55%] flex flex-col items-center">
            <div className="w-full h-[700px] overflow-hidden rounded-lg shadow">
              <img
                src={themeData.imageUrl}
                alt={themeData.title}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-2xl font-bold mt-6">{themeData.title}</h2>
            <p className="text-sm text-gray-600 mt-2 text-center">{themeData.description}</p>
          </div>

          {/* 오른쪽 박스: 캘린더 + 시간 선택 + NEXT 버튼 */}
          <div className="w-[100%] flex flex-col gap-6">
            <div className="bg-gray-50 rounded-lg p-6 shadow w-[420px] h-[485px]">
              <h3 className="text-lg font-bold mb-4">날짜 선택</h3>
              <div className="w-full max-w-[450px]">
                <Calendar className="w-full h-[380px]" />
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 shadow flex flex-col gap-4">
              <h3 className="text-lg font-bold">시간 선택</h3>
              <div className="grid grid-cols-4 gap-3 text-center">
                {["10:00", "12:00", "14:00", "16:00", "18:00", "20:00"].map(
                  (time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-2 border rounded ${selectedTime === time ? "bg-black text-white" : "bg-white hover:bg-gray-100"}`}
                    >
                      {time}
                    </button>
                  )
                )}
              </div>

              <div className="mt-4 flex flex-col gap-3">
                <button
                  onClick={nextBtn}
                  className="w-full py-3 bg-black text-white rounded-lg text-2xl font-black hover:bg-gray-800 transition"
                >
                  N E X T
                </button>
                <button
                  onClick={() => window.history.back()}
                  className="w-full py-3 border rounded-lg hover:bg-gray-50 text-2xl font-bold"
                >
                  ← 돌아가기
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
