import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toadImg from "../assets/images/toad.jpg";
import pinokioImg from "../assets/images/pinokio.png";
import reverbImg from "../assets/images/reverb.png";
import goallthewayImg from "../assets/images/goalltheway.jpg";
import luciddreamImg from "../assets/images/luciddream.jpg";
import apartmentImg from "../assets/images/apartment.jpg";
import Menubar from "../components/ui/Menubar";

export default function ReservationPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const themesData = [
    { title: "두껍아 두껍아 헌집줄께 새집다오", imageUrl: toadImg, description: "두꺼비 테마 설명이 여기에 들어갑니다." },
    { title: "피노키오", imageUrl: pinokioImg, description: "피노키오 테마 설명이 여기에 들어갑니다." },
    { title: "잔향", imageUrl: reverbImg, description: "잔향 테마 설명이 여기에 들어갑니다." },
    { title: "끝까지 간다", imageUrl: goallthewayImg, description: "끝까지 간다 테마 설명이 여기에 들어갑니다." },
    { title: "루시드 드림", imageUrl: luciddreamImg, description: "루시드 드림 테마 설명이 여기에 들어갑니다." },
    { title: "201호 202호", imageUrl: apartmentImg, description: "201호 202호 테마 설명이 여기에 들어갑니다." },
  ];

  const themeData = themesData[Number(id) - 1];
  const [menuOpen, setMenuOpen] = useState(false);
  const [people, setPeople] = useState("1");
  const [name, setName] = useState("");
  const [contact1, setContact1] = useState("");
  const [contact2, setContact2] = useState("");
  const [contact3, setContact3] = useState("");

  const handleNext = () => {
    const fullContact = `${contact1}-${contact2}-${contact3}`;
    navigate(`/reservation/${id}/payment`, { state: { themeData, people, name, contact: fullContact } });
  };

  return (
    <div className="relative min-h-screen">
      <Menubar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <header className="fixed top-0 left-0 w-full z-50 flex justify-center pt-6 mt-9">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`transition-all duration-300 py-[13px] px-5 bg-white rounded-lg shadow-md flex items-center justify-start space-x-3 max-w-[1400px] w-full
            ${menuOpen ? 'ml-[350px]' : 'ml-0'}`}
        >
          <span className="font-[1000] text-gray-900 text-4xl mb-1">MENU</span>
        </button>
      </header>

      <div className={`min-h-screen flex justify-center transition-all duration-300 ${menuOpen ? 'ml-[350px]' : 'ml-0'}`}>
        <div className="bg-white w-full max-w-[1400px] rounded-xl shadow-2xl p-5 flex gap-6 mt-[150px]">
          {/* 왼쪽 박스: 테마 이미지 + 제목 + 설명 */}
          <div className="w-[35%] flex flex-col items-center">
            <div className="w-full h-[700px] overflow-hidden rounded-lg shadow">
              <img
                src={themeData.imageUrl}
                alt={themeData.title}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-2xl font-bold mt-6">{themeData.title}</h2>
            <p className="text-sm text-gray-600 mt-2 text-center">{themeData.description}</p>
          </div>

          {/* 오른쪽 박스 */}
          <div className="w-[50%] flex flex-col gap-6">

            {/* 1. 예약 인원 */}
            <div className="flex items-center gap-2">
              <span className="w-20 text-[20px] font-medium">인원</span>
              <select
                value={people}
                onChange={(e) => setPeople(e.target.value)}
                className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-gray-400 shadow-lg"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}명</option>
                ))}
              </select>
            </div>

            {/* 2. 예약자명 */}
            <div className="flex items-center gap-2">
              <span className="w-20 text-[20px] font-medium">예약자</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="홍길동"
                className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-gray-400 w-64 shadow-lg"
              />
            </div>

            {/* 3. 연락처 3분할 */}
            <div className="flex items-center gap-2">
              <span className="w-20 text-[20px] font-medium">연락처</span>
              <input
                type="text"
                value={contact1}
                onChange={(e) => setContact1(e.target.value)}
                placeholder="010"
                className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-gray-400 w-16 text-center shadow-lg"
              />
              <span className="text-lg font-bold">-</span>
              <input
                type="text"
                value={contact2}
                onChange={(e) => setContact2(e.target.value)}
                placeholder="0000"
                className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-gray-400 w-20 text-center shadow-lg"
              />
              <span className="text-lg font-bold">-</span>
              <input
                type="text"
                value={contact3}
                onChange={(e) => setContact3(e.target.value)}
                placeholder="0000"
                className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-gray-400 w-20 text-center shadow-lg"
              />
            </div>

            {/* 2. 예약자명 */}
            <div className="flex items-center gap-2">
               <span className="w-20 text-[20px] font-medium">할인</span>
                <p className="text-[20px] font-normal">없음</p>
           </div>

            {/* 예약하기 + 돌아가기 버튼 */}
            <div className="mt-4 flex flex-col gap-3">
              <button
                onClick={handleNext}
                className="w-full py-3 bg-black text-white rounded-lg text-2xl font-black hover:bg-gray-800 transition"
              >
                예약하기
              </button>
              <button
                onClick={() => window.history.back()}
                className="w-full py-3 border rounded-lg hover:bg-gray-50 text-2xl font-bold"
              >
                ← 돌아가기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
