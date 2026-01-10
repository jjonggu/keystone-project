import React, { useState , useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Menubar from "../components/ui/Menubar";
import api from "../api";
import type { Theme } from "../types/theme";
import type { TimeSlot } from "../types/timeSlot";
import ReCAPTCHA from "react-google-recaptcha";
import { FaUser, FaPhoneAlt, FaUsers, FaInfoCircle, FaCalendarAlt, FaClock } from "react-icons/fa";

interface LocationState {
  theme: Theme;
  date: string;
  timeSlot: TimeSlot;
}

export default function ReservationFormPage(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();

  const [reservationState] = useState<LocationState | null>(
    location.state as LocationState | null
  );

  const [menuOpen, setMenuOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "error">("success");

  if (!reservationState) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100">
        <div className="text-center bg-white p-10 rounded-3xl shadow-xl">
          <p className="mb-6 text-xl font-bold text-neutral-400">잘못된 접근입니다.</p>
          <button
            className="px-8 py-3 bg-black text-white rounded-full font-bold hover:scale-105 transition-transform"
            onClick={() => navigate("/")}
          >
            메인으로 이동
          </button>
        </div>
      </div>
    );
  }

  const { theme, date, timeSlot } = reservationState;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [headCount, setHeadCount] = useState<number>(theme.minPerson);
  const [paymentType, setPaymentType] = useState<"CARD" | "CASH">("CASH");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const totalPrice = headCount * theme.pricePerPerson;
  const MAX_PERSON = 7;

  const submitReservation = async (): Promise<void> => {
    if (!name || name.length > 7) {
      setAlertType("error");
      setAlertMessage("이름은 한글 7자 이내로 입력해주세요.");
      return;
    }

    if (!/^\d{1,15}$/.test(phone)) {
      setAlertType("error");
      setAlertMessage("전화번호는 숫자만 최대 15자리까지 입력 가능합니다.");
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
    } catch (error) {
      console.error(error);
      setAlertType("error");
      setAlertMessage("예약 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  useEffect(() => {
    if (!alertMessage) return;

    const blockKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    window.addEventListener("keydown", blockKey);
    return () => window.removeEventListener("keydown", blockKey);
  }, [alertMessage]);

  return (
    <div className="relative min-h-screen bg-neutral-100 font-sans">
      <Menubar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* 헤더 유지 */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-center pt-6 mt-9">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`
            transition-all duration-300 py-[13px] px-5 bg-white rounded-lg shadow-all-xl flex items-center space-x-3 max-w-[1400px] w-full
            ${menuOpen ? "ml-[350px]" : "ml-0"}
          `}
        >
          <svg className="w-12 h-12 text-gray-900" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 5h16M4 12h16M4 19h16" />
          </svg>
          <span className="font-[1000] text-gray-900 text-4xl mb-1">MENU</span>
        </button>
      </header>

      <main className={`transition-all duration-300 flex justify-center items-center py-40 px-6 ${menuOpen ? "ml-[350px]" : "ml-0"}`}>
        <div className="flex flex-col lg:flex-row w-full max-w-[1050px] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white mt-10">

          {/* 왼쪽: 테마 프리뷰 (강조형) */}
          <div className="lg:w-2/5 relative min-h-[400px]">
            <img
              src={theme.imageUrl.startsWith("http") ? theme.imageUrl : `http://localhost:8080/upload/${theme.imageUrl}`}
              alt={theme.themeName}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-10 flex flex-col justify-end text-white">
              <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold tracking-widest mb-4 w-fit">
                SELECTED THEME
              </div>
              <h2 className="text-4xl font-black tracking-tighter mb-2 italic drop-shadow-lg">{theme.themeName}</h2>
              <p className="text-zinc-300 text-sm font-medium tracking-wide">플레이 시간: {theme.playTime}분</p>
            </div>
          </div>

          {/* 오른쪽: 입력 폼 */}
          <div className="lg:w-3/5 p-10 md:p-14 bg-white">

            {/* 상단 예약 일정 배지 (강조 포인트) */}
            <div className="flex flex-wrap gap-3 mb-12">
              <div className="flex items-center gap-3 bg-zinc-900 text-white px-6 py-4 rounded-2xl shadow-lg shadow-zinc-200">
                <FaCalendarAlt className="text-zinc-400" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-tighter">Date</span>
                  <span className="text-lg font-black">{date}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white border-2 border-zinc-900 px-6 py-4 rounded-2xl">
                <FaClock className="text-zinc-400" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">Time</span>
                  <span className="text-lg font-black text-black">{timeSlot.startTime.slice(0, 5)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-2 mb-2 border-l-4 border-black pl-4">
                <h2 className="text-2xl font-black tracking-tight uppercase">Reservation Info</h2>
              </div>

              {/* 이름 입력 */}
              <div className="relative group">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1 mb-2 block">Customer Name</label>
                <div className="flex items-center border-b-2 border-zinc-100 group-focus-within:border-black transition-all pb-2">
                  <FaUser className="text-zinc-300 mr-4" />
                  <input
                    placeholder="성함"
                    className="w-full text-lg focus:outline-none bg-transparent font-medium"
                    value={name}
                    maxLength={7}
                    onKeyDown={(e) => e.key === " " && e.preventDefault()}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              {/* 연락처 입력 */}
              <div className="relative group">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1 mb-2 block">Contact Number</label>
                <div className="flex items-center border-b-2 border-zinc-100 group-focus-within:border-black transition-all pb-2">
                  <FaPhoneAlt className="text-zinc-300 mr-4" />
                  <input
                    placeholder="숫자만 입력"
                    className="w-full text-lg focus:outline-none bg-transparent font-medium"
                    value={phone}
                    inputMode="numeric"
                    maxLength={15}
                    onKeyDown={(e) => e.key === " " && e.preventDefault()}
                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                  />
                </div>
              </div>

              {/* 인원 및 금액 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative group">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1 mb-2 block">Head Count</label>
                  <div className="flex items-center border-b-2 border-zinc-100 group-focus-within:border-black transition-all pb-2">
                    <FaUsers className="text-zinc-300 mr-4" />
                    <select
                      className="w-full text-lg focus:outline-none bg-transparent appearance-none cursor-pointer font-bold"
                      value={headCount}
                      onChange={(e) => setHeadCount(Number(e.target.value))}
                    >
                      {Array.from({ length: MAX_PERSON - theme.minPerson + 1 }, (_, i) => {
                        const count = theme.minPerson + i;
                        return <option key={count} value={count}>{count}명</option>;
                      })}
                    </select>
                  </div>
                </div>

                <div className="bg-zinc-50 rounded-2xl p-4 flex flex-col justify-center items-end border border-zinc-100 ring-4 ring-zinc-50">
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Total Price</span>
                  <span className="text-3xl font-black text-black leading-none">{totalPrice.toLocaleString()}원</span>
                </div>
              </div>

              {/* reCAPTCHA */}
              <div className="mt-8 flex justify-center bg-zinc-50 rounded-2xl py-6 border border-zinc-100">
                <ReCAPTCHA
                  sitekey="6LfQj0AsAAAAABES2KK5wmu_0OuO5cfIFBxQRx4p"
                  onChange={(token) => token && setCaptchaToken(token)}
                  onExpired={() => setCaptchaToken(null)}
                />
              </div>

              <button
                onClick={submitReservation}
                disabled={!captchaToken}
                className={`
                  w-full py-5 rounded-2xl text-xl font-black tracking-[0.2em] transition-all shadow-xl
                  ${captchaToken ? "bg-black text-white hover:bg-zinc-800 active:scale-95 shadow-zinc-200" : "bg-zinc-200 text-zinc-400 cursor-not-allowed"}
                `}
              >
                예약하기
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* 알림 모달 - 스타일 유지 */}
      {alertMessage && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
          <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-[400px] text-center shadow-2xl animate-in fade-in zoom-in duration-300 border border-zinc-100">
            <div className={`w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl ${alertType === "success" ? "bg-zinc-900 text-white" : "bg-red-50 text-red-600"}`}>
              {alertType === "success" ? "✓" : "!"}
            </div>
            <h3 className={`text-2xl font-black mb-2 tracking-tight ${alertType === "success" ? "text-black" : "text-red-600"}`}>
              {alertType === "success" ? "알림" : "오류"}
            </h3>
            <p className="text-zinc-500 mb-8 font-medium leading-relaxed">{alertMessage}</p>
            <button
              onClick={() => {
                setAlertMessage(null);
                if (alertType === "success") navigate("/");
              }}
              className="w-full py-4 bg-black text-white rounded-2xl font-bold hover:bg-zinc-800 transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-neutral-200 py-14 text-center text-[11px] tracking-widest text-neutral-500 bg-white">
        <p>KEYSTONE GANGNAM ESCAPE ROOM</p>
        <p className="mt-3">PRIVATE UI CLONE</p>
        <p className="mt-3 text-zinc-400">Tel: 010 1234 5678</p>
      </footer>
    </div>
  );
}