import React, { useEffect, useState } from "react";
import Menubar from "../components/ui/Menubar";
import api from "../api";
import type { Theme } from "../types/theme";
import type { TimeSlot } from "../types/timeSlot";
import { Calendar } from "../components/ui/Calendar";
import { useNavigate } from "react-router-dom";


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


  /** 캘린더 상태 */
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  /** 테마별 예약 가능 시간 */
  const [availableTimes, setAvailableTimes] = useState<{
    [themeId: number]: TimeSlot[];
  }>({});

  /* 테마 목록 */
  useEffect(() => {
    api.get("/themes").then((res) => setThemes(res.data));
  }, []);

  /* 날짜 변경 시 예약 가능 시간 조회 */
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

  /* 캘린더 닫기 이벤트 */
  useEffect(() => {
    const close = () => setCalendarOpen(false);
    window.addEventListener("calendar-close", close);
    return () => window.removeEventListener("calendar-close", close);
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

        {/* 날짜 선택 */}
        <section className="flex justify-center mb-20 relative">
          <div className="relative">
            <div
              className="w-[280px] border px-4 py-3 flex justify-between items-center cursor-pointer"
              onClick={() => setCalendarOpen((p) => !p)}
            >
<span>{formatLocalDate(selectedDate)}</span>
              <span>📅</span>
            </div>

            {calendarOpen && (
              <div className="absolute top-[60px] left-0 z-50">
                <Calendar
                  selectedDate={selectedDate}
                  onSelectDate={(date) => {
                    setSelectedDate(date);
                    setCalendarOpen(false);
                  }}
                />
              </div>
            )}
          </div>
        </section>

        {/* Theme Grid */}
        <section className="max-w-[1400px] mx-auto px-8 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
            {themes.map((theme) => (
              <article
                key={theme.themeId}
                className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-[0_25px_50px_rgba(0,0,0,0.15)]"
              >
                <div className="h-[600px] overflow-hidden bg-black">
                  <img
                    src={
                      theme.imageUrl.startsWith("http")
                        ? theme.imageUrl
                        : `http://localhost:8080/upload/${theme.imageUrl}`
                    }
                    alt={theme.themeName}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-3">
                    {theme.themeName}
                  </h3>

                  <p className="text-sm mb-2">
                    PLAY TIME · {theme.playTime} MIN
                  </p>

                  <DifficultyStars level={theme.difficulty} />

                  <div className="mt-6 flex flex-wrap gap-2">
                    {availableTimes[theme.themeId]?.length === 0 && (
                      <span className="text-xs text-neutral-400">
                        예약 마감
                      </span>
                    )}

                    {availableTimes[theme.themeId]?.length === 0 && (
                      <span className="text-xs text-neutral-400">
                        예약 마감
                      </span>
                    )}

                    {availableTimes[theme.themeId]?.map((slot) => (
                      <button
                        key={slot.timeSlotId}
                        disabled={slot.reserved}
                        className="
                          px-3 py-1 text-xs border rounded-md
                          hover:bg-black hover:text-white
                          disabled:opacity-40
                          disabled:cursor-not-allowed
                        "
                        onClick={() => {
                          if (slot.reserved) return;

                          navigate("/reservation/form", {
                            state: {
                              theme,
                              date: formatLocalDate(selectedDate),
                              timeSlot: slot,
                            },
                          });
                        }}
                      >
                        {slot.startTime.slice(0, 5)}
                      </button>
                    ))}

                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
