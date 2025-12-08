// src/pages/Theme.tsx
import React, { useState, useEffect } from "react";
import Menubar from "../components/ui/Menubar";
import { useNavigate } from "react-router-dom";
import type { Theme } from "../types/theme";
import { Banner, mainrogo } from "../assets/images/common";
import api from "../api";

/* 난이도 별표 */
interface DifficultyStarsProps {
  level: number;
}
function DifficultyStars({ level }: DifficultyStarsProps) {
  return (
    <div className="flex space-x-1 text-white ml-1">
      {[...Array(5)].map((_, idx) => (
        <span key={idx}>{idx < level ? "★" : "☆"}</span>
      ))}
    </div>
  );
}

/* 테마 상세 모달 */
interface ThemeModalProps {
  open: boolean;
  onClose: () => void;
  theme: Theme | null;
  navigate: ReturnType<typeof useNavigate>;
}
function ThemeModal({ open, onClose, theme, navigate }: ThemeModalProps) {
  if (!open || !theme) return null;

  const imgSrc = theme.imageUrl.startsWith("http")
    ? theme.imageUrl
    : `http://localhost:8080/upload/${theme.imageUrl}`;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 flex justify-center items-center px-4 py-6 overflow-auto">
      <div className="bg-black rounded-xl w-full max-w-[900px] max-h-[90vh] flex flex-col sm:flex-row shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-5 text-white font-bold text-xl hover:text-gray-300 z-10"
        >
          ✕
        </button>

        <div className="flex-shrink-0 w-full sm:w-1/2 max-h-[90vh] overflow-hidden">
          <img
            src={imgSrc}
            alt={theme.themeName}
            className="w-full h-full object-cover rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "/no-image.png";
            }}
          />
        </div>

        <div className="flex-grow w-full sm:w-1/2 overflow-auto flex flex-col justify-between p-6 text-white">
          <div>
            <h1 className="text-4xl font-bold mb-4">{theme.themeName}</h1>
            <div className="flex justify-between mt-4 text-sm items-center">
              <span>플레이 시간: {theme.playTime}분</span>
              <span>최소 인원: {theme.minPerson}명</span>
              <span className="flex items-center">
                난이도: <DifficultyStars level={theme.difficulty} />
              </span>
            </div>
            <p className="mt-6">{theme.themeDescription}</p>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={() =>
                navigate(`/reservation/${theme.themeId}`, { state: { theme } })
              }
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

/* 메인 페이지 */
export default function Theme() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const res = await api.get("/themes"); // /api/themes
        const processed = res.data.map((t: Theme) => ({
          ...t,
          imageUrl: t.imageUrl.startsWith("http")
            ? t.imageUrl
            : t.imageUrl.replace(/^\/?upload\//, ""), // DB에는 파일명만 저장
        }));
        setThemes(processed);
      } catch (error) {
        console.error("테마 불러오기 실패:", error);
      }
    };
    fetchThemes();
  }, []);

  const scrollToThemes = () => {
    const section = document.getElementById("themes");
    section?.scrollIntoView({ behavior: "smooth" });
  };

  const openModal = (theme: Theme) => {
    setSelectedTheme(theme);
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  return (
    <div className="relative min-h-screen text-gray-900 font-sans">
      <Menubar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <ThemeModal
        open={modalOpen}
        onClose={closeModal}
        theme={selectedTheme}
        navigate={navigate}
      />

      {/* Hero */}
      <section className="relative w-full h-screen flex flex-col">
        <img
          src={Banner}
          alt="Hero Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <header className="fixed top-0 left-0 w-full z-50 flex justify-center pt-6 mt-9">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`transition-all duration-300 py-[13px] px-5 bg-white rounded-lg shadow-all-xl flex items-center justify-start space-x-3 max-w-[1400px] w-full ${
              menuOpen ? "ml-[350px]" : "ml-0"
            }`}
          >
            <svg
              className="w-12 h-12 text-gray-900"
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 5h16M4 12h16M4 19h16"
              />
            </svg>
            <span className="font-[1000] text-gray-900 text-4xl mb-1">MENU</span>
          </button>
        </header>

        <div className="absolute bottom-[100px] left-1/2 transform -translate-x-1/2">
          <button
            onClick={scrollToThemes}
            className="w-14 h-14 flex items-center justify-center rounded-full bg-white/30 backdrop-blur-md text-black shadow-xl hover:bg-white/50 hover:scale-110 transition-transform duration-300 animate-bounce"
          >
            <span className="text-3xl font-semibold">↓</span>
          </button>
        </div>
      </section>

    {/* 테마 리스트 */}
    <section id="themes" className="px-4 py-16 bg-white">
      <h3 className="text-3xl font-bold mb-12">테마 정보</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {themes.map((theme) => (
          <div
            key={theme.themeId}
            onClick={() => openModal(theme)}
            className="h-[600px] cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-3xl transition relative"
          >
            <img
              src={`http://localhost:8080/upload/${theme.imageUrl}`}
              alt={theme.themeName}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/no-image.png";
              }}
            />
            <h2 className="absolute bottom-11 left-4 text-white text-xl font-black">
              {theme.themeName}
            </h2>

            {/* 기존 점과 선 추가 */}
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
      <section className="bg-white px-8 py-16">
        <img
          src={mainrogo}
          alt="무비무드 로고"
          className="h-[400px] w-auto -ml-[55px]"
        />
        <hr className="border-t-2 border-gray-300 mb-6 -mt-[70px]" />
        <div className="text-[24px] mt-[50px]">
          <p className="font-bold mb-[20px]">상호: KEYSTONE CAPE</p>
          <p className="font-bold mb-[20px]">주소: 서울특별시 강남구 76-22 4층</p>
          <p className="font-bold mb-[20px]">Email: show@keystone.cape</p>
          <p className="font-bold">© 2025 Keystone Cape | All Rights Reserved</p>
        </div>
      </section>
    </div>
  );
}
