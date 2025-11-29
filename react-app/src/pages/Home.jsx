import React, { useState } from "react";
import Banner from "../assets/images/Banner.png";
import MainRoGo from "../assets/images/MainRoGo.png";
import toadImg from "../assets/images/toad.jpg";
import pinokioImg from "../assets/images/pinokio.png";
import reverbImg from "../assets/images/reverb.png";
import goallthewayImg from "../assets/images/goalltheway.jpg";
import luciddreamImg from "../assets/images/luciddream.jpg";
import apartmentImg from "../assets/images/apartment.jpg";
import { useNavigate } from "react-router-dom";

// 샘플 데이터
const themes = [
  { id: 1, title: "두껍아 두껍아 헌집줄께 새집다오", imageUrl: toadImg, description: "두꺼비 설명", genre: "코미디, 모험", playTime: "60분", difficulty: "중간" },
  { id: 2, title: "피노키오", imageUrl: pinokioImg, description: "피노키오 설명", genre: "판타지, 모험", playTime: "50분", difficulty: "쉬움" },
  { id: 3, title: "잔향", imageUrl: reverbImg, description: "잔향 설명", genre: "공포, 스릴러", playTime: "70분", difficulty: "어려움" },
  { id: 4, title: "끝가지 간다", imageUrl: goallthewayImg, description: "끝까지 간다 설명", genre: "액션, 스릴러", playTime: "65분", difficulty: "중간" },
  { id: 5, title: "루시드 드림", imageUrl: luciddreamImg, description: "루시드 드림 설명", genre: "판타지, 미스터리", playTime: "55분", difficulty: "중간" },
  { id: 6, title: "201호 202호", imageUrl: apartmentImg, description: "201호 202호 설명", genre: "스릴러, 미스터리", playTime: "60분", difficulty: "어려움" }
];

// 난이도별 별 표시 컴포넌트
function DifficultyStars({ level }) {
  let count;
  switch(level) {
    case "쉬움":
      count = 2;
      break;
    case "중간":
      count = 3;
      break;
    case "어려움":
      count = 5;
      break;
    default:
      count = 0;
  }
  return (
    <div className="flex space-x-1 text-white ml-1">
      {[...Array(5)].map((_, idx) => (
        <span key={idx}>{idx < count ? "★" : "☆"}</span>
      ))}
    </div>
  );
}

function ThemeModal({ open, onClose, theme, navigate  }) {
  if (!open || !theme) return null;
  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 flex justify-center items-center px-4 py-6 overflow-auto">
      <div className="bg-black rounded-xl w-full max-w-[900px] max-h-[90vh] flex flex-col sm:flex-row shadow-xl relative">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-3 right-5 text-white font-bold text-xl hover:text-gray-300 z-10"
        >
          ✕
        </button>

        {/* 왼쪽: 이미지 */}
        <div className="flex-shrink-0 w-full sm:w-1/2 max-h-[90vh] overflow-hidden">
          <img
            src={theme.imageUrl}
            alt={theme.title}
            className="w-full h-full object-cover rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none"
          />
        </div>

        {/* 오른쪽: 정보 */}
        <div className="flex-grow w-full sm:w-1/2 overflow-auto flex flex-col justify-between p-6 text-white">
          <div>
            <h1 className="text-4xl font-bold mb-4">{theme.title}</h1>
            <div className="flex justify-between mt-4 text-sm items-center">
              <span>장르: {theme.genre}</span>
              <span>플레이 시간: {theme.playTime}</span>
              <span className="flex items-center">
                난이도: <DifficultyStars level={theme.difficulty} />
              </span>
            </div>
            <p className="mt-6">{theme.description}</p>
          </div>

          {/* 예약 버튼 */}
            <div className="flex justify-end mt-4">
                <button
                  onClick={() => navigate(`/reservation/${theme.id}`, { state: { theme } })}
                  className="px-4 py-2 bg-white text-black text-sm font-semibold rounded hover:bg-gray-200 transition"
                >
                  예약 바로가기
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}

// ========== Home ==========
export default function Home() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(null);

  const scrollToThemes = () => {
    const section = document.getElementById("themes");
    section?.scrollIntoView({ behavior: "smooth" });
  };

  const openModal = (theme) => {
    setSelectedTheme(theme);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  return (
    <div className="relative min-h-screen text-gray-900 font-sans">
      {/* 모달 */}
      <ThemeModal open={modalOpen} onClose={closeModal} theme={selectedTheme} navigate={navigate} />

      {/* Hero */}
      <section className="relative w-full h-screen flex flex-col">
        <img src={Banner} alt="Hero Banner" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <header className="relative z-10 flex justify-between items-center px-8 py-6 w-full">
          <img src={MainRoGo} alt="Logo" className="h-[300px] w-auto object-contain drop-shadow-xl" />
          <div className="absolute left-1/2 transform -translate-x-1/2 flex bg-white/50 rounded-full shadow-lg font-bold">
            <input
              type="text"
              placeholder="테마명을 입력하세요"
              className="px-6 py-3 w-[600px] h-[50px] rounded-l-full bg-black/10 placeholder:text-gray-800 text-gray-900 focus:outline-none"
            />
            <button className="px-8 py-3 bg-white/80 text-gray-700 rounded-r-full hover:bg-gray-100 transition">
              검색
            </button>
          </div>
          <div className="w-14"></div>
        </header>

        <div className="relative z-10 flex-1 w-full px-6">
          <div className="absolute bottom-[20px] left-1/2 transform -translate-x-1/2 flex flex-col items-center font-bold">
            <button className="w-64 py-4 bg-white/50 rounded-xl shadow-sm hover:bg-white/80 transition">예약 조회 및 취소</button>
            <button className="w-64 py-4 mt-4 bg-white/50 rounded-xl shadow-sm hover:bg-white/80 transition">(공사중 예정)</button>
            <button
              onClick={scrollToThemes}
              className="mt-[110px] w-14 h-14 flex items-center justify-center rounded-full bg-white/30 backdrop-blur-md text-gray-900 shadow-xl hover:bg-white/50 hover:scale-110 transition-transform duration-300 animate-bounce"
            >
              <span className="text-3xl font-semibold">↓</span>
            </button>
          </div>
        </div>
      </section>

      {/* 테마 리스트 */}
      <section id="themes" className="px-4 py-16 bg-white">
        <h3 className="text-3xl font-bold mb-12">테마 정보</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {themes.map((theme, idx) => (
            <div
              key={idx}
              onClick={() => openModal(theme)}
              className="h-[570px] cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-3xl transition relative"
            >
              <img
                src={theme.imageUrl}
                alt={theme.title}
                className="w-full h-full object-cover"
              />
              {/* 제목 */}
              <h2 className="absolute bottom-11 left-4 text-white text-xl font-black">
                {theme.title}
              </h2>
              {/* 점과 줄 */}
              <div className="absolute bottom-4 left-4 flex items-center">
                <div className="flex flex-col justify-between h-3">
                  <span className="w-1 h-1 bg-white rounded-full"></span>
                  <span className="w-1 h-1 bg-white rounded-full"></span>
                </div>
                <div className="w-[367px] h-[1px] bg-white ml-5"></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 소개 */}
      <section className="bg-gray-50 px-8 py-16 text-gray-800">
        <h3 className="text-3xl font-bold mb-6">무비무드 소개</h3>
        <p className="max-w-3xl mb-4">Keystone Cape의 무비무드는 단순한 방탈출 그 이상의 경험입니다.</p>
        <p className="max-w-3xl">각 테마는 고유의 스토리를 가지고 있고, 당신은 그 안에서 주인공이 됩니다.</p>
      </section>

      <footer className="text-center py-8 text-gray-500 text-sm border-t">© 2025 Keystone Cape | All Rights Reserved</footer>
    </div>
  );
}
