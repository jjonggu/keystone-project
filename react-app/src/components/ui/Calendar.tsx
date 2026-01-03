import React from "react";
import { DayPicker } from "react-day-picker";
import { ko } from "date-fns/locale";

import "react-day-picker/dist/style.css";
import "@styles/calendar.css";

interface CalendarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

/** ⭐ 날짜 시간 제거 유틸 */
function normalizeDate(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function Calendar({
  selectedDate,
  onSelectDate,
}: CalendarProps): JSX.Element {

  /** 오늘 */
  const today = normalizeDate(new Date());

  /** 오늘 포함 + 7일 */
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 7);

  return (
    <div className="calendar-popup">
      <DayPicker
        mode="single"
        locale={ko}
        selected={normalizeDate(selectedDate)} // ⭐ 여기 중요
        onSelect={(date) => {
          if (date) {
            onSelectDate(normalizeDate(date)); // ⭐ 여기 중요
          }
        }}
        disabled={[
          { before: today },
          { after: maxDate },
        ]}
      />

      <div className="calendar-footer">
        <button
          className="calendar-today"
          onClick={() => onSelectDate(today)}
        >
          TODAY
        </button>
        <button
          className="calendar-close"
          onClick={() =>
            window.dispatchEvent(new Event("calendar-close"))
          }
        >
          ✕ CLOSE
        </button>
      </div>
    </div>
  );
}
