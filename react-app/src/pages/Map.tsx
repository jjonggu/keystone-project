import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar } from "../components/ui/Calendar";
import {
  toadImg,
  pinokioImg,
  reverbImg,
  goallthewayImg,
  luciddreamImg,
  apartmentImg,
} from "../assets/images/common";
import Menubar from "../components/ui/Menubar";
import KakaoMap from "../components/map/KakaoMap";

// ⭐ DB에서 오는 Map 데이터 타입
interface MapLocation {
  mapId: number;
  mapName: string;
  address: string;
  latitude: number;
  longitude: number;
}

export default function ReservationPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const themesData = [
    { title: "두껍아 두껍아 헌집줄께 새집다오", imageUrl: toadImg },
    { title: "피노키오", imageUrl: pinokioImg },
    { title: "잔향", imageUrl: reverbImg },
    { title: "끝까지 간다", imageUrl: goallthewayImg },
    { title: "루시드 드림", imageUrl: luciddreamImg },
    { title: "201호 202호", imageUrl: apartmentImg },
  ];

  const themeData = themesData[Number(id) - 1];
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // ⭐ DB에서 가져온 지도 데이터
  const [mapData, setMapData] = useState<MapLocation | null>(null);

  // ⭐ 페이지 로드시 DB에서 좌표 가져오기
  useEffect(() => {
    fetch("/api/map")
      .then((res) => res.json())
      .then((data: MapLocation[]) => {
        if (data.length > 0) {
          setMapData(data[0]); // 강남지점 하나라고 가정
        }
      })
      .catch((err) => console.error("지도 데이터 불러오기 오류:", err));
  }, []);

  const nextBtn = () => {
    if (!selectedTime) {
      alert("시간을 선택해주세요.");
      return;
    }

    navigate(`/reservation/${id}/payment`, {
      state: {
        themeData,
        selectedTime,
      },
    });
  };

  if (!mapData) return <div className="text-center mt-44 text-2xl">지도 불러오는 중...</div>;

  return (
    <div className="relative min-h-screen">
      <Menubar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <header className="fixed top-0 left-0 w-full z-50 flex justify-center pt-6 mt-9 ">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`transition-all duration-300 py-[13px] px-5 bg-white rounded-lg shadow-all-xl flex items-center justify-start space-x-3 max-w-[1400px] w-full
            ${menuOpen ? "ml-[350px]" : "ml-0"}`}
        >
          <span className="text-4xl font-bold">☰</span>
          <span className="font-[1000] text-gray-900 text-4xl mb-1">MAP</span>
        </button>
      </header>

      <div
        className={`min-h-screen flex justify-center transition-all duration-300 ${
          menuOpen ? "ml-[350px]" : "ml-0"
        }`}
      >
        <div className="w-full max-w-[1400px] mt-44 px-6">
          <div className="flex gap-10 w-full h-[650px]">
            {/* 왼쪽 안내 */}
            <div className="w-[30%] bg-white rounded-2xl shadow-all-xl p-10 flex flex-col justify-start h-full">
              <h2 className="text-4xl font-extrabold mb-10 text-gray-900">오시는 길</h2>

              <div className="mb-10">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">📍</span>
                  <p className="text-gray-800 text-xl font-semibold">{mapData.address}</p>
                </div>
                <p className="text-gray-600 text-base ml-10 leading-relaxed">
                  신논현역 인근 지점입니다.
                </p>
              </div>

              <div className="mb-10">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">🚇</span>
                  <p className="text-gray-800 text-xl font-semibold">지하철 이용</p>
                </div>
                <p className="text-gray-600 text-base ml-10 leading-relaxed">
                  신논현역 4,5,6번 출구 근처에 위치해 있습니다.   지하철을 이용하실 분들은 신분당선과 9호선을 이용해주세요.
                </p>
              </div>
            </div>

            {/* 오른쪽 지도 */}
            <div className="w-[70%] rounded-2xl shadow-all-xl overflow-hidden bg-gray-200 h-full">
              <KakaoMap lat={mapData.latitude} lng={mapData.longitude} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
