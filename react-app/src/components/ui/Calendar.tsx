// src/components/ui/Calendar.tsx
import React from "react";
import { DayPicker } from "react-day-picker";
import { ko } from "date-fns/locale";

import "react-day-picker/dist/style.css";
import "@styles/calendar.css";

interface CalendarProps {
  className?: string;
  selectedDates: Date[];
  onSelectDates: (dates: Date[]) => void;
}

export function Calendar({
  className = "",
  selectedDates,
  onSelectDates,
}: CalendarProps): JSX.Element {
  const handleSelect = (date?: Date) => {
    if (!date) return;
    onSelectDates([date]);
  };

  return (
    <div className={`my-calendar ${className}`}>
      <DayPicker
        mode="single"
        locale={ko}
        selected={selectedDates[0]}
        onSelect={handleSelect}
        disabled={{ before: new Date() }}
        classNames={{
          selected: "bg-gray-300 text-white rounded-full",
          disabled: "opacity-40 cursor-not-allowed",
        }}
      />
    </div>
  );
}
