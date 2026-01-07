import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Menubar from "../components/ui/Menubar";
import { Calendar } from "../components/ui/Calendar";
import api from "../api";
import type { Theme } from "../types/theme";
import type { TimeSlot } from "../types/timeSlot";

/* 난이도 */
function DifficultyStars({ level }: { level: number }) {
  return (
    <span className="flex gap-[2px] text-xl">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < level ? "text-black" : "text-neutral-300"}>
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
  const [selectedThemeId, setSelectedThemeId] =
    useState<number | "전체">("전체");

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
    <div className="relative min-h-screen bg-white text-black">
      <Menubar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* MENU 버튼 */}
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
            className="w-12 h-12"
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
        {/* 타이틀 */}
        <section className="mt-[8rem]">
          <div className="h-[200px] flex justify-center items-center">
            <h2 className="text-4xl md:text-6xl tracking-[0.3em] font-bold">
              RESERVATION
            </h2>
          </div>
        </section>

        {/* ✅ 필터 영역 (목록이랑 같은 컨테이너) */}
        <section className="max-w-[1400px] mx-auto px-6 lg:px-8 mb-12">
          <div
            className="
              flex flex-col lg:flex-row
              gap-6
              items-start lg:items-end
            "
          >
            {/* 날짜 */}
            <div className="w-full lg:w-auto flex flex-col">
              <label className="mb-2 text-sm font-semibold">날짜 선택</label>
              <Calendar
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                className="h-[42px]"
              />
            </div>

            {/* 테마 */}
            <div className="w-full lg:w-[200px] flex flex-col">
              <label className="mb-2 text-sm font-semibold">테마 선택</label>
              <select
                className="h-[42px] border rounded px-3"
                value={selectedThemeId}
                onChange={(e) =>
                  setSelectedThemeId(
                    e.target.value === "전체" ? "전체" : Number(e.target.value)
                  )
                }
              >
                <option value="전체">전체</option>
                {themes.map((t) => (
                  <option key={t.themeId} value={t.themeId}>
                    {t.themeName}
                  </option>
                ))}
              </select>
            </div>

            {/* 조회 */}
            <div className="w-full lg:w-[200px] flex flex-col lg:ml-auto lg:mr-[-30px]">
              <label className="mb-2 opacity-0">조회</label>
              <button className="h-[42px] border rounded hover:bg-black hover:text-white"
                      onClick={()=> navigate("/confirm")}>
                예약 조회 / 취소
              </button>
            </div>
          </div>
        </section>

        {/* 목록 */}
        <section className="max-w-[1400px] mx-auto px-6 lg:px-8 pb-24">
          <div className="flex flex-col gap-16">
            {themes
              .filter((t) =>
                selectedThemeId === "전체"
                  ? true
                  : t.themeId === selectedThemeId
              )
              .map((theme) => (
                <article
                  key={theme.themeId}
                  className="flex flex-col lg:flex-row gap-8 border-b pb-12"
                >
                  <div className="w-full lg:w-[350px] h-[360px] lg:h-[520px] bg-black">
                    <img
                      src={
                        theme.imageUrl.startsWith("http")
                          ? theme.imageUrl
                          : `http://localhost:8080/upload/${theme.imageUrl}`
                      }
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-3xl lg:text-4xl font-bold mb-2">
                      {theme.themeName}
                    </h3>
                    <p className="text-gray-400 mb-3">
                      PLAY TIME · {theme.playTime} MIN
                    </p>
                    <DifficultyStars level={theme.difficulty} />

                    <div className="mt-10 flex flex-wrap gap-3">
                      {availableTimes[theme.themeId]?.map((slot) => (
                        <button
                          key={slot.timeSlotId}
                          disabled={slot.reserved}
                          className={`min-w-[160px] lg:min-w-[200px] py-2 border ${
                            slot.reserved
                              ? "bg-gray-400 text-white"
                              : "hover:bg-black hover:text-white"
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
                </article>
              ))}
          </div>
        </section>
      </main>
    </div>
  );
}
