import React, { useState } from "react";
import Menubar from "../components/ui/Menubar";
import api from "../api";

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
    <div className="relative min-h-screen bg-neutral-100">
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

      <main className="flex justify-center items-center pt-40 pb-40">
        <div className="w-[700px] bg-white px-16 py-14 rounded-3xl shadow-xl mt-10">
          <h2 className="text-4xl font-bold mb-14 text-center tracking-tight">
            예약 조회
          </h2>

          {/* 조회 입력 */}
          {!reservation && !showCancelForm && (
            <div className="space-y-8">

              {/* 이름 */}
              <div className="flex items-center gap-4">
                <span className="w-28 text-lg font-semibold">
                  예약자명
                </span>
                <input
                  placeholder="성함"
                  className="flex-1 border px-6 py-4 rounded-xl text-xl focus:outline-none focus:ring-2 focus:ring-black"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* 전화번호 */}
              <div className="flex items-center gap-4">
                <span className="w-28 text-lg font-semibold">
                  연락처
                </span>
                <input
                  placeholder="01012345678"
                  className="flex-1 border px-6 py-4 rounded-xl text-xl focus:outline-none focus:ring-2 focus:ring-black"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              {/* 예약번호 */}
              <div className="flex items-center gap-4">
                <span className="w-28 text-lg font-semibold ">
                  예약번호
                </span>
                <input
                  placeholder="예약번호를 입력하세요"
                  className="flex-1 border px-6 py-4 rounded-xl text-xl focus:outline-none focus:ring-2 focus:ring-black"
                  value={reservationId}
                  onChange={(e) => setReservationId(e.target.value)}
                />
              </div>

              <button
                onClick={fetchReservation}
                className="w-full mt-6 py-5 bg-black text-white rounded-full text-xl font-semibold tracking-wide"
              >
                확인
              </button>
            </div>
          )}

          {/* 예약 정보 */}
          {reservation && (
            <div className="mt-14 border-t pt-10 text-lg space-y-4">
              <p><b>테마</b> : {reservation.themeName}</p>
              <p><b>날짜</b> : {reservation.reservationDate}</p>
              <p><b>시간</b> : {reservation.startTime}</p>
              <p><b>인원</b> : {reservation.headCount}명</p>
              <p><b>결제</b> : {reservation.paymentType}</p>

              <button
                onClick={cancelReservation}
                className="w-full mt-10 py-5 bg-red-600 text-white rounded-full text-xl font-semibold"
              >
                예약 취소
              </button>

              <button
                onClick={reset}
                className="w-full mt-4 py-4 border rounded-full text-lg"
              >
                다른 예약 조회
              </button>
            </div>
          )}

          {/* 환불 계좌 입력 */}
          {showCancelForm && (
            <div className="mt-14 space-y-8">
              <p className="text-xl font-semibold text-center">
                환불 계좌 정보 입력
              </p>

              <input
                placeholder="은행명"
                className="w-full border px-6 py-4 rounded-xl text-xl focus:outline-none focus:ring-2 focus:ring-black"
                value={refundBank}
                onChange={(e) => setRefundBank(e.target.value)}
              />

              <input
                placeholder="계좌번호"
                className="w-full border px-6 py-4 rounded-xl text-xl focus:outline-none focus:ring-2 focus:ring-black"
                value={refundAccount}
                onChange={(e) => setRefundAccount(e.target.value)}
              />

              <button
                onClick={saveRefundAccount}
                className="w-full py-5 bg-black text-white rounded-full text-xl font-semibold"
              >
                환불 계좌 저장
              </button>
            </div>
          )}
        </div>
      </main>

      {/* 커스텀 알림 모달 */}
            {alertMessage && (
              <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40">
                <div className="bg-white rounded-2xl px-10 py-8 w-[380px] text-center shadow-2xl">
                  <h3
                    className={`text-2xl font-bold mb-4 ${
                      alertType === "error" ? "text-red-600" : "text-black"
                    }`}
                  >
                    {alertType === "confirm"
                      ? "확인"
                      : alertType === "error"
                      ? "오류"
                      : "알림"}
                  </h3>

                  <p className="text-neutral-700 mb-6">{alertMessage}</p>

                  {alertType === "confirm" ? (
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setAlertMessage(null);
                          setOnConfirm(null);
                        }}
                        className="w-1/2 py-3 border rounded-lg"
                      >
                        취소
                      </button>
                      <button
                        onClick={() => {
                          onConfirm?.();
                          setAlertMessage(null);
                          setOnConfirm(null);
                        }}
                        className="w-1/2 py-3 bg-red-600 text-white rounded-lg"
                      >
                        확인
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAlertMessage(null)}
                      className="w-full py-3 bg-black text-white rounded-lg"
                    >
                      확인
                    </button>
                  )}
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
