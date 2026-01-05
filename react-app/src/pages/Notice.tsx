// src/pages/NoticeFAQPage.tsx
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import Menubar from "../components/ui/Menubar";
import { FaRocket } from "react-icons/fa";

interface Notice {
  id: number;
  title: string;
  date: string;
  content: string;
  type: "event" | "maintenance" | "newTheme";
}

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

const notices: Notice[] = [
  { id: 1, title: "새해 맞이 이벤트 안내", date: "2026-01-01", content: "2026년 새해를 맞이하여 다양한 이벤트가 진행됩니다. 참여하셔서 특별한 혜택을 받아보세요!", type: "event" },
  { id: 2, title: "서버 점검 안내", date: "2026-01-03", content: "2026년 1월 5일 새벽 2시부터 5시까지 서버 점검이 진행됩니다. 점검 시간 동안 서비스 이용이 제한됩니다.", type: "maintenance" },
  { id: 3, title: "신규 테마 출시 안내", date: "2026-01-04", content: "새로운 테마 '얼음 왕국'이 출시되었습니다. 예약 페이지에서 새로운 테마를 만나보세요!", type: "newTheme" },
];

const faqs: FAQ[] = [
  { id: 1, question: "게임 이용 안내", answer: "입장 전 게임 설명 및 유의사항 안내를 위해 이용 시간보다 10분 일찍 도착 부탁드립니다.\n휴대폰, 인화성 물질 및 소지품은 라커룸에 보관하셔야 합니다.\n과도한 음주 후 플레이는 입장이 제한될 수 있습니다.\n힌트용 태블릿에 힌트 코드를 입력하여 힌트를 사용할 수 있습니다." },
  { id: 2, question: "예약 오픈 시간 안내", answer: "평일/주말 상관없이 해당 시간에 예약 오픈됩니다.\n매일 하루씩 예약 오픈하며 일주일 치 예약만 가능합니다." },
  { id: 3, question: "예약 안내", answer: "예약자 이름, 연락처 두 가지 정보만 입력하시면 예약이 가능합니다.\n예약 확정 및 예약번호 문자 발송을 위해 확인 가능한 연락처로 입력 부탁드립니다." },
];

const NoticeFAQPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"notice" | "faq">("notice");
  const [openItemId, setOpenItemId] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const contentRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const toggleItem = (id: number) => setOpenItemId(openItemId === id ? null : id);

  useEffect(() => {
    const items = activeTab === "notice" ? notices : faqs;
    items.forEach(item => {
      const el = contentRefs.current.get(item.id);
      if (el) el.style.height = openItemId === item.id ? el.scrollHeight + "px" : "0px";
    });
  }, [openItemId, activeTab]);

  const renderList = () => {
    if (activeTab === "notice") {
      return notices.map(n => {
        let typeLabel = "";
        let typeColor = "";
        switch (n.type) {
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
          <div key={n.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
            <button
              onClick={() => toggleItem(n.id)}
              className="w-full flex items-center justify-between px-8 py-6 text-left hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex flex-col">
                <span className="text-xl font-semibold text-gray-800">{n.title}</span>
                <span className={`mt-1 text-sm font-medium ${typeColor}`}>{typeLabel}</span>
              </div>
              <ChevronDown
                size={28}
                className={`transition-transform duration-300 ${openItemId === n.id ? "rotate-180" : ""}`}
              />
            </button>
            <div
              ref={el => { if (el) contentRefs.current.set(n.id, el); }}
              className="px-8 overflow-hidden transition-all duration-500 ease-in-out"
              style={{ height: 0 }}
            >
              <div className="py-6 text-gray-700 text-lg leading-relaxed">{n.content}</div>
              <div className="text-sm text-gray-400 mt-3 mb-3">{n.date}</div>
            </div>
          </div>
        );
      });
    } else {
      return faqs.map(f => (
        <div key={f.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
          <button
            onClick={() => toggleItem(f.id)}
            className="w-full flex items-center px-8 py-6 text-left hover:bg-gray-50 transition-colors duration-200"
          >
            <span className="flex-shrink-0 text-black font-bold text-2xl mr-4">Q</span>
            <span className="text-xl font-semibold text-gray-800 flex-1">{f.question}</span>
            <ChevronDown size={28} className={`transition-transform duration-300 ${openItemId === f.id ? "rotate-180" : ""}`} />
          </button>
          <div
            ref={el => { if (el) contentRefs.current.set(f.id, el); }}
            className="px-8 overflow-hidden transition-all duration-500 ease-in-out"
            style={{ height: 0 }}
          >
            <div className="py-6 text-gray-700 whitespace-pre-line leading-relaxed text-lg">
              <span className="text-indigo-600 font-bold mr-2">A</span>
              {f.answer}
            </div>
          </div>
        </div>
      ));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-12">
      <Menubar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* HEADER */}
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
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 5h16M4 12h16M4 19h16" />
          </svg>
          <span className="font-[1000] text-gray-900 text-4xl mb-1">MENU</span>
        </button>
      </header>

      {/* 탭 */}
      <div className="relative mx-auto mt-[12rem] w-full flex justify-center mb-[4rem]">
        <div className="flex justify-center bg-gray-100 rounded-full p-1 shadow-inner w-[650px] text-xl">
          {["notice", "faq"].map((tab) => {
            const isActive = activeTab === tab;
            const label = tab === "notice" ? "공지사항" : "FAQ";
            return (
              <button
                key={tab}
                className={`flex-1 text-center py-4 font-semibold rounded-full transition-colors duration-300
                  ${isActive
                    ? "bg-white text-gray-900 shadow-md"
                    : "bg-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-300"}`}
                onClick={() => {
                  setActiveTab(tab);
                  setOpenItemId(null);
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 리스트 */}
      <div className="max-w-4xl mx-auto space-y-6">
        {renderList()}
      </div>

      {/* 하단 고정 빠른 예약 버튼 */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          className="w-36 h-36 rounded-full bg-black text-white font-bold text-lg shadow-2xl
                     flex flex-col items-center justify-center
                     transition-all duration-300 ease-in-out
                     hover:scale-110 hover:brightness-110
                     active:scale-95"
          onClick={() => (window.location.href = "/reservation")}
        >
          <FaRocket className="text-4xl mb-2 animate-bounce" />
          빠른 예약
        </button>
      </div>

      {/* Footer */}
      <footer className="border-t border-neutral-200 py-6 text-center text-[11px] tracking-widest text-neutral-500 mt-[150px]">
        <p className="mt-8">KEYSTONE GANGNAM ESCAPE ROOM</p>
        <p className="mt-3">PRIVATE UI CLONE</p>
        <p className="mt-3">Tel: 010 1234 5678</p>
      </footer>
    </div>
  );
};

export default NoticeFAQPage;
