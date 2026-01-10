import React, { useState } from "react";
import Menubar from "../components/ui/Menubar";
import api from "../api";
import { FaRocket, FaSearch, FaRegCalendarAlt, FaUser, FaPhoneAlt, FaTicketAlt } from "react-icons/fa";


interface Reservation {
  reservationId: number;
  reservationDate: string;
  customerName: string;
  customerPhone: string;
  headCount: number;
  paymentType: string;
  reservationStatus: string;
  themeName: string;
  startTime: string;
}

export default function ConfirmPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [reservationId, setReservationId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [reservation, setReservation] = useState<Reservation | null>(null);

  const [showCancelForm, setShowCancelForm] = useState(false);
  const [cancelId, setCancelId] = useState<number | null>(null);

  const [refundBank, setRefundBank] = useState("");
  const [refundAccount, setRefundAccount] = useState("");

  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "error" | "confirm">("success");
  const [onConfirm, setOnConfirm] = useState<(() => void) | null>(null);


  const fetchReservation = async () => {

   if (!/^[가-힣]{1,7}$/.test(name)) {
      setAlertType("error");
      setAlertMessage("이름은 한글 7자 이내로 입력해주세요.");
      return;
    }

    if (!/^\d{1,15}$/.test(phone)) {
      setAlertType("error");
      setAlertMessage("전화번호는 숫자만 최대 15자리입니다.");
      return;
    }

    if (!/^\d{1,10}$/.test(reservationId)) {
      setAlertType("error");
      setAlertMessage("예약번호는 숫자만 최대 10자리입니다.");
      return;
    }

    if (!reservationId || !name || !phone) {
      setAlertType("error");
      setAlertMessage("예약번호, 이름, 전화번호를 모두 입력해주세요.");
      return;
    }

    try {
      const res = await api.get("/reservations/confirm", {
        params: { reservationId, name, phone },
      });
      setReservation(res.data);
    } catch {
      setAlertType("error");
      setAlertMessage("예약 정보를 찾을 수 없습니다.");
      setReservation(null);
    }
  };

  const cancelReservation = async () => {
    if (!reservation) return;
    setAlertType("confirm");
        setAlertMessage("정말 예약을 취소하시겠습니까?");
        setOnConfirm(() => async () => {
          try {
            const res = await api.post(
              `/reservations/${reservation.reservationId}/cancel`
            );

            setCancelId(res.data);
            setShowCancelForm(true);
            setReservation(null);
          } catch {
            setAlertType("error");
            setAlertMessage("예약 취소 중 오류가 발생했습니다.");
          }
        });
      };

  const saveRefundAccount = async () => {


  if (!/^[가-힣]{1,7}$/.test(refundBank)) {
      setAlertType("error");
      setAlertMessage("은행명은 한글 7자 이내로 입력해주세요.");
      return;
    }

    if (!/^\d{1,20}$/.test(refundAccount)) {
      setAlertType("error");
      setAlertMessage("계좌번호는 숫자만 최대 20자리입니다.");
      return;
    }

    if (!refundBank || !refundAccount) {
      setAlertType("error");
      setAlertMessage("환불 계좌 정보를 입력해주세요.");
      return;
    }

    try {
      await api.put(`/reservations/cancel/${cancelId}/refund`, {
        refundBank,
        refundAccount,
      });

      setAlertType("success");
      setAlertMessage("예약 취소 및 환불 정보가 저장되었습니다.");
      reset();
    } catch {
      setAlertType("error");
      setAlertMessage("환불 계좌 저장 중 오류가 발생했습니다.");
    }
  };

  const reset = () => {
    setReservation(null);
    setReservationId("");
    setName("");
    setPhone("");
    setShowCancelForm(false);
    setRefundBank("");
    setRefundAccount("");
    setCancelId(null);
  };


  return (
      <div className="relative min-h-screen bg-[#f8f9fa] text-zinc-900 font-sans">
        {/* 배경 장식 (휑함을 방지) */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-zinc-200/50 rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] right-[0%] w-[30%] h-[30%] bg-zinc-200/50 rounded-full blur-[100px]" />
        </div>

        <Menubar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

              {/* 상단 메뉴 버튼 */}
              <header className="fixed top-0 left-0 w-full z-50 flex justify-center pt-6 mt-9">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className={`transition-all duration-300 py-[13px] px-5 bg-white rounded-lg shadow-all-xl flex items-center justify-start space-x-3 max-w-[1400px] w-full
                    ${menuOpen ? "ml-[350px]" : "ml-0"}`}
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

        <main className="relative z-10 flex justify-center items-center pt-48 pb-32 px-6">
          <div className="w-full max-w-[600px] bg-white rounded-[40px] shadow-[0_20px_70px_-10px_rgba(0,0,0,0.1)] overflow-hidden border border-zinc-100">

            {/* 상단 타이틀 바 */}
            <div className="bg-black py-10 text-center">
              <h2 className="text-white text-3xl font-extrabold tracking-tighter italic">
                RESERVATION CHECK
              </h2>
              <p className="text-zinc-400 text-xs mt-2 tracking-[0.3em]">예약 확인 및 취소</p>
            </div>

            <div className="p-10 md:p-14">
              {/* 조회 입력 폼 */}
              {!reservation && !showCancelForm && (
                <div className="space-y-6">
                  <div className="group border-b border-zinc-200 focus-within:border-black transition-colors pb-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Name</label>
                    <div className="flex items-center">
                      <FaUser className="text-zinc-300 mr-4" />
                      <input
                        placeholder="예약자 성함"
                        className="w-full py-2 text-xl bg-transparent focus:outline-none placeholder:text-zinc-300"
                        value={name}
                        maxLength={7}
                        onKeyDown={(e) => e.key === " " && e.preventDefault()}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="group border-b border-zinc-200 focus-within:border-black transition-colors pb-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Contact</label>
                    <div className="flex items-center">
                      <FaPhoneAlt className="text-zinc-300 mr-4" />
                      <input
                        placeholder="연락처 ('-' 제외)"
                        className="w-full py-2 text-xl bg-transparent focus:outline-none placeholder:text-zinc-300"
                        value={phone}
                        maxLength={15}
                        inputMode="numeric"
                        onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                      />
                    </div>
                  </div>

                  <div className="group border-b border-zinc-200 focus-within:border-black transition-colors pb-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Order Number</label>
                    <div className="flex items-center">
                      <FaTicketAlt className="text-zinc-300 mr-4" />
                      <input
                        placeholder="예약번호 입력"
                        className="w-full py-2 text-xl bg-transparent focus:outline-none placeholder:text-zinc-300"
                        value={reservationId}
                        inputMode="numeric"
                        maxLength={10}
                        onChange={(e) => setReservationId(e.target.value.replace(/[^0-9]/g, ""))}
                      />
                    </div>
                  </div>

                  <button
                    onClick={fetchReservation}
                    className="w-full mt-10 py-5 bg-black text-white rounded-2xl text-lg font-bold tracking-widest
                               hover:bg-zinc-800 transition-all flex items-center justify-center space-x-3 shadow-lg shadow-black/10"
                  >
                    <FaSearch className="text-sm" />
                    <span>조회하기</span>
                  </button>
                </div>
              )}

              {/* 예약 정보 결과 */}
              {reservation && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-zinc-50 rounded-3xl p-8 space-y-5 mb-8 border border-zinc-100">
                    <div className="flex justify-between border-b border-zinc-200 pb-3">
                      <span className="text-zinc-400 font-medium">테마명</span>
                      <span className="font-bold text-xl">{reservation.themeName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400 font-medium">예약일자</span>
                      <span className="font-semibold">{reservation.reservationDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400 font-medium">시작시간</span>
                      <span className="font-semibold">{reservation.startTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400 font-medium">인원</span>
                      <span className="font-semibold">{reservation.headCount}명</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400 font-medium">결제방식</span>
                      <span className="font-semibold">{reservation.paymentType}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <button
                      onClick={cancelReservation}
                      className="w-full py-5 bg-red-50 text-red-600 rounded-2xl text-lg font-bold hover:bg-red-100 transition-colors"
                    >
                      예약 취소 신청
                    </button>
                    <button
                      onClick={() => { reset(); }}
                      className="w-full py-4 text-zinc-400 text-sm font-medium hover:text-black transition-colors underline underline-offset-4"
                    >
                      다른 예약 조회하기
                    </button>
                  </div>
                </div>
              )}

              {/* 환불 계좌 입력 */}
              {showCancelForm && (
                <div className="animate-in zoom-in-95 duration-300 space-y-6">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold">환불 정보를 입력해주세요</h3>
                    <p className="text-zinc-400 text-sm mt-2">입금 확인 후 환불 처리가 진행됩니다.</p>
                  </div>

                  <input
                    placeholder="은행명 (예: 국민은행)"
                    className="w-full border-2 border-zinc-100 px-6 py-4 rounded-2xl text-lg focus:border-black focus:outline-none transition-all"
                    value={refundBank}
                    maxLength={10}
                    onChange={(e) => setRefundBank(e.target.value)}
                  />

                  <input
                    placeholder="계좌번호 (- 없이 입력)"
                    className="w-full border-2 border-zinc-100 px-6 py-4 rounded-2xl text-lg focus:border-black focus:outline-none transition-all"
                    value={refundAccount}
                    inputMode="numeric"
                    maxLength={20}
                    onKeyDown={(e) => e.key === " " && e.preventDefault()}
                    onChange={(e) => setName(e.target.value)}
                  />

                  <button
                    onClick={saveRefundAccount}
                    className="w-full py-5 bg-black text-white rounded-2xl text-lg font-bold shadow-xl shadow-black/20 hover:scale-[1.02] transition-transform"
                  >
                    환불 신청 완료
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* 커스텀 알림 모달 */}
        {alertMessage && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setAlertMessage(null)} />
            <div className="relative bg-white rounded-[32px] p-10 w-full max-w-[400px] text-center shadow-2xl animate-in fade-in zoom-in duration-300">
              <div className={`w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl ${
                alertType === "error" ? "bg-red-100 text-red-600" : "bg-zinc-100 text-black"
              }`}>
                {alertType === "error" ? "!" : "✓"}
              </div>
              <h3 className="text-xl font-bold mb-2">
                {alertType === "confirm" ? "정말 취소하시겠습니까?" : alertType === "error" ? "문제가 발생했습니다" : "알림"}
              </h3>
              <p className="text-zinc-500 mb-8 leading-relaxed">{alertMessage}</p>

              {alertType === "confirm" ? (
                <div className="flex gap-3">
                  <button
                    onClick={() => { setAlertMessage(null); setOnConfirm(null); }}
                    className="flex-1 py-4 bg-zinc-100 rounded-2xl font-bold hover:bg-zinc-200 transition-colors"
                  >
                    아니오
                  </button>
                  <button
                    onClick={() => { onConfirm?.(); setAlertMessage(null); setOnConfirm(null); }}
                    className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-colors"
                  >
                    네, 취소합니다
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setAlertMessage(null)}
                  className="w-full py-4 bg-black text-white rounded-2xl font-bold hover:bg-zinc-800 transition-colors"
                >
                  확인
                </button>
              )}
            </div>
          </div>
        )}

        {/* QUICK RESERVATION: 기존 유지 */}
        <div className="fixed bottom-8 right-8 z-50">
          <button
            onClick={() => (window.location.href = "/reservation")}
            className="w-36 h-36 rounded-full bg-black text-white font-bold text-lg shadow-2xl
                       flex flex-col items-center justify-center
                       transition-all duration-300 hover:scale-110 active:scale-95 group"
          >
            <FaRocket className="text-4xl mb-2 animate-bounce group-hover:text-yellow-400 transition-colors" />
            빠른 예약
          </button>
        </div>

      {/* Footer */}
      <footer className="border-t border-neutral-200 py-14 text-center text-[11px] tracking-widest text-neutral-500 bg-white">
        <p>KEYSTONE GANGNAM ESCAPE ROOM</p>
        <p className="mt-3">PRIVATE UI CLONE</p>
        <p className="mt-3 text-zinc-400">Tel: 010 1234 5678</p>
      </footer>
      </div>
    );
  }