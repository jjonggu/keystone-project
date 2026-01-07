import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Menubar from "../components/ui/Menubar";
import api from "../api";
import type { Theme } from "../types/theme";
import type { TimeSlot } from "../types/timeSlot";
import ReCAPTCHA from "react-google-recaptcha";

interface LocationState {
  theme: Theme;
  date: string;
  timeSlot: TimeSlot;
}

export default function ReservationFormPage(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();

  /* MENU 상태 */
  const [menuOpen, setMenuOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "error">("success");


  /* 새로고침 / 잘못된 접근 방어 */
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

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [headCount, setHeadCount] = useState<number>(theme.minPerson);
  const [paymentType, setPaymentType] = useState<"CARD" | "CASH">("CASH");

  // reCAPTCHA
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const totalPrice = headCount * theme.pricePerPerson;
  const MAX_PERSON = 7;


  const submitReservation = async (): Promise<void> => {
    if (!name.trim() || !phone.trim()) {
      setAlertType("error");
      setAlertMessage("이름과 전화번호를 입력해주세요.");
      return;
    }

    if (!captchaToken) {
      setAlertType("error");
      setAlertMessage("로봇이 아님을 확인해주세요.");
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
        captchaToken,
      });

      setAlertType("success");
      setAlertMessage("예약이 완료되었습니다.");

      setTimeout(() => navigate("/"), 7000);

    } catch (error) {
      console.error(error);
      setAlertType("error");
      setAlertMessage("예약 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="relative min-h-screen bg-neutral-100">
      {/* 사이드 메뉴 */}
      <Menubar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* MENU 헤더 */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-center pt-6 mt-9">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`
            transition-all duration-300
            py-[13px] px-5
            bg-white rounded-lg shadow-all-xl
            flex items-center space-x-3
            max-w-[1400px] w-full
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
          <span className="font-[1000] text-gray-900 text-4xl mb-1">
            MENU
          </span>
        </button>
      </header>

      {/* 본문 */}
      <main
        className={`transition-all duration-300 flex justify-center items-center min-h-screen
          ${menuOpen ? "ml-[350px]" : "ml-0"}
        `}
      >
        <div className="flex w-[900px] bg-white rounded-2xl shadow-xl overflow-hidden mt-[120px]">
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

            <div className="space-y-2 text-sm mb-6">
              <p>테마: {theme.themeName}</p>
              <p>날짜: {date}</p>
              <p>시간: {timeSlot.startTime.slice(0, 5)}</p>
            </div>

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
                  {Array.from(
                      { length: MAX_PERSON - theme.minPerson + 1 },
                      (_, i) => {
                        const count = theme.minPerson + i;
                        return (
                          <option key={count} value={count}>
                            {count}명
                          </option>
                        );
                      }
                    )}
                </select>
              </div>

              <div className="text-lg font-semibold">
                총 금액: {totalPrice.toLocaleString()}원
              </div>

              {/* reCAPTCHA */}
              <div className="mt-6">
                <div className="flex justify-center border border-neutral-300 rounded-lg bg-neutral-50 py-4">
                  <ReCAPTCHA
                    sitekey="6LfQj0AsAAAAABES2KK5wmu_0OuO5cfIFBxQRx4p"
                    onChange={(token) => setCaptchaToken(token)}
                  />
                </div>

                {!captchaToken && (
                  <p className="text-xs text-red-500 text-center mt-2">
                    예약을 진행하려면 로봇이 아님을 확인해주세요.
                  </p>
                )}
              </div>

              <button
                onClick={submitReservation}
                disabled={!captchaToken}
                className={`
                  w-full py-3 rounded mt-4 transition-all
                  ${captchaToken
                    ? "bg-black text-white hover:bg-neutral-800"
                    : "bg-neutral-300 text-neutral-500 cursor-not-allowed"}
                `}
              >
                예약하기
              </button>
            </div>
          </div>
        </div>
      </main>

        {/* 커스텀 알림 모달 */}
      {alertMessage && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-2xl px-10 py-8 w-[380px] text-center shadow-2xl animate-fadeIn">
        <h3
            className={`text-2xl font-bold mb-4 ${
            alertType === "success"
            ? "text-black"
            : "text-red-600"
            }`}
            >
            {alertType === "success" ? "알림" : "오류"}
            </h3>

        <p className="text-neutral-700 mb-6 leading-relaxed">
            {alertMessage}
        </p>

        <button
            onClick={() => {
                setAlertMessage(null);
                navigate("/")}}
            className="w-full py-3 bg-black text-white rounded-lg hover:bg-neutral-800 transition"
        >
        확인
        </button>
        </div>
        </div>
        )}
      <footer className="border-t border-neutral-200 py-14 text-center text-[11px] tracking-widest text-neutral-500">
        <p>KEYSTONE GANGNAM ESCAPE ROOM</p>
        <p className="mt-3">PRIVATE UI CLONE</p>
        <p className="mt-3">Tel: 010 1234 5678</p>
      </footer>
    </div>
  );
}
