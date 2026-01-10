import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Menubar from "../components/ui/Menubar";
import KakaoMap from "../components/map/KakaoMap";
import { FaRocket, FaMapMarkerAlt, FaClock, FaSubway, FaPhone } from "react-icons/fa";

interface MapLocation {
  mapId: number;
  mapName: string;
  address: string;
  latitude: number;
  longitude: number;
}

export default function MapPage() {
  const { id } = useParams();
  const [menuOpen, setMenuOpen] = useState(false);

  // DB에서 가져온 지도 데이터
  const [mapData, setMapData] = useState<MapLocation | null>(null);

  // 페이지 로드시 DB에서 좌표
  useEffect(() => {
    fetch("/api/map")
      .then((res) => res.json())
      .then((data: MapLocation[]) => {
        if (data.length > 0) {
          setMapData(data[0]);
        }
      })
      .catch((err) => console.error("지도 데이터 불러오기 오류:", err));
  }, []);

  if (!mapData) return <div className="text-center mt-44 text-2xl">지도 불러오는 중...</div>;

  return (
      <div className="relative min-h-screen bg-neutral-100 font-sans">
        <Menubar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

        {/* 헤더: 기존 유지 */}
        <header className="fixed top-0 left-0 w-full z-50 flex justify-center pt-6 mt-9">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`transition-all duration-300 py-[13px] px-5 bg-white rounded-lg shadow-all-xl flex items-center justify-start space-x-3 max-w-[1400px] w-full
              ${menuOpen ? "ml-[350px]" : "ml-0"}`}
          >
            <svg className="w-12 h-12 text-gray-900" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 5h16M4 12h16M4 19h16" />
            </svg>
            <span className="font-[1000] text-gray-900 text-4xl mb-1">MENU</span>
          </button>
        </header>

        <div className={`min-h-screen flex justify-center transition-all duration-300 ${menuOpen ? "ml-[350px]" : "ml-0"}`}>
          <div className="w-full max-w-[1400px] mt-60 px-6">

            {/* 콘텐츠 영역 레이아웃 */}
            <div className="flex flex-col lg:flex-row gap-8 w-full h-auto lg:h-[700px] mb-20">

              {/* 왼쪽 안내 섹션 */}
              <div className="w-full lg:w-[35%] bg-white rounded-[2.5rem] shadow-2xl p-10 md:p-14 flex flex-col justify-between border border-white">
                <div>
                  <div className="inline-block px-4 py-1.5 bg-zinc-900 text-white text-[10px] font-bold tracking-[0.3em] rounded-full mb-6">
                    LOCATION
                  </div>
                  <h2 className="text-5xl font-black text-gray-900 tracking-tighter mb-12">오시는 길</h2>

                  <div className="space-y-10">
                    {/* 주소 */}
                    <div className="flex gap-5">
                      <div className="w-12 h-12 bg-neutral-100 rounded-2xl flex items-center justify-center shrink-0">
                        <FaMapMarkerAlt className="text-xl text-black" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-1">Address</h3>
                        <p className="text-gray-900 text-xl font-bold leading-snug">{mapData.address}</p>
                        <p className="text-zinc-500 text-sm mt-1">신논현역 인근 지점입니다.</p>
                      </div>
                    </div>

                    {/* 영업시간 */}
                    <div className="flex gap-5">
                      <div className="w-12 h-12 bg-neutral-100 rounded-2xl flex items-center justify-center shrink-0">
                        <FaClock className="text-xl text-black" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-1">Business Hours</h3>
                        <div className="space-y-1 text-gray-900 font-bold text-lg">
                          <p className="flex justify-between w-48 italic"><span>평일</span> <span>08:00 - 24:00</span></p>
                          <p className="flex justify-between w-48 italic text-red-600"><span>주말/공휴</span> <span>08:00 - 24:30</span></p>
                        </div>
                      </div>
                    </div>

                    {/* 교통수단 */}
                    <div className="flex gap-5">
                      <div className="w-12 h-12 bg-neutral-100 rounded-2xl flex items-center justify-center shrink-0">
                        <FaSubway className="text-xl text-black" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-1">Subway</h3>
                        <p className="text-gray-700 text-md font-medium leading-relaxed">
                          신논현역 <span className="text-black font-bold">4, 5, 6번 출구</span> 근처에 위치해 있습니다. 신분당선과 9호선을 이용해 주세요.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 하단 전화문의 (선택사항) */}
                <div className="mt-12 pt-8 border-t border-neutral-100 flex items-center justify-between text-zinc-400">
                  <span className="text-xs font-bold tracking-widest uppercase font-mono">문의</span>
                  <span className="text-sm font-black text-black">010.1234.5678</span>
                </div>
              </div>

              {/* 오른쪽 지도 섹션 */}
              <div className="w-full lg:w-[65%] rounded-[2.5rem] shadow-2xl overflow-hidden bg-neutral-200 h-[500px] lg:h-full relative group border-8 border-white">
                <KakaoMap lat={mapData.latitude} lng={mapData.longitude} />
                {/* 지도 위 오버레이 (디자인 포인트) */}
                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur px-4 py-2 rounded-xl shadow-lg pointer-events-none">
                  <p className="text-[10px] font-black tracking-widest text-black">INTERACTIVE MAP</p>
                </div>
              </div>
            </div>
          </div>
        </div>

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
