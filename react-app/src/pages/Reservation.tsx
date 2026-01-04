import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Menubar from "../components/ui/Menubar";
import { Calendar } from "../components/ui/Calendar";
import api from "../api";
import type { Theme } from "../types/theme";
import type { TimeSlot } from "../types/timeSlot";

/* 난이도 별 */
function DifficultyStars({ level }: { level: number }) {
  return (
    <span className="flex gap-[2px] text-xl">
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 5h16M4 12h16M4 19h16"
            />
          </svg>
          <span className="text-4xl font-[1000]">MENU</span>
        </button>
      </header>

      <main
        className={`transition-all duration-300 ${
          menuOpen ? "ml-[350px]" : "ml-0"
        }`}
      >
        {/* Hero */}
        <section className="pt-22 mt-[10rem]">
          <div className="h-[200px] flex justify-center items-center">
            <h2 className="text-6xl font-bold tracking-[0.4em]">
              RESERVATION
            </h2>
          </div>
        </section>

        {/* 날짜 선택 */}
        <section className="flex ml-[17.5rem] mb-[40px]">
          <Calendar
            selectedDate={selectedDate}
            onSelectDate={(date) => {
              setSelectedDate(date)
            }}
          />
        </section>

        {/* Theme List */}
        <section className="max-w-[1400px] mx-auto px-8 pb-24">
          <div className="flex flex-col gap-12">
            {themes.map((theme) => (
              <article
                key={theme.themeId}
                className="flex gap-8 border-b pb-10"
              >
                {/* 이미지 */}
                <div className="w-[350px] h-[520px] bg-black overflow-hidden flex-shrink-0">
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

                {/* 정보 + 시간 */}
                <div className="flex-1 ml-5">
                  <h3 className="text-4xl font-bold mb-2">
                    {theme.themeName}
                  </h3>

                  <p className="text-xl mb-3 text-gray-900 text-opacity-30">
                    PLAY TIME · {theme.playTime} MIN
                  </p>

                  <DifficultyStars level={theme.difficulty} />

                  {/* 시간 버튼 */}
                  <div className="mt-[100px] flex flex-wrap gap-3">
                    {availableTimes[theme.themeId]?.length === 0 && (
                      <span className="text-sm text-neutral-400">
                        예약 마감
                      </span>
                    )}

                    {availableTimes[theme.themeId]?.map((slot) => (
                      <button
                        key={slot.timeSlotId}
                        disabled={slot.reserved}
                        className={`
                          min-w-[200px] py-2 text-xl border
                          ${
                            slot.reserved
                              ? "bg-gray-400 text-white cursor-not-allowed"
                              : "hover:bg-black hover:text-white"
                          }
                        `}
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
