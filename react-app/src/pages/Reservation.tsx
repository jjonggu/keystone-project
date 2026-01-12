import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Menubar from "../components/ui/Menubar";
import { Calendar } from "../components/ui/Calendar";
import api from "../api";
import type { Theme } from "../types/theme";
import type { TimeSlot } from "../types/timeSlot";

/* 난이도 스타일 개선 */
function DifficultyStars({ level }: { level: number }) {
  return (
    <span className="flex gap-[4px] text-lg">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < level ? "text-zinc-900" : "text-zinc-200"}>
          ★
        </span>
      ))}
    </span>
  );
}

function formatLocalDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function ThemePage(): JSX.Element {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedThemeId, setSelectedThemeId] = useState<number | "전체">("전체");

  const [availableTimes, setAvailableTimes] = useState<{
    [themeId: number]: TimeSlot[];
  }>({});

  useEffect(() => {
    api.get("/themes").then((res) => setThemes(res.data));
  }, []);

  useEffect(() => {
    const dateStr = formatLocalDate(selectedDate);
    themes.forEach((theme) => {
      api
        .get(`/themes/${theme.themeId}/available-times`, {
          params: { date: dateStr },
        })
        .then((res) => {
          setAvailableTimes((prev) => ({
            ...prev,
            [theme.themeId]: res.data,
          }));
        });
    });
  }, [themes, selectedDate]);

  return (
    <div className="relative min-h-screen bg-neutral-50 text-black font-sans">
      <Menubar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* FIXED HEADER: 유지 */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-center pt-6 mt-9 px-6">
        <div className={`transition-all duration-500 py-[13px] px-6 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] flex items-center max-w-[1400px] w-full
          ${menuOpen ? "ml-[350px]" : "ml-0"}`}>
          <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center space-x-4 group">
            <div className="flex flex-col space-y-1.5">
              <span className={`h-1 w-8 bg-black transition-all ${menuOpen ? "rotate-45 translate-y-2.5" : ""}`}></span>
              <span className={`h-1 w-8 bg-black transition-all ${menuOpen ? "opacity-0" : ""}`}></span>
              <span className={`h-1 w-8 bg-black transition-all ${menuOpen ? "-rotate-45 -translate-y-2.5" : ""}`}></span>
            </div>
            <span className="font-black text-gray-900 text-4xl tracking-tighter">MENU</span>
          </button>
        </div>
      </header>

      <main className={`transition-all duration-300 ${menuOpen ? "ml-[350px]" : "ml-0"}`}>
        {/* 타이틀 영역 */}
        <section className="mt-[12rem] mb-16 text-center">
          <p className="text-sm font-bold tracking-[0.4em] text-zinc-400 mb-4 uppercase">Experience the story</p>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter italic">
            RESERVATION
          </h2>
        </section>

        {/* 필터 영역 (세련되게 변경) */}
        <section className="max-w-[1400px] mx-auto px-6 lg:px-8 mb-20">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-zinc-100 flex flex-col lg:flex-row gap-8 items-end">

            <div className="w-full lg:w-auto flex flex-col gap-2">
              <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest ml-1">Select Date</label>
              <div className="h-[50px] min-w-[240px]">
                <Calendar
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                  className="w-full h-full border-zinc-200 rounded-xl"
                />
              </div>
            </div>

            <div className="w-full lg:w-[280px] flex flex-col gap-2">
              <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest ml-1">Select Theme</label>
              <select
                className="w-full h-[50px] border border-zinc-200 rounded-xl px-4 text-lg font-bold focus:ring-2 focus:ring-black focus:outline-none transition-all appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%23666%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:20px] bg-[right_16px_center] bg-no-repeat"
                value={selectedThemeId}
                onChange={(e) =>
                  setSelectedThemeId(
                    e.target.value === "전체" ? "전체" : Number(e.target.value)
                  )
                }
              >
                <option value="전체">모든 테마보기</option>
                {themes.map((t) => (
                  <option key={t.themeId} value={t.themeId}>{t.themeName}</option>
                ))}
              </select>
            </div>

            <div className="w-full lg:w-auto lg:ml-auto">
              <button
                className="w-full lg:w-auto px-8 h-[50px] border-2 border-zinc-900 rounded-xl font-bold hover:bg-black hover:text-white transition-all duration-300"
                onClick={() => navigate("/confirm")}
              >
                예약 내역 확인/취소
              </button>
            </div>
          </div>
        </section>

        {/* 목록 섹션 */}
        <section className="max-w-[1400px] mx-auto px-6 lg:px-8 pb-32">
          <div className="grid grid-cols-1 gap-24">
            {themes
              .filter((t) => (selectedThemeId === "전체" ? true : t.themeId === selectedThemeId))
              .map((theme) => (
                <article
                  key={theme.themeId}
                  className="flex flex-col lg:flex-row gap-12 group animate-in fade-in slide-in-from-bottom-8 duration-700"
                >
                  {/* 이미지 영역 */}
                  <div className="w-full lg:w-[450px] h-[550px] overflow-hidden rounded-[2.5rem] shadow-2xl relative">
                    <img
                      src={
                        theme.imageUrl.startsWith("http")
                          ? theme.imageUrl
                          : `http://localhost:8080/upload/${theme.imageUrl}`
                      }
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      alt={theme.themeName}
                    />
                  </div>

                  {/* 텍스트 및 시간 정보 */}
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="mb-8">
                      <div className="flex items-center gap-4 mb-4">
                        <DifficultyStars level={theme.difficulty} />
                        <span className="w-1 h-1 bg-zinc-300 rounded-full"></span>
                        <p className="text-zinc-500 font-bold tracking-widest text-xs uppercase">
                          {theme.playTime} MINUTES PLAY
                        </p>
                      </div>
                      <h3 className="text-4xl lg:text-6xl font-black mb-4 tracking-tighter group-hover:text-zinc-700 transition-colors">
                        {theme.themeName}
                      </h3>
                      <div className="h-1 w-12 bg-black"></div>
                    </div>

                    <div className="mt-4">
                      <p className="text-[10px] font-black text-zinc-400 mb-6 tracking-[0.2em] uppercase">Available Time Slots</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                        {availableTimes[theme.themeId]?.map((slot) => (
                          <button
                            key={slot.timeSlotId}
                            disabled={slot.reserved}
                            className={`py-4 rounded-xl font-bold text-lg transition-all border-2 ${
                              slot.reserved
                                ? "bg-zinc-100 border-transparent text-zinc-300 cursor-not-allowed line-through"
                                : "bg-white border-zinc-100 hover:border-black hover:shadow-lg active:scale-95"
                            }`}
                            onClick={() =>
                              navigate("/reservation/form", {
                                state: {
                                  theme,
                                  date: formatLocalDate(selectedDate),
                                  timeSlot: slot,
                                },
                              })
                            }
                          >
                            {slot.startTime.slice(0, 5)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 py-14 text-center text-[11px] tracking-widest text-neutral-500">
        <p>KEYSTONE GANGNAM ESCAPE ROOM</p>
        <p className="mt-3">PRIVATE UI CLONE</p>
        <p className="mt-3">Tel: 010 1234 5678</p>
      </footer>
    </div>
  );
}