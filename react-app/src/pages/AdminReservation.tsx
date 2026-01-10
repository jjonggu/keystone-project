// src/pages/AdminReservationPage.tsx
import React, { useEffect, useState, useRef } from "react";
import { FaRocket } from "react-icons/fa";
import Menubar from "../components/ui/Menubar";
import api from "../api";
import type { Reservation } from "../types/reservation";
import type { Notice, NoticeType, Faq } from "../types/notice";

export const STATUS_MAP: Record<string, string> = {
  WAIT: "대기",
  CONFIRMED: "결제 완료",
  CANCELLED: "취소",
};

export const STATUS_OPTIONS = [
  { value: "WAIT", label: "대기" },
  { value: "CONFIRMED", label: "결제 완료" },
  { value: "CANCELLED", label: "취소" },
];

const PAGE_SIZE = 10;

const calcEndTime = (start?: string) => {
  if (!start) return "";
  const [h, m] = start.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m + 80, 0, 0);
  return d.toTimeString().slice(0, 5);
};

const AdminReservationPage: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const [activeStatus, setActiveStatus] =
    useState<"WAIT" | "CONFIRMED" | "CANCELLED">("WAIT");
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const fetchedRef = useRef(false);

  // ===== 공지사항 / FAQ 상태 =====
  const [notices, setNotices] = useState<Notice[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);

  const [noticeModalOpen, setNoticeModalOpen] = useState(false);
  const [faqModalOpen, setFaqModalOpen] = useState(false);

  const [newNotice, setNewNotice] = useState<Partial<Notice>>({
    title: "",
    content: "",
    noticeType: "event",
    noticeDate: new Date().toISOString().slice(0, 10),
  });

  const [newFaq, setNewFaq] = useState<Partial<Faq>>({
    question: "",
    answer: "",
  });

  // ===== 예약 조회 =====
  const fetchReservations = async (
    pageNo: number,
    status: "WAIT" | "CONFIRMED" | "CANCELLED"
  ) => {
    setLoading(true);
    try {
      let data: Reservation[] = [];
      let total = 1;

      if (status === "CANCELLED") {
        const cancelRes = await api.get<Reservation[]>(
          "/admin/reservations/cancelled"
        );
        const allCancelled = cancelRes.data || [];
        const start = pageNo * PAGE_SIZE;
        data = allCancelled.slice(start, start + PAGE_SIZE);
        total = Math.ceil(allCancelled.length / PAGE_SIZE);
      } else {
        const res = await api.get<{ content: Reservation[]; totalPages: number }>(
          `/admin/reservations?page=${pageNo}&size=${PAGE_SIZE}`
        );
        data = res.data.content || [];
        total = res.data.totalPages;
      }

      setReservations(data);
      setTotalPages(total);
      setPage(pageNo);
    } catch (err) {
      console.error("예약 조회 실패", err);
      setReservations([]);
      setTotalPages(0);
      setPage(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetchReservations(0, activeStatus);
  }, []);

  // ===== 예약 업데이트 =====
  const handleUpdateReservation = async () => {
    if (!selectedReservation) return;
    try {
      await api.put(
        `/admin/reservations/${selectedReservation.reservationId}`,
        {
          reservationStatus: selectedReservation.reservationStatus,
          headCount: selectedReservation.headCount,
          refundBank: selectedReservation.refundBank,
          refundAccount: selectedReservation.refundAccount,
        }
      );
      alert("예약 정보 업데이트 완료");
      setDetailModalOpen(false);
      setReservations((prev) =>
        prev
          .map((r) =>
            r.reservationId === selectedReservation.reservationId
              ? { ...r, ...selectedReservation }
              : r
          )
          .filter((r) => r.reservationStatus === activeStatus)
      );
    } catch (err) {
      console.error(err);
      alert("업데이트 실패");
    }
  };

  const filteredReservations = reservations.filter(
    (r) => r.reservationStatus === activeStatus
  );

  const isStatusEditable =
    selectedReservation?.reservationStatus !== "CANCELLED";

  // ===== 공지사항 저장 =====
  const handleSaveNotice = async () => {
    try {
      const payload = {
        title: newNotice.title,
        content: newNotice.content,
        noticeType: newNotice.noticeType,
        noticeDate: newNotice.noticeDate,
      };
      const res = await api.post<Notice>("/notice", payload, {
        headers: { "Content-Type": "application/json" },
      });
      setNotices((prev) => [res.data, ...prev]);
      setNoticeModalOpen(false);
      setNewNotice({
        title: "",
        content: "",
        noticeType: "event",
        noticeDate: new Date().toISOString().slice(0, 10),
      });
    } catch (err) {
      console.error("공지사항 저장 실패", err);
      alert("공지사항 저장 중 오류가 발생했습니다.");
    }
  };

  // ===== FAQ 저장 =====
  const handleSaveFaq = async () => {
    try {
      const payload = {
        question: newFaq.question,
        answer: newFaq.answer,
      };
      const res = await api.post<Faq>("/faq", payload, {
        headers: { "Content-Type": "application/json" },
      });
      setFaqs((prev) => [res.data, ...prev]);
      setFaqModalOpen(false);
      setNewFaq({ question: "", answer: "" });
    } catch (err) {
      console.error("FAQ 저장 실패", err);
      alert("FAQ 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 pb-24">
      <Menubar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <header className="fixed top-0 left-0 w-full z-50 flex justify-center pt-6 mt-9">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`transition-all duration-300 py-[13px] px-5 bg-white rounded-lg shadow-all-xl flex items-center space-x-3 max-w-[1400px] w-full ${
            menuOpen ? "ml-[350px]" : "ml-0"
          }`}
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

      <main
        className={`pt-[160px] max-w-7xl mx-auto transition-all duration-300 ${
          menuOpen ? "lg:translate-x-[170px]" : "lg:translate-x-0"
        }`}
      >
        <h1 className="text-3xl font-extrabold mb-4">예약 관리</h1>

        {/* ===== 상태 + 공지/FAQ 버튼 한 줄 ===== */}
        <div className="flex justify-between items-center mb-4">
          {/* 좌측: 상태 카테고리 */}
          <div className="flex gap-2">
            {STATUS_OPTIONS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => {
                  setActiveStatus(tab.value as any);
                  fetchReservations(0, tab.value as any);
                }}
                className={`px-5 py-2 rounded-full text-sm font-bold transition ${
                  activeStatus === tab.value
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 우측: 공지/FAQ 버튼 */}
          <div className="flex gap-2">
            <button
              onClick={() => setNoticeModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-semibold"
            >
              공지사항 작성
            </button>
            <button
              onClick={() => setFaqModalOpen(true)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-semibold"
            >
              FAQ 작성
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading...</div>
        ) : (
          <div className="overflow-x-auto border rounded-xl">
            <table className="min-w-full divide-y text-center">
              <thead className="bg-gray-50">
                <tr>
                  {[..."예약번호,예약일,테마,시간,예약자,연락처,인원,상태".split(",")].map(
                    (h) => (
                      <th key={h} className="px-4 py-3 font-bold">
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredReservations.map((r) => (
                  <tr
                    key={r.reservationId}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      setSelectedReservation(r);
                      setDetailModalOpen(true);
                    }}
                  >
                    <td className="px-4 py-2">{r.reservationId}</td>
                    <td className="px-4 py-2">{r.reservationDate}</td>
                    <td className="px-4 py-2">{r.themeName}</td>
                    <td className="px-4 py-2">
                      {r.startTime} ~ {calcEndTime(r.startTime)}
                    </td>
                    <td className="px-4 py-2">{r.customerName}</td>
                    <td className="px-4 py-2">{r.customerPhone}</td>
                    <td className="px-4 py-2">{r.headCount}</td>
                    <td className="px-4 py-2 font-bold">
                      {STATUS_MAP[r.reservationStatus]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* ===== 기존 예약 상세 모달 ===== */}
      {detailModalOpen && selectedReservation && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-[600px] rounded-xl p-6 shadow-xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold mb-4 text-center">예약 상세</h2>

            {selectedReservation.reservationStatus === "CANCELLED" ? (
              <div className="grid grid-cols-2 gap-4">
                {/* 왼쪽 */}
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="font-semibold text-sm">테마</label>
                    <input
                      className="w-full border rounded p-2 text-sm"
                      value={selectedReservation.themeName}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-sm">예약자</label>
                    <input
                      className="w-full border rounded p-2 text-sm"
                      value={selectedReservation.customerName}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-sm">시간</label>
                    <input
                      className="w-full border rounded p-2 text-sm"
                      value={`${selectedReservation.startTime} ~ ${calcEndTime(
                        selectedReservation.startTime
                      )}`}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-sm">은행</label>
                    <input
                      className="w-full border rounded p-2 text-sm"
                      value={selectedReservation.refundBank || ""}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-sm">취소시간</label>
                    <input
                      className="w-full border rounded p-2 text-sm"
                      value={
                        selectedReservation.cancelledAt
                          ? new Date(selectedReservation.cancelledAt).toLocaleString()
                          : "-"
                      }
                      readOnly
                    />
                  </div>
                </div>

                {/* 오른쪽 */}
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="font-semibold text-sm">예약일</label>
                    <input
                      className="w-full border rounded p-2 text-sm"
                      value={selectedReservation.reservationDate}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-sm">연락처</label>
                    <input
                      className="w-full border rounded p-2 text-sm"
                      value={selectedReservation.customerPhone}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-sm">인원</label>
                    <input
                      type="number"
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
                    <label className="font-semibold text-sm">계좌번호</label>
                    <input
                      className="w-full border rounded p-2 text-sm"
                      value={selectedReservation.refundAccount || ""}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-sm">예약 상태</label>
                    <select
                      className="w-full border rounded p-2 text-sm"
                      value={selectedReservation.reservationStatus}
                      onChange={(e) => {
                        if (isStatusEditable) {
                          setSelectedReservation({
                            ...selectedReservation,
                            reservationStatus: e.target.value as any,
                          });
                        }
                      }}
                      disabled={!isStatusEditable}
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {[
                  ["예약번호", selectedReservation.reservationId],
                  ["예약일", selectedReservation.reservationDate],
                  ["테마", selectedReservation.themeName],
                  [
                    "시간",
                    `${selectedReservation.startTime} ~ ${calcEndTime(
                      selectedReservation.startTime
                    )}`,
                  ],
                  ["예약자", selectedReservation.customerName],
                  ["연락처", selectedReservation.customerPhone],
                ].map(([label, value]) => (
                  <div key={label}>
                    <label className="font-semibold text-sm">{label}</label>
                    <input
                      className="w-full border rounded p-2 text-sm"
                      value={value}
                      readOnly
                    />
                  </div>
                ))}

                <div>
                  <label className="font-semibold text-sm">인원</label>
                  <input
                    type="number"
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
                    onChange={(e) => {
                      if (isStatusEditable) {
                        setSelectedReservation({
                          ...selectedReservation,
                          reservationStatus: e.target.value as any,
                        });
                      }
                    }}
                    disabled={!isStatusEditable}
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setDetailModalOpen(false)}
                className="px-4 py-2 border rounded text-sm"
              >
                닫기
              </button>
              {isStatusEditable && (
                <button
                  onClick={handleUpdateReservation}
                  className="px-4 py-2 bg-black text-white rounded text-sm"
                >
                  업데이트
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== 공지사항 모달 ===== */}
      {noticeModalOpen && (
        <div className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-[500px] rounded-xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-4">공지사항 작성</h2>
            <div className="flex flex-col gap-3">
              <div>
                <label className="font-semibold text-sm">타입</label>
                <select
                  className="w-full border rounded p-2 text-sm"
                  value={newNotice.noticeType}
                  onChange={(e) =>
                    setNewNotice({
                      ...newNotice,
                      noticeType: e.target.value as NoticeType,
                    })
                  }
                >
                  <option value="event">Event</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="newTheme">New Theme</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-sm">제목</label>
                <input
                  type="text"
                  className="w-full border rounded p-2 text-sm"
                  value={newNotice.title}
                  onChange={(e) =>
                    setNewNotice({ ...newNotice, title: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="font-semibold text-sm">내용</label>
                <textarea
                  className="w-full border rounded p-2 text-sm"
                  rows={5}
                  value={newNotice.content}
                  onChange={(e) =>
                    setNewNotice({ ...newNotice, content: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="font-semibold text-sm">공지일</label>
                <input
                  type="date"
                  className="w-full border rounded p-2 text-sm"
                  value={newNotice.noticeDate}
                  onChange={(e) =>
                    setNewNotice({ ...newNotice, noticeDate: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setNoticeModalOpen(false)}
                className="px-4 py-2 border rounded text-sm"
              >
                닫기
              </button>
              <button
                onClick={handleSaveNotice}
                className="px-4 py-2 bg-blue-600 text-white rounded text-sm"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== FAQ 모달 ===== */}
      {faqModalOpen && (
        <div className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-[500px] rounded-xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-4">FAQ 작성</h2>
            <div className="flex flex-col gap-3">
              <div>
                <label className="font-semibold text-sm">질문</label>
                <input
                  type="text"
                  className="w-full border rounded p-2 text-sm"
                  value={newFaq.question}
                  onChange={(e) =>
                    setNewFaq({ ...newFaq, question: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="font-semibold text-sm">답변</label>
                <textarea
                  className="w-full border rounded p-2 text-sm"
                  rows={5}
                  value={newFaq.answer}
                  onChange={(e) =>
                    setNewFaq({ ...newFaq, answer: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setFaqModalOpen(false)}
                className="px-4 py-2 border rounded text-sm"
              >
                닫기
              </button>
              <button
                onClick={handleSaveFaq}
                className="px-4 py-2 bg-green-600 text-white rounded text-sm"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-6 right-6">
        <button className="w-24 h-24 rounded-full bg-black text-white font-bold flex flex-col items-center justify-center">
          <FaRocket className="text-3xl animate-bounce" />
          빠른 예약
        </button>
      </div>
    </div>
  );
};

export default AdminReservationPage;
