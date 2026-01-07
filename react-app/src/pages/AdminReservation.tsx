// src/pages/AdminReservationPage.tsx
import React, { useEffect, useState } from "react";
import { FaRocket } from "react-icons/fa";
import Menubar from "../components/ui/Menubar";
import api from "../api";
import type { Reservation } from "../types/reservation";

// 상태 매핑
export const STATUS_MAP: Record<string, string> = {
  WAIT: "대기",
  CONFIRMED: "결제 완료",
};

export const STATUS_OPTIONS = [
  { value: "WAIT", label: "대기" },
  { value: "CONFIRMED", label: "결제 완료" },
];

const AdminReservationPage: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  // 공지/FAQ 모달
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"notice" | "faq">("notice");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [noticeType, setNoticeType] = useState<"event" | "maintenance" | "newTheme">("event");

  // 예약 상세 모달
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  useEffect(() => {
    api
      .get<Reservation[]>("/admin/reservations", {
        headers: { "X-ADMIN-KEY": "keystone-admin-secret-123" },
      })
      .then((res) => {
        setReservations(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // ✅ 예약 상태 및 인원 업데이트
  const handleUpdateReservation = async () => {
    if (!selectedReservation) return;
    try {
      await api.put(
        `/admin/reservations/${selectedReservation.reservationId}`,
        {
          reservationStatus: selectedReservation.reservationStatus,
          headCount: selectedReservation.headCount,
        },
        { headers: { "X-ADMIN-KEY": "keystone-admin-secret-123" } }
      );

      alert("예약 정보 업데이트 완료");
      setDetailModalOpen(false);

      // 테이블에도 바로 반영
      setReservations((prev) =>
        prev.map((r) =>
          r.reservationId === selectedReservation.reservationId
            ? {
                ...r,
                reservationStatus: selectedReservation.reservationStatus,
                headCount: selectedReservation.headCount,
              }
            : r
        )
      );
    } catch (err) {
      console.error(err);
      alert("업데이트 실패");
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 pb-24">
      <Menubar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />


      {/* ===== CONTENT ===== */}
      <main
        className={`
          pt-[160px] sm:pt-[140px] lg:pt-[160px]
          max-w-7xl
          mx-auto
          transition-all duration-300
          px-2 sm:px-4
          relative
          ${menuOpen ? "lg:translate-x-[170px]" : "lg:translate-x-0"}
        `}
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 mb-10 mt-20">
          <h1 className="text-3xl sm:text-4xl font-extrabold ">예약 관리</h1>
          <button
            onClick={() => setModalOpen(true)}
            className="px-6 py-3 bg-black text-white rounded-lg font-semibold hover:opacity-80 w-fit"
          >
            공지 / FAQ 등록
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading...</div>
        ) : (
          <div className="w-full overflow-x-auto border rounded-xl">
            <table className="min-w-full table-auto divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {["예약번호", "예약일", "테마", "시간", "예약자", "연락처", "인원", "상태"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-2 sm:px-4 py-2 sm:py-3 text-left text-sm sm:text-base lg:text-lg font-bold text-gray-700 whitespace-nowrap"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reservations.map((r) => (
                  <tr
                    key={r.reservationId}
                    className="hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => {
                      setSelectedReservation(r);
                      setDetailModalOpen(true);
                    }}
                  >
                    <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-sm sm:text-base">{r.reservationId}</td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-sm sm:text-base">{r.reservationDate}</td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">{r.themeName}</td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-sm sm:text-base">{r.startTime} ~ {r.endTime}</td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">{r.customerName}</td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-sm sm:text-base">{r.customerPhone}</td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-sm sm:text-base">{r.headCount}</td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 font-bold whitespace-nowrap text-sm sm:text-base">{STATUS_MAP[r.reservationStatus]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* ===== 예약 상세 모달 ===== */}
      {detailModalOpen && selectedReservation && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-[500px] rounded-xl p-4 sm:p-6 shadow-xl">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">예약 상세</h2>

            <div className="flex flex-col gap-3">
              <div>
                <label className="font-semibold text-sm">예약 번호</label>
                <input type="text" className="w-full border rounded p-2 text-sm" value={selectedReservation.reservationId} readOnly />
              </div>

              <div>
                <label className="font-semibold text-sm">예약일</label>
                <input type="text" className="w-full border rounded p-2 text-sm" value={selectedReservation.reservationDate} readOnly />
              </div>

              <div>
                <label className="font-semibold text-sm">테마</label>
                <input type="text" className="w-full border rounded p-2 text-sm" value={selectedReservation.themeName} readOnly />
              </div>

              <div>
                <label className="font-semibold text-sm">시간</label>
                <input type="text" className="w-full border rounded p-2 text-sm" value={`${selectedReservation.startTime} ~ ${selectedReservation.endTime}`} readOnly />
              </div>

              <div>
                <label className="font-semibold text-sm">예약자</label>
                <input type="text" className="w-full border rounded p-2 text-sm" value={selectedReservation.customerName} readOnly />
              </div>

              <div>
                <label className="font-semibold text-sm">연락처</label>
                <input type="text" className="w-full border rounded p-2 text-sm" value={selectedReservation.customerPhone} readOnly />
              </div>

              <div>
                <label className="font-semibold text-sm">인원</label>
                <input
                  type="string"
                  className="w-full border rounded p-2 text-sm"
                  value={selectedReservation.headCount}
                  onChange={(e) =>
                    setSelectedReservation({
                      ...selectedReservation,
                      headCount: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div>
                <label className="font-semibold text-sm">예약 상태</label>
                <select
                  className="w-full border rounded p-2 text-sm"
                  value={selectedReservation.reservationStatus}
                  onChange={(e) =>
                    setSelectedReservation({
                      ...selectedReservation,
                      reservationStatus: e.target.value,
                    })
                  }
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setDetailModalOpen(false)} className="px-4 py-2 border rounded text-sm">
                닫기
              </button>
              <button onClick={handleUpdateReservation} className="px-4 py-2 bg-black text-white rounded text-sm">
                업데이트
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUICK BUTTON */}
      <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50">
        <button className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-black text-white font-bold flex flex-col items-center justify-center hover:scale-105 transition">
          <FaRocket className="text-3xl sm:text-4xl mb-1 sm:mb-2 animate-bounce" />
          빠른 예약
        </button>
      </div>
    </div>
  );
};

export default AdminReservationPage;
