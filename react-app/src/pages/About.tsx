import React, { useEffect, useRef, useState } from "react";
import Menubar from "../components/ui/Menubar";
import { useNavigate } from "react-router-dom";
import Noticeimg from "../assets/images/noticeimg.png";
import Key1 from "../assets/images/key1.png";
import Key2 from "../assets/images/key2.png";



// 공통 애니메이션 컴포넌트
function FadeUp({ children, delay = 0 }) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setShow(true);
        });
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-[900ms] ease-out
        ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
      `}
    >
      {children}
    </div>
  );
}

export default function NoticeAboutPage() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-white">
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
            ></path>
          </svg>
          <span className="font-[1000] text-gray-900 text-4xl mb-1">MENU</span>
        </button>
      </header>

      {/* 전체 컨텐츠 */}
      <div
        className={`${
          menuOpen ? "ml-[350px]" : "ml-0"
        } transition-all duration-300`}
      >
        <div className="w-full h-[500px] relative mt-[150px] bg-black overflow-hidden">

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <FadeUp>
              <h1 className="text-white text-6xl font-extrabold tracking-tight drop-shadow-lg">
                KEYSTONECAPE
              </h1>
            </FadeUp>
            <FadeUp delay={200}>
              <p className="text-gray-200 text-xl mt-5">
                새로운 세계를 만드는 공간, 키스톤케이프
              </p>
            </FadeUp>
          </div>
        </div>

                 {/* 섹션 1 */}
                <section className="w-full bg-gray-100 py-24">
                  <div className="max-w-[1200px] mx-auto px-6 space-y-20">
                    <FadeUp>
                      <h2 className="text-5xl font-extrabold text-center mb-8">Welcome to Key's World</h2>
                    </FadeUp>
                    <FadeUp delay={150}>
                      <p className="text-lg text-gray-700 leading-relaxed text-center max-w-[900px] mx-auto">
                        예측할 수 없는 경험의 설렘, 일상을 벗어난 특별한 공간.
                        우리는 단순한 방탈출을 넘어 ‘몰입형 경험’을 설계합니다.
                        이곳에서는 당신이 이야기의 주인공이 됩니다.
                      </p>
                    </FadeUp>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                      <FadeUp>
                        <img
                          src={Key2}
                          className="rounded-2xl shadow-xl w-full"
                          alt="precaution"
                        />
                      </FadeUp>

                      <FadeUp delay={200}>
                        <div>
                          <h3 className="text-3xl font-bold mb-4">THE ‘KEY’ IS ‘FLOW’</h3>
                          <p className="text-gray-700 text-lg leading-relaxed">
                            진짜 재미는 단순한 탈출이 아닙니다.
                            스토리와 공간, 퍼즐이 자연스럽게 이어지는 ‘흐름’ 속에서 탄생합니다.
                            KeyStoneCape는 그 흐름을 치밀하게 설계합니다.
                          </p>
                        </div>
                      </FadeUp>
                    </div>

                    {/* 카드 섹션 */}
                    <FadeUp delay={300}>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                          {
                            icon: "🎭",
                            title: "Story-Driven Themes",
                            desc: "몰입감 넘치는 스토리와 세계관",
                          },
                          {
                            icon: "💡",
                            title: "Immersive Set & Lighting",
                            desc: "조명, 소품, 사운드까지 완성된 공간 연출",
                          },
                          {
                            icon: "🤝",
                            title: "Team & Emotion",
                            desc: "함께 겪는 감정이 경험을 완성합니다",
                          },
                        ].map((c, i) => (
                          <div key={i} className="bg-white p-6 rounded-xl shadow-lg text-center">
                            <div className="text-4xl mb-4">{c.icon}</div>
                            <h4 className="text-2xl font-bold mb-2">{c.title}</h4>
                            <p className="text-gray-600 leading-relaxed">{c.desc}</p>
                          </div>
                        ))}
                      </div>
                    </FadeUp>
                  </div>
                </section>
        {/* 방문 전 주의사항 */}
        <section className="w-full bg-white py-24 flex justify-center border-t border-gray-200">
          <div className="max-w-[1400px] w-full px-6">
            <FadeUp>
              <h2 className="text-4xl font-black mb-12 flex items-center gap-4">
                <svg
                  className="w-12 h-12 text-black"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                방문 전 꼭 확인하세요
              </h2>
            </FadeUp>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
              {/* 이미지 */}
              <FadeUp delay={100}>
                <img
                  src={Noticeimg}
                  className="rounded-2xl shadow-xl w-full"
                  alt="precaution"
                />
              </FadeUp>

              {/* 주의사항 리스트 */}
              <FadeUp delay={200}>
                <div className="grid grid-cols-1 gap-8">

                  {/* 1 */}
                  <div className="flex items-start gap-5">
                    <svg
                      className="w-10 h-10 text-black mt-1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <h3 className="text-2xl font-bold">예약 시간 준수</h3>
                      <p className="text-gray-700 mt-2 text-lg leading-relaxed">
                        체험의 품질을 위해 입장 시간 10분 전 도착을 권장드립니다.
                      </p>
                    </div>
                  </div>

                  {/* 2 */}
                  <div className="flex items-start gap-5">
                    <svg
                      className="w-10 h-10 text-black mt-1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 17h5l-1.405-4.215A2 2 0 0016.683 11H7.318a2 2 0 00-1.912 1.785L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                    <div>
                      <h3 className="text-2xl font-bold">소지품 보관 안내</h3>
                      <p className="text-gray-700 mt-2 text-lg">
                        스마트폰 및 촬영 기기는 안전한 보관함에 보관 후 입장합니다.
                      </p>
                    </div>
                  </div>

                  {/* 3 */}
                  <div className="flex items-start gap-5">
                    <svg
                      className="w-10 h-10 text-black mt-1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 16v-5a5 5 0 00-10 0v5m-2 0h14"
                      />
                    </svg>
                    <div>
                      <h3 className="text-2xl font-bold">비밀 유지</h3>
                      <p className="text-gray-700 mt-2 text-lg">
                        테마의 스토리, 장치, 퍼즐 요소는 외부 공개가 금지됩니다.
                      </p>
                    </div>
                  </div>

                </div>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* 환불 규정*/}

        <section className="w-full bg-white py-24 flex justify-center border-t border-gray-200">
          <div className="max-w-[1400px] w-full px-6">
            <FadeUp>
              <h2 className="text-4xl font-black mb-12 flex items-center gap-4">
                <svg
                  className="w-12 h-12 text-black"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                취소 및 환불 규정
              </h2>
            </FadeUp>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">

              {/* 취소 및 환불 규정 리스트 */}
              <FadeUp delay={200}>
                <div className="grid grid-cols-1 gap-8">

                  {/* 1 */}
                  <div className="flex items-start gap-5">
                    <span className="w-10 h-10 text-black mt-1 text-3xl">⚠️</span>
                    <div>
                      <h3 className="text-2xl font-bold">취소 – 24시간 전</h3>
                      <p className="text-gray-700 mt-2 text-lg leading-relaxed">
                        예약하신 테마 시작 시간 기준 <b>24시간 전까지</b> 취소 요청 시
                        전액 <b>100% 환불</b> 가능합니다.
                      </p>
                    </div>
                  </div>

                  {/* 2 */}
                  <div className="flex items-start gap-5">
                    <span className="w-10 h-10 text-black mt-1 text-3xl">💳</span>
                    <div>
                      <h3 className="text-2xl font-bold">취소 – 24시간 이내 / 당일</h3>
                      <p className="text-gray-700 mt-2 text-lg leading-relaxed">
                        테마 시작 <b>24시간 이내</b> 또는 <b>당일 취소</b> 요청 시에는
                        환불이 <b>불가</b>합니다.
                      </p>
                    </div>
                  </div>

                  {/* 3 */}
                  <div className="flex items-start gap-5">
                    <span className="w-10 h-10 text-black mt-1 text-3xl">🔁</span>
                    <div>
                      <h3 className="text-2xl font-bold">예약금 & 환불 절차</h3>
                      <p className="text-gray-700 mt-2 text-lg leading-relaxed">
                        예약금을 결제하신 경우, 취소 시 환불 계좌 정보 또는 카드 결제 정보를
                        확인한 뒤 <b>영업일 기준 2~3일 내</b>에 환불이 처리됩니다.
                        (카드 결제는 별도 계좌 정보 필요 없음)
                      </p>
                    </div>
                  </div>

                </div>
              </FadeUp>


              {/* RIGHT: 이미지 */}
              <FadeUp delay={100}>
                <img
                  src={Key1}
                  className="rounded-2xl shadow-xl w-full"
                  alt="precaution"
                />
              </FadeUp>

            </div>
          </div>
        </section>

        {/* 섹션 3 */}
        <section className="py-20 flex justify-center">
          <div className="max-w-[1400px] w-full text-center px-6">
            <FadeUp>
              <h2 className="text-4xl font-black mb-6">
                당신의 경험을 디자인합니다
              </h2>
            </FadeUp>
            <FadeUp delay={150}>
              <p className="text-lg text-gray-700 leading-relaxed max-w-[900px] mx-auto">
                참여자들이 직접 느끼고, 행동하고, 생각하게 만드는 체험형 콘텐츠.
                우리는 이러한 경험이 일상을 특별하게 만든다고 믿습니다.
              </p>
            </FadeUp>
          </div>
        </section>

        {/* 돌아가기 */}
        <div className="flex justify-center pb-20">
          <FadeUp>
            <button
              onClick={() => navigate(-1)}
              className="px-10 py-4 rounded-xl bg-black text-white text-2xl font-bold hover:bg-gray-800 transition"
            >
              ← 돌아가기
            </button>
          </FadeUp>
        </div>
      </div>
    </div>
  );
}
