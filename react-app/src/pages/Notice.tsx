import React, { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { FaRocket } from "react-icons/fa";
import Menubar from "../components/ui/Menubar";
import api from "../api";

/* ===== 타입 import (이미 만든 거 그대로 사용) ===== */
import type { Notice } from "../types/notice";
import type { Faq } from "../types/faq";
import type { NoticeFaqResponse } from "../types/noticeFaqResponse";

const NoticeFAQPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"notice" | "faq">("notice");
  const [openItemId, setOpenItemId] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const [notices, setNotices] = useState<Notice[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);

  const contentRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  /* ===== 데이터 로딩 ===== */
  useEffect(() => {
    api.get<NoticeFaqResponse>("/notice").then(res => {
      setNotices(res.data.notices);
      setFaqs(res.data.faqs);
    });
  }, []);

  /* ===== 아코디언 높이 제어 ===== */
  useEffect(() => {
    const items = activeTab === "notice" ? notices : faqs;
    items.forEach(item => {
      const el = contentRefs.current.get(item.id);
      if (!el) return;
      el.style.height =
        openItemId === item.id ? `${el.scrollHeight}px` : "0px";
    });
  }, [openItemId, activeTab, notices, faqs]);

  const toggleItem = (id: number) =>
    setOpenItemId(prev => (prev === id ? null : id));

  /* ===== 리스트 렌더링 ===== */
  const renderList = () => {
    if (activeTab === "notice") {
      return notices.map(n => {
        let typeLabel = "";
        let typeColor = "";

        switch (n.noticeType) {
          case "event":
            typeLabel = "이벤트";
            typeColor = "text-blue-500";
            break;
          case "maintenance":
            typeLabel = "점검";
            typeColor = "text-red-600";
            break;
          case "newTheme":
            typeLabel = "신규 테마";
            typeColor = "text-yellow-500";
            break;
        }

        return (
          <div
            key={n.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
          >
            <button
              onClick={() => toggleItem(n.id)}
              className="w-full flex items-center justify-between px-8 py-6 text-left hover:bg-gray-50"
            >
              <div className="flex flex-col">
                <span className="text-xl font-semibold text-gray-800">
                  {n.title}
                </span>
                <span className={`mt-1 text-sm font-medium ${typeColor}`}>
                  {typeLabel}
                </span>
              </div>
              <ChevronDown
                size={28}
                className={`transition-transform duration-300 ${
                  openItemId === n.id ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              ref={el => el && contentRefs.current.set(n.id, el)}
              className="px-8 overflow-hidden transition-all duration-500"
              style={{ height: 0 }}
            >
              <div className="py-6 text-gray-700 text-lg leading-relaxed">
                {n.content}
              </div>
              <div className="text-sm text-gray-400 mb-4">
                {n.noticeDate}
              </div>
            </div>
          </div>
        );
      });
    }

    return faqs.map(f => (
      <div
        key={f.id}
        className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
      >
        <button
          onClick={() => toggleItem(f.id)}
          className="w-full flex items-center px-8 py-6 text-left hover:bg-gray-50"
        >
          <span className="text-black font-bold text-2xl mr-4">Q</span>
          <span className="text-xl font-semibold text-gray-800 flex-1">
            {f.question}
          </span>
          <ChevronDown
            size={28}
            className={`transition-transform duration-300 ${
              openItemId === f.id ? "rotate-180" : ""
            }`}
          />
        </button>

        <div
          ref={el => el && contentRefs.current.set(f.id, el)}
          className="px-8 overflow-hidden transition-all duration-500"
          style={{ height: 0 }}
        >
          <div className="py-6 text-gray-700 whitespace-pre-line text-lg">
            <span className="text-indigo-600 font-bold mr-2">A</span>
            {f.answer}
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 lg:px-12">
      <Menubar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-center pt-6 mt-9">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`transition-all duration-300 py-[13px] px-5 bg-white rounded-lg shadow-all-xl flex items-center space-x-3 max-w-[1400px] w-full
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
          <span className="font-[1000] text-gray-900 text-4xl">MENU</span>
        </button>
      </header>

      {/* TAB */}
      <div className="mt-[12rem] flex justify-center mb-16">
        <div className="flex bg-gray-100 rounded-full p-1 shadow-inner w-[650px] text-xl">
          {["notice", "faq"].map(tab => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab as "notice" | "faq");
                setOpenItemId(null);
              }}
              className={`flex-1 py-4 font-semibold rounded-full transition-colors
                ${
                  activeTab === tab
                    ? "bg-white text-gray-900 shadow-md"
                    : "bg-gray-200 text-gray-500 hover:bg-gray-300"
                }`}
            >
              {tab === "notice" ? "공지사항" : "FAQ"}
            </button>
          ))}
        </div>
      </div>

      {/* LIST */}
      <div className="max-w-4xl mx-auto space-y-6">{renderList()}</div>

      {/* QUICK RESERVATION */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={() => (window.location.href = "/reservation")}
          className="w-36 h-36 rounded-full bg-black text-white font-bold text-lg shadow-2xl
                     flex flex-col items-center justify-center
                     transition-all duration-300 hover:scale-110 active:scale-95"
        >
          <FaRocket className="text-4xl mb-2 animate-bounce" />
          빠른 예약
        </button>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-neutral-200 py-6 text-center text-[11px] text-neutral-500 mt-[150px]">
        <p className="mt-8">KEYSTONE GANGNAM ESCAPE ROOM</p>
        <p className="mt-3">PRIVATE UI CLONE</p>
        <p className="mt-3">Tel: 010 1234 5678</p>
      </footer>
    </div>
  );
};

export default NoticeFAQPage;
