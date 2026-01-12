// src/pages/NoticeFAQPage.tsx
import React, { useEffect, useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { FaRocket } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // navigate 추가
import Menubar from "../components/ui/Menubar";
import api from "../api";

import type { Notice } from "../types/notice";
import type { Faq } from "../types/faq";
import type { NoticeFaqResponse } from "../types/noticeFaqResponse";

const NoticeFAQPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"notice" | "faq">("notice");
  const [openItemId, setOpenItemId] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin] = useState(true); // 실제 환경에서는 auth 정보에서 가져오세요.

  const [notices, setNotices] = useState<Notice[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);

  const contentRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  /* ===== 데이터 로딩 ===== */
  useEffect(() => {
    api.get<NoticeFaqResponse>("/notice").then((res) => {
      setNotices(res.data.notices || []);
      setFaqs(res.data.faqs || []);
    });
  }, []);

  /* ===== 아코디언 애니메이션 제어 ===== */
  useEffect(() => {
    const items = activeTab === "notice" ? notices : faqs;
    items.forEach((item) => {
      const el = contentRefs.current.get(item.id);
      if (!el) return;
      el.style.height = openItemId === item.id ? `${el.scrollHeight}px` : "0px";
      el.style.opacity = openItemId === item.id ? "1" : "0";
    });
  }, [openItemId, activeTab, notices, faqs]);

  const toggleItem = (id: number) =>
    setOpenItemId((prev) => (prev === id ? null : id));

  /* ===== 리스트 렌더링 ===== */
  const renderList = () => {
    if (activeTab === "notice") {
      return notices.map((n) => {
        let typeLabel = "";
        let typeStyles = "";

        // ✅ 서버의 @JsonValue 규격인 소문자+언더바 대응 (new_theme)
        const rawType = n.noticeType?.toString().toLowerCase();

        switch (rawType) {
          case "event":
            typeLabel = "이벤트";
            typeStyles = "bg-blue-500 text-white border-blue-500 shadow-sm";
            break;

          case "maintenance":
            typeLabel = "점검";
            typeStyles = "bg-red-500 text-white border-red-500 shadow-sm";
            break;

          case "new_theme":
          case "newtheme":
            typeLabel = "신규 테마";
            typeStyles = "bg-yellow-400 text-black border-yellow-400 shadow-md";
            break;

          default:
            typeLabel = "NOTICE";
            typeStyles = "bg-gray-800 text-white border-gray-800 shadow-sm";
        }

        return (
          <div
            key={n.id}
            className={`bg-white rounded-[2rem] border-2 transition-all duration-300 ${
              openItemId === n.id ? "border-black shadow-xl scale-[1.01]" : "border-gray-100 shadow-sm hover:border-gray-200"
            } overflow-hidden`}
          >
            <button
              onClick={() => toggleItem(n.id)}
              className="w-full flex items-center justify-between px-8 py-8 text-left"
            >
              <div className="flex flex-col gap-2">
                <span className={`w-fit px-2.5 py-1 rounded text-[10px] font-black tracking-widest border ${typeStyles}`}>
                  {typeLabel}
                </span>
                <span className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter">
                  {n.title}
                </span>
                <span className="text-xs font-bold text-gray-300 font-mono tracking-tighter italic">{n.noticeDate}</span>
              </div>
              <div className={`transition-transform duration-500 ${openItemId === n.id ? "rotate-180" : ""}`}>
                <ChevronDown size={28} className={openItemId === n.id ? "text-black" : "text-gray-200"} />
              </div>
            </button>

            <div
              ref={(el) => el && contentRefs.current.set(n.id, el)}
              className="px-8 overflow-hidden transition-all duration-500 ease-in-out"
              style={{ height: 0, opacity: 0 }}
            >
              <div className="py-10 border-t border-gray-50 text-gray-600 text-lg md:text-xl leading-relaxed font-medium">
                {n.content}
              </div>
            </div>
          </div>
        );
      });
    }

    return faqs.map((f) => (
      <div
        key={f.id}
        className={`bg-white rounded-[2rem] border-2 transition-all duration-300 ${
          openItemId === f.id ? "border-black shadow-xl scale-[1.01]" : "border-gray-100 shadow-sm hover:border-gray-200"
        } overflow-hidden`}
      >
        <button
          onClick={() => toggleItem(f.id)}
          className="w-full flex items-center px-8 py-8 text-left"
        >
          <span className="text-black font-black text-3xl mr-6 italic opacity-10 uppercase tracking-tighter w-8">Q</span>
          <span className="text-xl md:text-2xl font-black text-gray-800 flex-1 tracking-tight">
            {f.question}
          </span>
          <div className={`transition-transform duration-500 ${openItemId === f.id ? "rotate-180" : ""}`}>
            <ChevronDown size={28} className={openItemId === f.id ? "text-black" : "text-gray-200"} />
          </div>
        </button>

        <div
          ref={(el) => el && contentRefs.current.set(f.id, el)}
          className="px-8 overflow-hidden transition-all duration-500 ease-in-out"
          style={{ height: 0, opacity: 0 }}
        >
          <div className="py-10 border-t border-gray-50 flex gap-4">
            <span className="text-black font-black text-2xl italic tracking-tighter">A.</span>
            <div className="text-gray-500 text-lg md:text-xl leading-relaxed font-medium whitespace-pre-line">
              {f.answer}
            </div>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
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

      <div className="mt-[18rem] text-center mb-16 px-4">
        {/* ✅ h1에서 italic 제거함 */}
        <h1 className="text-7xl md:text-5xl font-black tracking-tighter uppercase leading-none mb-4">
          Support<span className="text-gray-200">.</span>
        </h1>
        <p className="text-gray-400 font-bold tracking-[0.4em] text-[11px] uppercase">Notice & FAQ</p>
      </div>

      <div className="flex justify-center mb-16 px-4">
        <div className="flex bg-white border-2 border-gray-100 rounded-[2.5rem] p-2 w-full max-w-[600px] shadow-sm">
          {["notice", "faq"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab as "notice" | "faq");
                setOpenItemId(null);
              }}
              className={`flex-1 py-5 font-black text-sm tracking-[0.2em] uppercase rounded-[2rem] transition-all ${
                activeTab === tab
                  ? "bg-black text-white shadow-lg scale-[1.02]"
                  : "bg-transparent text-gray-300 hover:text-gray-500"
              }`}
            >
              {tab === "notice" ? "공지사항" : "FAQ"}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-5 px-6 mb-40">
        {renderList()}
      </div>

      <div className="fixed bottom-10 right-10 z-50">
        <button
          onClick={() => (window.location.href = "/reservation")}
          className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-black text-white font-black flex flex-col items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 group border-4 border-white"
        >
          <FaRocket className="text-3xl md:text-4xl mb-1 group-hover:animate-bounce" />
          <span className="text-[10px] md:text-xs tracking-widest uppercase italic">Reserve</span>
        </button>
      </div>

      {/* Footer */}
      <footer className="border-t border-neutral-200 py-14 text-center text-[11px] tracking-widest text-neutral-500">
        <p>KEYSTONE GANGNAM ESCAPE ROOM</p>
        <p className="mt-3">PRIVATE UI CLONE</p>
        <p className="mt-3">Tel: 010 1234 5678</p>
      </footer>
    </div>
  );
};

export default NoticeFAQPage;