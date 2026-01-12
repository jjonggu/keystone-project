import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Menubar from "../components/ui/Menubar";
import type { Theme } from "../types/theme";
import { Banner } from "../assets/images/common";
import api from "../api";

/* 난이도 별점 */
function DifficultyStars({ level }: { level: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`text-sm ${i < level ? "text-black" : "text-neutral-200"}`}
        >
          ★
        </span>
      ))}
    </span>
  );
}

interface ThemeModalProps {
  open: boolean;
  onClose: () => void;
  theme: Theme | null;
  navigate: ReturnType<typeof useNavigate>;
}

/* 모달 - 디자인 정돈 및 글자 직립화 */
function ThemeModal({ open, onClose, theme, navigate }: ThemeModalProps): JSX.Element | null {
  if (!open || !theme) return null;

  const imgSrc = theme.imageUrl.startsWith("http")
    ? theme.imageUrl
    : `http://localhost:8080/upload/${theme.imageUrl}`;

  return (
    <div className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="relative bg-white rounded-[2rem] w-full max-w-[1000px] max-h-[90vh] shadow-2xl flex flex-col md:flex-row overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-6 right-6 z-20 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold hover:scale-105 transition">✕</button>

        <div className="w-full md:w-1/2 bg-neutral-100 relative">
          <div className="aspect-[3/4] md:h-full w-full">
            <img
              src={imgSrc}
              alt={theme.themeName}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between overflow-y-auto bg-white">
          <div>
            <span className="text-[10px] font-bold tracking-[0.3em] text-neutral-300 uppercase">Premium Mission</span>
            <h1 className="text-4xl font-black text-black mt-2 mb-6 tracking-tighter uppercase leading-none">{theme.themeName}</h1>

            <div className="flex gap-8 py-5 border-y border-neutral-100 mb-8">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Play Time</span>
                <span className="font-bold text-lg">{theme.playTime} MIN</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Difficulty</span>
                <DifficultyStars level={theme.difficulty} />
              </div>
            </div>

            <p className="text-neutral-500 text-[15px] leading-relaxed break-keep font-medium">
              {theme.themeDescription}
            </p>
          </div>

          <button
            onClick={() => navigate("/reservation", { state: { theme } })}
            className="mt-12 w-full py-5 bg-black text-white font-black text-lg rounded-2xl hover:bg-neutral-800 transition-all shadow-xl uppercase tracking-widest"
          >
            예약하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Theme(): JSX.Element {
  const navigate = useNavigate();
  const [themes, setThemes] = useState<Theme[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);

  useEffect(() => {
    api.get("/themes").then((res) => setThemes(res.data));
  }, []);

const scrollToThemes = () => {
  const target = document.getElementById("theme-list");
  if (!target) return;

  const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;

  // 1200ms(1.2초)로 설정. 더 빠르게 하고 싶으면 800~1000으로 줄이세요.
  const duration = 1200;
  let start: number | null = null;

  const step = (timestamp: number) => {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    const percentage = Math.min(progress / duration, 1);

    // 표준 Ease-in-out 수식
    const ease = percentage < 0.5
      ? 2 * percentage * percentage
      : -1 + (4 - 2 * percentage) * percentage;

    window.scrollTo(0, startPosition + distance * ease);

    if (progress < duration) {
      window.requestAnimationFrame(step);
    }
  };

  window.requestAnimationFrame(step);
};

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
      <Menubar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <ThemeModal open={modalOpen} onClose={() => setModalOpen(false)} theme={selectedTheme} navigate={navigate} />

      <section className="relative h-screen w-full flex flex-col items-center justify-center">
        <img src={Banner} alt="banner" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white" />

      {/* FIXED HEADER: 유지 */}
        {/* FIXED HEADER: 관리자 버튼 추가 버전 */}
        <header className="fixed top-0 left-0 w-full z-50 flex justify-center pt-6 mt-9 px-6">
          <div className={`transition-all duration-500 py-[13px] px-6 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] flex items-center max-w-[1400px] w-full
            ${menuOpen ? "ml-[350px]" : "ml-0"}`}>

            {/* 메뉴 버튼 */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center space-x-4 group">
              <div className="flex flex-col space-y-1.5">
                <span className={`h-1 w-8 bg-black transition-all ${menuOpen ? "rotate-45 translate-y-2.5" : ""}`}></span>
                <span className={`h-1 w-8 bg-black transition-all ${menuOpen ? "opacity-0" : ""}`}></span>
                <span className={`h-1 w-8 bg-black transition-all ${menuOpen ? "-rotate-45 -translate-y-2.5" : ""}`}></span>
              </div>
              <span className="font-black text-gray-900 text-4xl tracking-tighter">MENU</span>
            </button>

            {/* 관리자 페이지 버튼 (오른쪽 정렬) */}
            <button
              onClick={() => navigate("/admin/reservations")}
              className="ml-auto px-6 py-2.5 text-xs font-black uppercase tracking-widest border-2 border-black rounded-full hover:bg-black hover:text-white transition-all"
            >
              Admin
            </button>
          </div>
        </header>
        {/* 시인성을 높이고 자연스러운 이동을 유도하는 버튼 */}
        <div className="absolute bottom-[80px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20">
          <button
            onClick={scrollToThemes}
            className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:scale-110 transition-transform animate-bounce group"
          >
            <span className="text-3xl font-bold text-black transition-transform duration-300 group-hover:scale-125">↓</span>
          </button>
        </div>
      </section>

      <section id="theme-list" className="max-w-[1400px] mx-auto px-8 py-32 bg-white">
        <div className="mb-20">
          <p className="text-neutral-300 font-bold tracking-[0.4em] uppercase text-xs mb-2">Our Collections</p>
          <h2 className="text-5xl font-black tracking-tighter">THEME</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-24">
          {themes.map((theme) => (
            <div
              key={theme.themeId}
              onClick={() => { setSelectedTheme(theme); setModalOpen(true); }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[3/4.5] rounded-[2.5rem] overflow-hidden bg-neutral-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-700 group-hover:shadow-3xl group-hover:-translate-y-4">
                <img
                  src={theme.imageUrl.startsWith("http") ? theme.imageUrl : `http://localhost:8080/upload/${theme.imageUrl}`}
                  alt={theme.themeName}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                />
              </div>

              <div className="mt-8 px-4">
                <div className="flex items-center gap-3 mb-2 font-bold text-[11px] text-neutral-300 uppercase tracking-widest">
                  <span>{theme.playTime} Min</span>
                  <div className="w-1 h-1 bg-neutral-200 rounded-full" />
                  <DifficultyStars level={theme.difficulty} />
                </div>
                <h3 className="text-3xl font-black text-neutral-900 tracking-tighter uppercase group-hover:text-neutral-600 transition-colors">
                  {theme.themeName}
                </h3>
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