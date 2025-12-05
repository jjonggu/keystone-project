// Calendar.tsx
import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { ko } from "date-fns/locale"; // 한국어 인스톨
import "@styles/calendar.css";

interface CalendarProps {
  className?: string;
}

export function Calendar({ className = "" }: CalendarProps) {
  const allowedDates: Date[] = [new Date(2025, 10, 29)]; // 11월 29일 (0-index)
  const holidays: Date[] = allowedDates;
  const [selected, setSelected] = useState<Date[]>([]);

  const isDisabled = (date: Date) =>
    !allowedDates.some((d) => d.toDateString() === date.toDateString());

  return (
    <div className={`my-calendar ${className}`}>
      <DayPicker
        mode="multiple"
        selected={selected}
        onSelect={setSelected}
        disabled={isDisabled}
        modifiers={{ holiday: holidays }}
        modifiersStyles={{ holiday: { color: "black", fontWeight: "bold" } }}
        classNames={{
          selected: "bg-gray-300 text-white rounded-full",
          disabled: "opacity-40 cursor-not-allowed",
        }}
        locale={ko} // 년 월 한국어 적용
      />
    </div>
  );
}
