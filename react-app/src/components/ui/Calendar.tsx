// src/components/ui/Calendar.tsx
import React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { ko } from "date-fns/locale"; // 한국어 적용
import "@styles/calendar.css";

interface CalendarProps {
  className?: string;
  date?: string;
}

export function Calendar({ className = "", date }: CalendarProps) {

  const selectedDate = date ? new Date(date) : undefined;

  return (
    <div className={`my-calendar ${className}`}>
      <DayPicker
        mode="single"
        selected={selectedDate}
        disabled={{ before: new Date() }} // 과거 날짜 비활성화
        locale={ko}
        classNames={{
          selected: "bg-gray-300 text-white rounded-full",
          disabled: "opacity-40 cursor-not-allowed",
        }}
      />
    </div>
  );
}
