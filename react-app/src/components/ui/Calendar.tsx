import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { ko } from "date-fns/locale"
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"
import "@styles/calendar.css";

interface CalendarProps {
  selectedDate: Date | null
  onSelectDate: (date: Date) => void
}

/* 날짜 시간 제거 */
function normalizeDate(date: Date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

export function Calendar({
  selectedDate,
  onSelectDate,
}: CalendarProps): JSX.Element {
  const [open, setOpen] = React.useState(false)

  const today = normalizeDate(new Date())
  const maxDate = new Date(today)
  maxDate.setDate(today.getDate() + 7)

  return (
    <div className="relative w-[180px]">
      {/* 버튼 */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-lg hover:bg-gray-50"
      >
        {selectedDate
          ? selectedDate.toLocaleDateString("ko-KR")
          : "날짜 선택"}
        <ChevronDownIcon className="h-4 w-4 opacity-50" />
      </button>

      {/* 달력 */}
      {open && (
        <div
          className="absolute left-0 z-50 mt-2 rounded-md border bg-white p-5 shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <DayPicker
            mode="single"
            locale={ko}
            selected={selectedDate ?? undefined}
            onSelect={(date) => {
              if (!date) return
              onSelectDate(normalizeDate(date))
              setOpen(false)
            }}
            disabled={[
              { before: today },
              { after: maxDate },
            ]}
            modifiers={{
              sunday: { dayOfWeek: [0] },
              saturday: { dayOfWeek: [6] },
            }}
            modifiersClassNames={{
              sunday: "text-red-500",
              saturday: "text-red-500",
            }}
            classNames={{
              day: "h-9 w-9 rounded-md hover:bg-gray-100",
              day_selected: "bg-black text-white hover:bg-black",
              day_today: "border border-black",

              /** 🔥 여기 핵심 — 화살표 <> 검정 */
              nav_button: "text-black hover:text-black",
            }}
          />
        </div>
      )}
    </div>
  )
}
