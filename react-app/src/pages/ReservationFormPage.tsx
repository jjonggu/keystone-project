import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api";
import type { Theme } from "../types/theme";
import type { TimeSlot } from "../types/timeSlot";

interface LocationState {
  theme: Theme;
  date: string;
  timeSlot: TimeSlot;
}

export default function ReservationFormPage(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();

  /** 🔴 새로고침 / 잘못된 접근 방어 */
  if (!location.state) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">잘못된 접근입니다.</p>
          <button
            className="px-4 py-2 bg-black text-white rounded"
            onClick={() => navigate("/")}
          >
            메인으로 이동
          </button>
        </div>
      </div>
    );
  }

  const { theme, date, timeSlot } = location.state as LocationState;

  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [headCount, setHeadCount] = useState<number>(theme.minPerson);
  const [paymentType, setPaymentType] = useState<"CARD" | "CASH">("CARD");

  const totalPrice = headCount * theme.pricePerPerson;

  const submitReservation = async () => {
    if (!name.trim() || !phone.trim()) {
      alert("이름과 전화번호를 입력해주세요.");
      return;
    }

    try {
      await api.post("/reservations", {
        themeId: theme.themeId,
        timeSlotId: timeSlot.timeSlotId,
        reservationDate: date,
        customerName: name,
        customerPhone: phone,
        headCount,
        paymentType,
      });

      alert("예약이 완료되었습니다!");
      navigate("/");
    } catch (e) {
      alert("예약 중 오류가 발생했습니다.");
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex justify-center items-center">
      <div className="flex w-[900px] bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* 왼쪽 - 테마 이미지 */}
        <div className="w-1/2 bg-black">
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

        {/* 오른쪽 - 예약 폼 */}
        <div className="w-1/2 p-8">
          <h2 className="text-2xl font-bold mb-6">예약 정보 입력</h2>

          {/* 예약 요약 */}
          <div className="space-y-2 text-sm mb-6">
            <p>테마: {theme.themeName}</p>
            <p>날짜: {date}</p>
            <p>시간: {timeSlot.startTime.slice(0, 5)}</p>
          </div>

          {/* 입력 폼 */}
          <div className="space-y-4">
            <input
              placeholder="예약자 이름"
              className="w-full border px-3 py-2 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              placeholder="전화번호"
              className="w-full border px-3 py-2 rounded"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <div>
              <label className="text-sm block mb-1">인원 수</label>
              <select
                className="w-full border px-3 py-2 rounded"
                value={headCount}
                onChange={(e) => setHeadCount(Number(e.target.value))}
              >
                {Array.from({ length: 10 }).map((_, i) => {
                  const count = i + theme.minPerson;
                  return (
                    <option key={count} value={count}>
                      {count}명
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="text-lg font-semibold">
              총 금액: {totalPrice.toLocaleString()}원
            </div>

            <button
              onClick={submitReservation}
              className="w-full py-3 bg-black text-white rounded mt-4"
            >
              예약하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
