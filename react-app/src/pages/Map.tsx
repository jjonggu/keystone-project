import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Menubar from "../components/ui/Menubar";
import KakaoMap from "../components/map/KakaoMap";
import { FaRocket, FaMapMarkerAlt, FaClock, FaSubway, FaPhone, FaArrowRight } from "react-icons/fa";

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
  const [mapData, setMapData] = useState<MapLocation | null>(null);

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

  if (!mapData) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F8F8] font-sans overflow-x-hidden">
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

      <main className={`transition-all duration-500 pt-[220px] pb-40 px-6 ${menuOpen ? "ml-[350px]" : "ml-0"}`}>
        <div className="max-w-[1400px] mx-auto mt-[-40px]">

          {/* CONTENT GRID */}
          <div className="grid lg:grid-cols-12 gap-6 items-stretch">

            {/* LEFT: INFO CARD (4 columns) */}
            <div className="lg:col-span-4 bg-white rounded-[3rem] p-12 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] border border-white flex flex-col justify-between overflow-hidden relative">
              <div className="relative z-10">
                <div className="space-y-12">
                  {/* Item: Address */}
                  <section>
                    <div className="flex items-center gap-3 mb-4 text-zinc-300">
                      <FaMapMarkerAlt />
                      <span className="text-[10px] font-black tracking-widest uppercase">Location Address</span>
                    </div>
                    <p className="text-2xl font-black text-black leading-tight break-keep">
                      {mapData.address}
                    </p>
                    <p className="text-zinc-400 text-sm mt-3 font-medium">강남역과 신논현역 사이, 가장 핫한 골목에 위치합니다.</p>
                  </section>

                  {/* Item: Hours */}
                  <section>
                    <div className="flex items-center gap-3 mb-4 text-zinc-300">
                      <FaClock />
                      <span className="text-[10px] font-black tracking-widest uppercase">Business Hours</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center bg-zinc-50 p-4 rounded-2xl">
                        <span className="font-bold text-sm">평일</span>
                        <span className="font-black text-lg font-mono">08:00 - 24:00</span>
                      </div>
                      <div className="flex justify-between items-center bg-red-50 p-4 rounded-2xl text-red-600">
                        <span className="font-bold text-sm">주말/공휴일</span>
                        <span className="font-black text-lg font-mono">08:00 - 24:30</span>
                      </div>
                    </div>
                  </section>

                  {/* Item: Subway */}
                  <section>
                    <div className="flex items-center gap-3 mb-4 text-zinc-300">
                      <FaSubway />
                      <span className="text-[10px] font-black tracking-widest uppercase">By Subway</span>
                    </div>
                    <p className="text-gray-600 font-bold leading-relaxed">
                      9호선/신분당선 <span className="text-black border-b-2 border-yellow-400">신논현역 4번 출구</span> 도보 3분
                    </p>
                  </section>
                </div>
              </div>

              {/* Contact Footer */}
              <div className="mt-16 pt-8 border-t border-zinc-100 flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-zinc-300 uppercase tracking-widest">Reservation Call</span>
                  <span className="text-xl font-black text-black tracking-tighter font-mono">010.1234.5678</span>
                </div>
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white transition-transform hover:rotate-45 cursor-pointer">
                  <FaPhone />
                </div>
              </div>
            </div>

            {/* RIGHT: MAP SECTION (8 columns) */}
            <div className="lg:col-span-8 h-[600px] lg:h-auto min-h-[500px] rounded-[3rem] overflow-hidden shadow-2xl relative border-[12px] border-white ring-1 ring-zinc-100">
              <KakaoMap lat={mapData.latitude} lng={mapData.longitude} />

              {/* Map Floating Info */}
              <div className="absolute top-8 left-8 bg-black text-white p-6 rounded-3xl shadow-2xl max-w-[240px]">
                <p className="text-[9px] font-bold tracking-[0.3em] opacity-50 uppercase mb-2">Target Point</p>
                <p className="text-lg font-black leading-tight tracking-tight uppercase">Keystone Escape <br/>Gangnam Center</p>
                <div className="mt-4 flex items-center text-[10px] font-black text-yellow-400 group cursor-pointer">
                  길 찾기 바로가기 <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

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

      {/* Footer */}
      <footer className="border-t border-neutral-200 py-14 text-center text-[11px] tracking-widest text-neutral-500">
        <p>KEYSTONE GANGNAM ESCAPE ROOM</p>
        <p className="mt-3">PRIVATE UI CLONE</p>
        <p className="mt-3">Tel: 010 1234 5678</p>
      </footer>
    </div>
  );
}