import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Menubar from "../components/ui/Menubar";
import api from "../api";
import type { Theme } from "../types/theme";

/* =========================
   난이도 별
========================= */
function DifficultyStars({ level }: { level: number }) {
  return (
    <span className="flex gap-[2px]">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={i < level ? "text-black" : "text-neutral-300"}
        >
          ★
        </span>
      ))}
    </span>
  );
}

/* =========================
   Theme Page
========================= */
export default function ThemePage(): JSX.Element {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [themes, setThemes] = useState<Theme[]>([]);

  useEffect(() => {
    api.get("/themes").then((res) => setThemes(res.data));
  }, []);

  return (
    <div className="relative min-h-screen bg-white text-black">
      <Menubar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* 메뉴 버튼 */}
      <header className="fixed top-0 left-0 z-50 w-full flex justify-center pt-6 mt-9">
        <button
          onClick={() => setMenuOpen((p) => !p)}
          className={`
            max-w-[1400px] w-full
            flex items-center space-x-3
            py-[13px] px-5
            bg-white rounded-lg shadow-all-xl
            transition-all duration-300
            ${menuOpen ? "ml-[350px]" : "ml-0"}
          `}
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
          <span className="text-4xl font-[1000]">MENU</span>
        </button>
      </header>

      <main className={`transition-all duration-300 ${menuOpen ? "ml-[350px]" : "ml-0"}`}>
        {/* Hero */}
        <section className="pt-44">
          <div className="h-[520px] flex items-center justify-center">
            <h2 className="text-6xl font-bold tracking-[0.4em]">RESERVATION</h2>
          </div>
        </section>

        {/* Theme Grid */}
        <section className="max-w-[1400px] mx-auto px-8 py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
            {themes.map((theme) => (
              <article
                key={theme.themeId}
                onClick={() => navigate("/reservation", { state: { theme } })}
                className="
                  cursor-pointer
                  bg-white
                  rounded-3xl
                  border border-neutral-200
                  overflow-hidden
                  shadow-[0_25px_50px_rgba(0,0,0,0.15)]
                  transition
                  hover:-translate-y-1
                "
              >
                {/* 이미지 영역 */}
                <div className="h-[600px] overflow-hidden bg-black">
                  <img
                    src={
                      theme.imageUrl.startsWith("http")
                        ? theme.imageUrl
                        : `http://localhost:8080/upload/${theme.imageUrl}`
                    }
                    alt={theme.themeName}
                    className="
                      w-full h-full object-cover
                      transition-transform duration-700
                      hover:scale-105
                    "
                  />
                </div>

                {/* 구분선 (영역 분리 포인트) */}
                <div className="h-[1px] bg-neutral-200" />

                {/* 정보 영역 */}
                <div className="p-6 bg-white">
                  <h3 className="text-2xl font-semibold mb-3">
                    {theme.themeName}
                  </h3>

                  <div className="space-y-2 text-sm text-neutral-700">
                    <p>PLAY TIME · {theme.playTime} MIN</p>

                    <div className="flex items-center gap-2">
                      <span>DIFFICULTY ·</span>
                      <DifficultyStars level={theme.difficulty} />
                    </div>
                  </div>

                  <button
                    className="
                      mt-6 w-full py-3
                      border border-black
                      text-xs tracking-[0.3em]
                      transition
                      hover:bg-black hover:text-white
                    "
                  >
                    RESERVATION
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-neutral-200 py-14 text-center text-[11px] tracking-widest text-neutral-500">
          <p>KEYSTONE GANGNAM ESCAPE ROOM</p>
          <p className="mt-3">PRIVATE UI CLONE</p>
        </footer>
      </main>
    </div>
  );
}
