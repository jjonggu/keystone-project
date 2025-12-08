import KakaoMap from "../components/map/KakaoMap";
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
          {/* 햄버거 아이콘 */}
          <span className="text-4xl font-bold">☰</span>
          <span className="font-[1000] text-gray-900 text-4xl mb-1">MENU</span>
        </button>
      </header>

      <div
        className={`min-h-screen flex justify-center transition-all duration-300 ${
          menuOpen ? "ml-[350px]" : "ml-0"
        }`}
      >
        {/* 오시는 길 + 지도 */}
        <div className="w-full max-w-[1400px] mt-44 px-6">
          <div className="flex gap-10 w-full h-[650px]">

            {/* 왼쪽 : 오시는 길 */}
            <div className="w-[30%] bg-white rounded-2xl shadow-all-xl p-10 flex flex-col justify-start h-full">
              <h2 className="text-4xl font-extrabold mb-10 text-gray-900">
                오시는 길
              </h2>

              {/* 주소 */}
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">📍</span>
                  <p className="text-gray-800 text-xl font-semibold">
                    서울 강남구 테헤란로 123
                  </p>
                </div>
                <p className="text-gray-600 text-base ml-10 leading-relaxed">
                  강남역 11번 출구 도보 3분, 삼성스퀘어 빌딩 5층
                </p>
              </div>

              {/* 지하철 */}
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">🚇</span>
                  <p className="text-gray-800 text-xl font-semibold">지하철 이용</p>
                </div>
                <p className="text-gray-600 text-base ml-10 leading-relaxed">
                  2호선 강남역 11번 출구 → 직진 200m → 삼정빌딩 끼고 좌회전
                </p>
              </div>

            </div>

            {/* 오른쪽 : 지도 */}
            <div className="w-[70%] rounded-2xl shadow-all-xl overflow-hidden bg-gray-200 h-full">
              <KakaoMap />
            </div>

          </div>
        </div>








      </div>

    </div>
  );
}
