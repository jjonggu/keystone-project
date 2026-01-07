import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Menubar from "../components/ui/Menubar";
import type { Theme } from "../types/theme";
import { Banner } from "../assets/images/common";
import api from "../api";

function DifficultyStars({ level }: { level: number }) {
  return (
    <span className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`text-base ${i < level ? "text-black" : "text-neutral-300"}`}
        >
          ★
        </span>
      ))}
    </span>
  );
}

/* 타입 */
interface ThemeModalProps {
  open: boolean;
  onClose: () => void;
  theme: Theme | null;
  navigate: ReturnType<typeof useNavigate>;
}

/* 모달 */
function ThemeModal({ open, onClose, theme, navigate }: ThemeModalProps): JSX.Element | null {
  if (!open || !theme) return null;

  const imgSrc = theme.imageUrl.startsWith("http")
    ? theme.imageUrl
    : `http://localhost:8080/upload/${theme.imageUrl}`;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center px-4">
      <div className="relative bg-black rounded-2xl w-full max-w-[900px] shadow-xl flex flex-col sm:flex-row">
        {/* 닫기 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-black text-xl font-bold hover:opacity-70"
        >
          ✕
        </button>

        {/* 이미지 */}
        <div className="w-full sm:w-1/2 aspect-[4/6] overflow-hidden rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none">
          <img src={imgSrc} alt={theme.themeName} className="w-full h-full object-cover" />
        </div>

        {/* 정보 */}
        <div className="w-full sm:w-1/2 p-6 text-black flex flex-col justify-between bg-white rounded-r-2xl">
          <div>
            <h1 className="text-4xl font-bold mb-4">{theme.themeName}</h1>

            <div className="flex items-center gap-6 text-sm mb-6">
              <span>플레이 {theme.playTime}분</span>
              <span>최소 {theme.minPerson}명</span>

              <div className="flex items-center gap-2">
                <span>난이도</span>
                <DifficultyStars level={theme.difficulty} />
              </div>
            </div>

            <p className="leading-relaxed whitespace-pre-line">{theme.themeDescription}</p>
          </div>

          <button
            onClick={() => navigate("/reservation", { state: { theme } })}
            className="mt-6 py-3 px-6 bg-white text-black font-semibold rounded-lg shadow-[0_6px_18px_rgba(0,0,0,0.25)] hover:shadow-[0_10px_25px_rgba(0,0,0,0.35)] hover:bg-neutral-100 transition-all duration-300"
          >
            예약하러 가기
          </button>
        </div>
      </div>
    </div>
  );
}

/* 메인 페이지 */
export default function Theme(): JSX.Element {
  const navigate = useNavigate();

  const [themes, setThemes] = useState<Theme[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);

  const isAdmin = true; // 임시: 실제로는 로그인/권한 체크 필요

  useEffect(() => {
    api.get("/themes").then((res) => {
      setThemes(res.data);
    });
  }, []);

  const scrollToThemes = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative min-h-screen bg-white text-black">
      <Menubar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <ThemeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        theme={selectedTheme}
        navigate={navigate}
      />

      {/* 헤더 */}
      <section className="relative h-screen w-full">
        <img src={Banner} alt="banner" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />

        {/* HEADER */}
        <header className="fixed top-0 left-0 w-full z-50 flex justify-center pt-6 mt-9">
          <div
            className={`
              transition-all duration-300
              py-[13px] px-5
              bg-white rounded-lg shadow-all-xl
              flex items-center
              max-w-[1400px] w-full
              ${menuOpen ? "ml-[350px]" : "ml-0"}
            `}
          >
            {/* MENU 버튼 */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center space-x-3"
            >
              <svg
                className="w-12 h-12 text-gray-900"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 5h16M4 12h16M4 19h16" />
              </svg>
              <span className="font-[1000] text-gray-900 text-4xl">MENU</span>
            </button>

            {/* 관리자 버튼 (여기만 추가) */}
            {isAdmin && (
              <button
                onClick={() => navigate("/admin/reservations")}
                className="
                  ml-auto
                  px-6 py-3
                  text-sm font-semibold
                  border border-gray
                  rounded-full
                  hover:bg-black hover:text-white
                  transition
                "
              >
                관리자 페이지
              </button>
            )}
          </div>
        </header>


        <div className="absolute bottom-[100px] left-1/2 -translate-x-1/2">
          <button
            onClick={scrollToThemes}
            className="w-14 h-14 rounded-full bg-white/40 backdrop-blur-md flex items-center justify-center shadow-xl hover:scale-110 transition animate-bounce"
          >
            <span className="text-3xl font-bold">↓</span>
          </button>
        </div>
      </section>

      {/* 테마 정보 목록 */}
      <section className="max-w-[1400px] mx-auto px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
          {themes.map((theme) => (
            <div
              key={theme.themeId}
              onClick={() => {
                setSelectedTheme(theme);
                setModalOpen(true);
              }}
              className="group cursor-pointer"
            >
              <div className="h-[600px] bg-white rounded-3xl border border-neutral-200 shadow-[0_25px_50px_rgba(0,0,0,0.15)] overflow-hidden">
                <img
                  src={theme.imageUrl.startsWith("http") ? theme.imageUrl : `http://localhost:8080/upload/${theme.imageUrl}`}
                  alt={theme.themeName}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 py-14 text-center text-[11px] tracking-widest text-neutral-500">
        <p>KEYSTONE GANGNAM ESCAPE ROOM</p>
        <p className="mt-3">PRIVATE UI CLONE</p>
        <p className="mt-3">Tel: 010 1234 5678</p>
      </footer>
    </div>
  );
}
