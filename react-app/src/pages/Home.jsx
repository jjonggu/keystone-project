import React from "react";
import Banner from "../assets/images/banner.jpg";

const themes = [
  {
    title: "Have a Good Tape, Dave",
    genre: "일상 / 드라마",
    time: "65분",
    difficulty: 3,
    description:
      "누군가에게 어떤 기억은 지우고 싶은 순간이지만, 또 어떤 기억은 오늘을 버틸 수 있게 해주는 힘이 되기도 합니다. 데이브는 매일 수많은 사람들의 기억 속을 들여다봅니다.",
    imageUrl: "/images/theme1.jpg",
  },
  {
    title: "Cat",
    genre: "일상 / 코믹",
    time: "60분",
    difficulty: 2,
    description:
      "고양이와 연관된 코믹한 이야기와 기억의 흔적을 탐험합니다.",
    imageUrl: "/images/theme2.jpg",
  },
  {
    title: "시아와세 환전소",
    genre: "일상 / 힐링",
    time: "60분",
    difficulty: 4,
    description:
      "망가진 행운을 되찾고자 하는 사람들의 이야기. 전단지를 따라 낡은 간판 아래 숨겨진 공간으로 초대됩니다.",
    imageUrl: "/images/theme3.jpg",
  },
  {
    title: "Afterlife Airlines",
    genre: "미스터리",
    time: "60분",
    difficulty: 4,
    description:
      "눈을 떠보니 낯선 공항 한가운데… 당신은 어디로 향하게 될까요?",
    imageUrl: "/images/theme4.jpg",
  },
  {
    title: "5관 E열 4번",
    genre: "미스터리",
    time: "65분",
    difficulty: 5,
    description:
      "낡은 극장, 오래된 좌석, 그리고 반복되는 기억들… 모든 순간이 영화 같아요.",
    imageUrl: "/images/theme5.jpg",
  },
  {
    title: "Once Upon A Time",
    genre: "힐링",
    time: "60분",
    difficulty: 3,
    description:
      "완벽하지 않아도 괜찮은 요리처럼 우리만의 이야기를 만들어갑니다.",
    imageUrl: "/images/theme6.jpg",
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen text-gray-900 font-sans">
      {/* HERO 섹션 + 헤더 배경 */}
      <section className="relative w-full h-screen flex flex-col">
        {/* 배경 이미지 */}
        <img
          src={Banner}
          alt="Hero Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30"></div>

        {/* 상단 메뉴 */}
        <header className="relative z-10 flex justify-between items-center px-8 py-6 w-full">
          <h1 className="text-3xl font-extrabold tracking-widest text-white">
            KEYSTONE CAPE
          </h1>
          <nav className="space-x-8 text-lg">
            <a href="#themes" className="hover:text-blue-300 transition">
              테마
            </a>
            <a href="#about" className="hover:text-blue-300 transition">
              소개
            </a>
            <a href="#reservation" className="hover:text-blue-300 transition">
              예약
            </a>
          </nav>
        </header>

        {/* HERO 텍스트 */}
        <div className="relative z-10 flex flex-col items-center justify-center gap-6 px-6 max-w-2xl w-full flex-1">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-4 text-white">
            Movie Mood Experience
          </h2>
        </div>
      </section>

      {/* 테마 리스트 */}
      <section id="themes" className="px-8 py-16 relative z-10 bg-white">
        <h3 className="text-3xl font-bold mb-12 text-gray-900">무비무드 테마</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {themes.map((theme, idx) => (
            <div
              key={idx}
              className="relative group border border-gray-200 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition"
            >
              <div
                className="h-64 bg-cover bg-center"
                style={{ backgroundImage: `url("${theme.imageUrl}")` }}
              ></div>
              <div className="p-6 bg-white">
                <h4 className="text-2xl font-semibold mb-2 text-gray-900">
                  {theme.title}
                </h4>
                <p className="text-gray-600 mb-4 text-sm">
                  장르: {theme.genre} · 플레이: {theme.time}
                </p>
                <p className="text-gray-700 mb-4 text-sm">{theme.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`w-4 h-4 block ${
                          i < theme.difficulty ? "bg-blue-600" : "bg-gray-300"
                        } rounded-full`}
                      ></span>
                    ))}
                  </div>
                  <a
                    href="#reservation"
                    className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                  >
                    예약 바로가기 →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 소개 섹션 */}
      <section id="about" className="bg-gray-50 px-8 py-16 relative z-10 text-gray-800">
        <h3 className="text-3xl font-bold mb-6">Keystone Cape 무비무드 소개</h3>
        <p className="max-w-3xl mb-4">
          Keystone Cape의 무비무드는 단순한 방탈출 그 이상의 경험입니다.
          영화 속 한 장면처럼, 기억과 감정이 조각난 이야기를 탐험하는 공간이죠.
        </p>
        <p className="max-w-3xl">
          각 테마는 고유의 스토리를 가지고 있고, 당신은 그 안에서 주인공이 됩니다.
          우리 공간에서 당신만의 영화 같은 순간을 직접 써 내려가보세요.
        </p>
      </section>

      {/* 푸터 */}
      <footer className="text-center py-8 text-gray-500 text-sm border-t border-gray-200 relative z-10 bg-white">
        © 2025 Keystone Cape | All Rights Reserved
      </footer>
    </div>
  );
}
