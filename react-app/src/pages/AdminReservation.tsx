import React, { useEffect, useState, useRef } from "react";
import { FaRocket, FaChevronLeft, FaChevronRight, FaRegStickyNote, FaQuestionCircle, FaInfoCircle, FaSearch } from "react-icons/fa";
import Menubar from "../components/ui/Menubar";
import api from "../api";
import type { Reservation } from "../types/reservation";
import type { Notice, NoticeType, Faq } from "../types/notice";

// 상수 정의
export const STATUS_MAP: Record<string, string> = {
  WAIT: "대기",
  CONFIRMED: "결제 완료",
  CANCELLED: "취소됨",
};

export const STATUS_OPTIONS = [
  { value: "WAIT", label: "대기" },
  { value: "CONFIRMED", label: "결제 완료" },
  { value: "CANCELLED", label: "취소" },
];

export const REFUND_STATUS_OPTIONS = [
  { value: "PENDING", label: "미환불 (대기)" },
  { value: "COMPLETED", label: "환불 완료" },
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
  const [activeStatus, setActiveStatus] = useState<"WAIT" | "CONFIRMED" | "CANCELLED">("WAIT");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [activeKeyword, setActiveKeyword] = useState("");
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [noticeModalOpen, setNoticeModalOpen] = useState(false);
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  // 1. 초기 상태값 수정 (new_theme)
  const [newNotice, setNewNotice] = useState<Partial<Notice>>({
    title: "",
    content: "",
    noticeType: "new_theme" as any,
    noticeDate: new Date().toISOString().slice(0, 10),
  });
  const [newFaq, setNewFaq] = useState<Partial<Faq>>({ question: "", answer: "" });

  const fetchedRef = useRef(false);

  const fetchReservations = async (pageNo: number, status: string, keyword: string = "") => {
    setLoading(true);
    try {
      const keywordParam = keyword ? `&keyword=${encodeURIComponent(keyword)}` : "";
      if (status === "CANCELLED") {
        const res = await api.get<Reservation[]>(`/admin/reservations/cancelled?${keywordParam.replace('&', '')}`);
        const allData = res.data || [];
        const start = pageNo * PAGE_SIZE;
        setReservations(allData.slice(start, start + PAGE_SIZE));
        setTotalPages(Math.ceil(allData.length / PAGE_SIZE));
      } else {
        const res = await api.get(`/admin/reservations?page=${pageNo}&size=${PAGE_SIZE}${keywordParam}`);
        setReservations(res.data.content || []);
        setTotalPages(res.data.totalPages);
      }
      setPage(pageNo);
    } catch (err) {
      console.error("데이터 로드 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetchReservations(0, activeStatus, "");
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveKeyword(searchKeyword);
    fetchReservations(0, activeStatus, searchKeyword);
  };

  const handleTabChange = (status: any) => {
    setActiveStatus(status);
    setSearchKeyword("");
    setActiveKeyword("");
    fetchReservations(0, status, "");
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchReservations(newPage, activeStatus, activeKeyword);
      window.scrollTo(0, 0);
    }
  };

  const handleUpdateReservation = async () => {
    if (!selectedReservation) return;
    try {
      await api.put(`/admin/reservations/${selectedReservation.reservationId}`, {
        reservationStatus: selectedReservation.reservationStatus,
        headCount: selectedReservation.headCount,
        refundBank: selectedReservation.refundBank,
        refundAccount: selectedReservation.refundAccount,
        refundStatus: selectedReservation.refundStatus,
      });
      alert("성공적으로 업데이트되었습니다.");
      setDetailModalOpen(false);
      fetchReservations(page, activeStatus, activeKeyword);
    } catch (err) {
      alert("업데이트에 실패했습니다.");
    }
  };

  // 2. 저장 후 초기화 로직 수정 (new_theme)
  const handleSaveNotice = async () => {
    try {
      await api.post("/notice", newNotice);
      alert("공지사항이 등록되었습니다.");
      setNoticeModalOpen(false);
      setNewNotice({
        title: "",
        content: "",
        noticeType: "new_theme" as any,
        noticeDate: new Date().toISOString().slice(0, 10)
      });
    } catch (err) { alert("등록 실패"); }
  };

  const handleSaveFaq = async () => {
    try {
      await api.post("/faq", newFaq);
      alert("FAQ가 등록되었습니다.");
      setFaqModalOpen(false);
      setNewFaq({ question: "", answer: "" });
    } catch (err) { alert("등록 실패"); }
  };

  const isCancelledStatus = selectedReservation?.reservationStatus === "CANCELLED";
  const displayData = activeStatus === "CANCELLED" ? reservations : reservations.filter(r => r.reservationStatus === activeStatus);

  return (
    <div className="min-h-screen bg-white px-4 pb-24 font-sans text-gray-900">
      <Menubar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* FIXED HEADER: 유지 */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-center pt-6 mt-9 px-6">
        <div className={`transition-all duration-500 py-[13px] px-6 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] flex items-center max-w-[1400px] w-full
          ${menuOpen ? "ml-[350px]" : "ml-0"}`}>
          <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center space-x-4 group">
            <div className="flex flex-col space-y-1.5">
              <span className={`h-1 w-8 bg-black transition-all ${menuOpen ? "rotate-45 translate-y-2.5" : ""}`}></span>
              <span className={`h-1 w-8 bg-black transition-all ${menuOpen ? "opacity-0" : ""}`}></span>
              <span className={`h-1 w-8 bg-black transition-all ${menuOpen ? "-rotate-45 -translate-y-2.5" : ""}`}></span>
            </div>
            <span className="font-black text-gray-900 text-4xl tracking-tighter">MENU</span>
          </button>
        </div>
      </header>

      <main className={`pt-[160px] max-w-[1375px] mx-auto transition-all mt-[50px] duration-300 ${menuOpen ? "lg:translate-x-[170px]" : "lg:translate-x-0"}`}>
        <h1 className="text-3xl font-black mb-6 tracking-tight border-l-8 border-black pl-4 uppercase">
          예약정보 조회
        </h1>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {STATUS_OPTIONS.map((tab) => (
              <button key={tab.value} onClick={() => handleTabChange(tab.value)} className={`px-6 py-2.5 rounded-full text-sm font-black transition ${activeStatus === tab.value ? "bg-black text-white shadow-md" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <form onSubmit={handleSearch} className="relative flex-grow md:flex-grow-0">
              <input
                type="text"
                placeholder="이름, 연락처 검색"
                className="w-full md:w-64 pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm font-bold focus:border-black outline-none transition"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
            </form>
            <button onClick={() => setNoticeModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg font-bold text-sm hover:bg-gray-800 transition"><FaRegStickyNote /> 공지</button>
            <button onClick={() => setFaqModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-black text-black rounded-lg font-bold text-sm hover:bg-gray-50 transition"><FaQuestionCircle /> FAQ</button>
          </div>
        </div>

        <div className="mt-8 bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                {["번호", "예약일", "테마", "이용시간", "예약자", "연락처", "인원", "상태"].map((h) => (
                  <th key={h} className="px-4 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-24 text-gray-200 font-black text-2xl animate-pulse italic">
                    LOADING...
                  </td>
                </tr>
              ) : displayData.length > 0 ? (
                displayData.map((r) => (
                  <tr
                    key={r.reservationId}
                    className="group hover:bg-gray-50/80 transition-colors cursor-pointer"
                    onClick={() => { setSelectedReservation(r); setDetailModalOpen(true); }}
                  >
                    <td className="px-4 py-6 text-[14px] text-gray-500 font-medium italic">#{r.reservationId}</td>
                    <td className="px-4 py-6 text-sm font-medium text-gray-500">{r.reservationDate}</td>
                    <td className="px-4 py-6 text-base font-black text-black tracking-tight group-hover:underline underline-offset-4 decoration-gray-200">{r.themeName}</td>
                    <td className="px-4 py-6 text-sm font-bold text-gray-500 font-mono tracking-tighter">
                      {r.startTime} <span className="mx-1 text-gray-500">|</span> {calcEndTime(r.startTime)}
                    </td>
                    <td className="px-4 py-6 text-base font-black text-gray-800">{r.customerName}</td>
                    <td className="px-4 py-6 text-sm font-medium text-gray-400 font-mono">{r.customerPhone}</td>
                    <td className="px-4 py-6 text-sm font-black text-gray-700">{r.headCount}명</td>
                    <td className="px-4 py-6">
                      <div className="flex flex-col items-center gap-1.5">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                          r.reservationStatus === 'CONFIRMED' ? 'bg-black text-white' :
                          r.reservationStatus === 'CANCELLED' ? 'bg-red-50 text-red-500 ring-1 ring-red-100' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {STATUS_MAP[r.reservationStatus]}
                        </span>
                        {activeStatus === "CANCELLED" && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${r.refundStatus === 'COMPLETED' ? 'text-blue-500 bg-blue-50' : 'text-red-400 bg-red-50 underline'}`}>
                            {r.refundStatus === 'COMPLETED' ? '환불완료' : '미환불'}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-32 text-gray-300 font-bold italic tracking-widest uppercase">No results found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 0 && (
          <div className="flex justify-center items-center gap-1 mt-10">
            <button disabled={page === 0} onClick={() => handlePageChange(page - 1)} className="p-3 border rounded-lg hover:bg-gray-100 disabled:opacity-20 transition"><FaChevronLeft size={12} /></button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} onClick={() => handlePageChange(i)} className={`w-10 h-10 rounded-lg text-sm font-black transition-all ${page === i ? "bg-black text-white shadow-lg" : "bg-white text-gray-400 hover:text-black hover:border-black border"}`}>{i + 1}</button>
            ))}
            <button disabled={page === totalPages - 1} onClick={() => handlePageChange(page + 1)} className="p-3 border rounded-lg hover:bg-gray-100 disabled:opacity-20 transition"><FaChevronRight size={12} /></button>
          </div>
        )}
      </main>
        {/* 1. 예약 상세 모달 */}
        {detailModalOpen && selectedReservation && (
          <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center px-4 font-bold">
            <div className="bg-white w-full max-w-[650px] rounded-2xl p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center mb-6 border-b-4 border-black pb-4 text-2xl font-black">
                예약 상세 내역
              </div>

              <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                {/* 상단 요약 정보 */}
                <div className="col-span-2 grid grid-cols-3 gap-4 bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <div><label className="text-[11px] font-black text-gray-400 block mb-1 uppercase tracking-widest">번호</label><span className="text-lg">#{selectedReservation.reservationId}</span></div>
                  <div className="col-span-2"><label className="text-[11px] font-black text-gray-400 block mb-1 uppercase tracking-widest">테마</label><span className="text-xl text-black font-black">{selectedReservation.themeName}</span></div>
                  <div><label className="text-[11px] font-black text-gray-400 block mb-1">날짜</label><span className="text-base">{selectedReservation.reservationDate}</span></div>
                  <div><label className="text-[11px] font-black text-gray-400 block mb-1">시간</label><span className="text-base">{selectedReservation.startTime} ~ {calcEndTime(selectedReservation.startTime)}</span></div>
                  <div><label className="text-[11px] font-black text-gray-400 block mb-1">인원</label><span className="text-base">{selectedReservation.headCount}명</span></div>
                </div>

                {/* 예약자 정보 */}
                <div className="col-span-1">
                  <h3 className="text-sm font-black mb-3 border-l-4 border-black pl-2 uppercase">예약자</h3>
                  <div className="space-y-2 p-4 border border-gray-100 rounded-xl font-bold">
                     <div><label className="text-[11px] font-black text-gray-400 block">이름</label><span className="text-base">{selectedReservation.customerName}</span></div>
                     <div><label className="text-[11px] font-black text-gray-400 block">연락처</label><span className="text-base font-mono">{selectedReservation.customerPhone}</span></div>
                  </div>
                </div>

                {/* 상태 변경 섹션 (수정된 부분) */}
                <div className="col-span-1">
                  <h3 className="text-sm font-black mb-3 border-l-4 border-black pl-2 uppercase">상태 변경</h3>
                  <div className="space-y-4 p-4 border border-gray-100 rounded-xl">
                    <div>
                      <label className="text-[11px] font-black text-black block mb-1">진행 상태</label>
                      {isCancelledStatus ? (
                        <select
                          className="w-full border-2 border-blue-600 rounded-lg p-2 text-sm font-black text-blue-600 outline-none bg-white"
                          value={selectedReservation.refundStatus || "PENDING"}
                          onChange={(e) => setSelectedReservation({...selectedReservation, refundStatus: e.target.value as any})}
                        >
                          {REFUND_STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                      ) : (
                        <select
                          className="w-full border border-gray-200 rounded-lg p-2 text-sm font-black outline-none bg-white"
                          value={selectedReservation.reservationStatus}
                          onChange={(e) => setSelectedReservation({...selectedReservation, reservationStatus: e.target.value as any})}
                        >
                          {STATUS_OPTIONS
                            .filter(opt => opt.value !== "CANCELLED")
                            .map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))
                          }
                        </select>
                      )}
                    </div>
                    <div>
                      <label className="text-[11px] font-black text-black block mb-1">인원 수정</label>
                      <input
                        disabled={isCancelledStatus}
                        type="number"
                        className="w-full border border-gray-200 rounded-lg p-2 text-sm font-bold disabled:bg-gray-50"
                        value={selectedReservation.headCount}
                        onChange={(e) => setSelectedReservation({...selectedReservation, headCount: Number(e.target.value)})}
                      />
                    </div>
                  </div>
                </div>

                {/* 환불 정보 섹션 */}
                {isCancelledStatus && (
                  <div className="col-span-2 mt-2 bg-red-50 p-6 rounded-xl border border-red-100">
                    <h3 className="text-sm font-black text-red-600 mb-4 flex items-center gap-2"><FaInfoCircle /> 환불 정보</h3>
                    <div className="grid grid-cols-3 gap-4 text-red-900 text-sm">
                      <div><label className="text-[11px] font-black text-red-400 block mb-1 uppercase tracking-widest">취소일시</label><span className="font-bold">{selectedReservation.cancelledAt ? new Date(selectedReservation.cancelledAt).toLocaleString() : '-'}</span></div>
                      <div><label className="text-[11px] font-black text-red-400 block mb-1 uppercase tracking-widest">은행</label><span className="font-bold">{selectedReservation.refundBank || '정보 없음'}</span></div>
                      <div><label className="text-[11px] font-black text-red-400 block mb-1 uppercase tracking-widest">계좌</label><span className="font-bold font-mono underline">{selectedReservation.refundAccount || '정보 없음'}</span></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-10 pt-6 border-t border-gray-100 font-black">
                <button onClick={() => setDetailModalOpen(false)} className="px-6 py-2.5 rounded-lg text-gray-400 hover:text-black transition text-sm">닫기</button>
                <button onClick={handleUpdateReservation} className="px-8 py-2.5 bg-black text-white rounded-lg shadow-lg hover:scale-105 transition text-sm">저장</button>
              </div>
            </div>
          </div>
        )}

      {/* 2. 공지사항 모달 */}
      {noticeModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center px-4 font-bold">
          <div className="bg-white w-full max-w-[500px] rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-black mb-6 border-b-4 border-black pb-3 tracking-tighter uppercase italic">Notice.</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-black text-black block mb-1 uppercase tracking-widest">분류</label>
                  <select
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-black outline-none bg-white font-black"
                    value={newNotice.noticeType}
                    onChange={(e) => setNewNotice({ ...newNotice, noticeType: e.target.value as any })}
                  >
                    <option value="event">이벤트</option>
                    <option value="maintenance">공사/점검</option>
                    <option value="new_theme">신규 테마</option> {/* 3. value를 new_theme로 수정 */}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-black text-black block mb-1 uppercase tracking-widest">작성일</label>
                  <input type="date" className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-black outline-none font-bold" value={newNotice.noticeDate} onChange={(e) => setNewNotice({ ...newNotice, noticeDate: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-black text-black block mb-1 uppercase tracking-widest">제목</label>
                <input type="text" className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-black outline-none font-bold" placeholder="제목을 입력하세요." value={newNotice.title} onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })} />
              </div>
              <div>
                <label className="text-[11px] font-black text-black block mb-1 uppercase tracking-widest">내용</label>
                <textarea className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-black outline-none h-40 resize-none font-bold" placeholder="내용을 입력하세요." value={newNotice.content} onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })} />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8 font-black">
              <button onClick={() => setNoticeModalOpen(false)} className="px-6 py-2.5 rounded-lg text-gray-400 hover:text-black transition text-sm">취소</button>
              <button onClick={handleSaveNotice} className="px-8 py-2.5 bg-black text-white rounded-lg shadow-lg hover:scale-105 transition text-sm">등록</button>
            </div>
          </div>
        </div>
      )}

      {/* 3. FAQ 모달 */}
      {faqModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center px-4 font-bold">
          <div className="bg-white w-full max-w-[500px] rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-black mb-6 border-b-4 border-black pb-3 tracking-tighter uppercase italic">FAQ.</h2>
            <div className="space-y-6">
              <div>
                <label className="text-[11px] font-black text-black uppercase tracking-widest flex items-center gap-2 mb-2"><span className="w-6 h-6 bg-black text-white flex items-center justify-center rounded-full text-[10px]">Q</span> 질문</label>
                <input type="text" className="w-full border border-gray-200 rounded-xl p-4 text-base focus:border-black outline-none font-black" placeholder="질문을 입력하세요." value={newFaq.question} onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })} />
              </div>
              <div>
                <label className="text-[11px] font-black text-black uppercase tracking-widest flex items-center gap-2 mb-2"><span className="w-6 h-6 border-2 border-black text-black flex items-center justify-center rounded-full text-[10px]">A</span> 답변</label>
                <textarea className="w-full border border-gray-200 rounded-xl p-4 text-sm focus:border-black outline-none h-48 resize-none font-bold" placeholder="답변을 입력하세요." value={newFaq.answer} onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })} />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8 font-black">
              <button onClick={() => setFaqModalOpen(false)} className="px-6 py-2.5 rounded-lg text-gray-400 hover:text-black transition text-sm">취소</button>
              <button onClick={handleSaveFaq} className="px-8 py-2.5 bg-black text-white rounded-lg shadow-lg hover:scale-105 transition text-sm">저장</button>
            </div>
          </div>
        </div>
      )}

      {/* QUICK RESERVATION */}
      <div className="fixed bottom-10 right-10 z-50">
        <button
          onClick={() => (window.location.href = "/reservation")}
          className="w-32 h-32 rounded-full bg-black text-white shadow-[0_20px_50px_rgba(0,0,0,0.3)]
                     flex flex-col items-center justify-center border-4 border-white
                     transition-all duration-300 hover:scale-110 active:scale-95 group"
        >
          <FaRocket className="text-3xl mb-1 animate-bounce group-hover:text-yellow-400 transition-colors" />
          <span className="text-[10px] font-black tracking-widest uppercase italic">Reserve</span>
        </button>
      </div>
    </div>
  );
};

export default AdminReservationPage;