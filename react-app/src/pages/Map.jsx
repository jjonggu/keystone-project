import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import KakaoMap from "../components/map/KakaoMap"; // ⭐ 카카오 지도 컴포넌트
import { Calendar } from "../components/ui/Calendar";
import {
  toadImg,
  pinokioImg,
  reverbImg,
  goallthewayImg,
  luciddreamImg,
  apartmentImg,
  Banner,
  mainrogo,
} from "../assets/images/common";
import Menubar from "../components/ui/Menubar";

export default function ReservationPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const themesData = [
    { title: "두껍아 두껍아 헌집줄께 새집다오", imageUrl: toadImg, description: "..." },
    { title: "피노키오", imageUrl: pinokioImg, description: "..." },
    { title: "잔향", imageUrl: reverbImg, description: "..." },
    { title: "끝까지 간다", imageUrl: goallthewayImg, description: "..." },
    { title: "루시드 드림", imageUrl: luciddreamImg, description: "..." },
    { title: "201호 202호", imageUrl: apartmentImg, description: "..." },
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
      state: { themeData, selectedTime },
    });
  };

  return (
    <div className="relative min-h-screen">
      <Menubar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* 상단 메뉴 버튼 */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-center pt-6 mt-9">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`transition-all duration-300 py-[13px] px-5 bg-white rounded-lg shadow-all-xl flex items-center justify-start space-x-3 max-w-[1400px] w-full ${
            menuOpen ? "ml-[350px]" : "ml-0"
          }`}
        >
          <span className="font-[1000] text-gray-900 text-4xl mb-1">MENU</span>
        </button>
      </header>

      {/* 내용 영역 */}
      <div
        className={`min-h-screen flex justify-center transition-all duration-300 ${
          menuOpen ? "ml-[350px]" : "ml-0"
        }`}
      >



        {/* 지도 + 오시는 길 영역 */}
        <div className="w-full max-w-[1200px] mt-48 px-6 flex gap-8">

          {/* 왼쪽: 오시는 길 */}
          <div className="w-[30%] bg-white p-5 rounded-xl shadow-all-xl h-[200px] flex flex-col justify-center">
            <h2 className="text-xl font-bold mb-3">오시는 길</h2>

            <p className="text-base text-gray-700 leading-relaxed">
              📍 서울 강남구 테헤란로 123
              <br />
              🚇 강남역 11번 출구 3분
            </p>
          </div>

          {/* 오른쪽: 지도 */}
          <div className="w-[70%]">
            <div className="w-full h-[450px] rounded-xl overflow-hidden shadow-all-xl">
              <KakaoMap />
            </div>
          </div>

        </div>





      </div>
    </div>
  );
}
