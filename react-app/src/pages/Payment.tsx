// ReservationPage.tsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Menubar from "../components/ui/Menubar";
import {
  toadImg,
  pinokioImg,
  reverbImg,
  goallthewayImg,
  luciddreamImg,
  apartmentImg
} from "../assets/images/common";

interface ThemeData {
  title: string;
  imageUrl: string;
  description: string;
}

export default function ReservationPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const themesData: ThemeData[] = [
    { title: "두껍아 두껍아 헌집줄께 새집다오", imageUrl: toadImg, description: "두꺼비 테마 설명이 여기에 들어갑니다." },
    { title: "피노키오", imageUrl: pinokioImg, description: "피노키오 테마 설명이 여기에 들어갑니다." },
    { title: "잔향", imageUrl: reverbImg, description: "잔향 테마 설명이 여기에 들어갑니다." },
    { title: "끝까지 간다", imageUrl: goallthewayImg, description: "끝까지 간다 테마 설명이 여기에 들어갑니다." },
    { title: "루시드 드림", imageUrl: luciddreamImg, description: "루시드 드림 테마 설명이 여기에 들어갑니다." },
    { title: "201호 202호", imageUrl: apartmentImg, description: "201호 202호 테마 설명이 여기에 들어갑니다." },
  ];

  const themeData: ThemeData | undefined = themesData[Number(id) - 1];

  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [people, setPeople] = useState<string>("1");
  const [name, setName] = useState<string>("");
  const [contact1, setContact1] = useState<string>("");
  const [contact2, setContact2] = useState<string>("");
  const [contact3, setContact3] = useState<string>("");

  const handleNext = () => {
    if (!themeData) return;

    const fullContact = `${contact1}-${contact2}-${contact3}`;
    navigate(`/reservation/${id}/payment`, {
      state: {
        themeData,
        people,
        name,
        contact: fullContact
      }
    });
  };

  if (!themeData) {
    return <div>잘못된 접근입니다.</div>;
  }

  return (
    <div className="relative min-h-screen">
      <Menubar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

        <header className="fixed top-0 left-0 w-full z-50 flex justify-center pt-6 mt-9 ">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`transition-all duration-300 py-[13px] px-5 bg-white rounded-lg shadow-all-xl flex items-center justify-start space-x-3 max-w-[1400px] w-full
              ${menuOpen ? 'ml-[350px]' : 'ml-0'}`}
          >
            <svg
              className="w-12 h-12 text-gray-900"
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 5h16M4 12h16M4 19h16"></path>
            </svg>
            <span className="font-[1000] text-gray-900 text-4xl mb-1">MENU</span>
          </button>
        </header>

      <div className={`min-h-screen flex flex-col items-center transition-all duration-300 ${menuOpen ? 'ml-[350px]' : 'ml-0'}`}>
        <div className="bg-white w-full max-w-[1400px] rounded-xl shadow-all-xl p-5 flex gap-6 mt-[150px]">

          {/* 왼쪽 박스: 테마 이미지 */}
          <div className="w-[30%] flex flex-col items-center">
            <div className="w-full h-[600px] overflow-hidden rounded-lg shadow">
              <img
                src={themeData.imageUrl}
                alt={themeData.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* 오른쪽 박스: 예약 폼 */}
          <div className="w-[35%] flex flex-col gap-6">
            {/* 1. 예약 인원 */}
            <div className="flex items-center gap-12">
              <span className="w-20 text-[25px] font-medium">인원</span>
              <select
                value={people}
                onChange={(e) => setPeople(e.target.value)}
                className="border rounded p-2.5 w-[4rem] focus:outline-none focus:ring-2 focus:ring-gray-400 shadow-lg"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}명</option>
                ))}
              </select>
            </div>

            {/* 2. 예약자명 */}
            <div className="flex items-center gap-12">
              <span className="w-20 text-[25px] font-medium">예약자</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="홍길동"
                className="border rounded p-2.5 focus:outline-none focus:ring-2 focus:ring-gray-400 w-64 shadow-lg"
              />
            </div>

            {/* 3. 연락처 3분할 */}
            <div className="flex items-center gap-3">
              <span className="w-20 text-[25px] font-medium mr-9">연락처</span>
              <input
                type="text"
                value={contact1}
                onChange={(e) => setContact1(e.target.value)}
                placeholder="010"
                className="border rounded p-2.5 focus:outline-none focus:ring-2 focus:ring-gray-400 w-16 text-center shadow-lg"
              />
              <span className="text-lg font-bold">-</span>
              <input
                type="text"
                value={contact2}
                onChange={(e) => setContact2(e.target.value)}
                placeholder="0000"
                className="border rounded p-2.5 focus:outline-none focus:ring-2 focus:ring-gray-400 w-20 text-center shadow-lg"
              />
              <span className="text-lg font-bold">-</span>
              <input
                type="text"
                value={contact3}
                onChange={(e) => setContact3(e.target.value)}
                placeholder="0000"
                className="border rounded p-2.5 focus:outline-none focus:ring-2 focus:ring-gray-400 w-20 text-center shadow-lg"
              />
            </div>

            {/* 4. 할인 */}
            <div className="flex items-center gap-12">
              <span className="w-20 text-[25px] font-medium">할인</span>
              <p className="text-[25px] font-normal">없음</p>
            </div>

            {/* 5. 요금 */}
            <div className="flex items-center gap-12">
              <span className="w-20 text-[25px] font-medium">요금</span>
              <p className="text-[25px] font-normal">40000</p>
            </div>

            {/* 6. 예약금 */}
            <div className="flex items-center gap-12">
              <span className="w-20 text-[25px] font-medium">예약금</span>
              <p className="text-[25px] text-red-500 font-normal">40000</p>
            </div>

            {/* 7. 결제방법 */}
            <div className="flex items-center w-full">
              <span className="w-36 text-[25px] font-medium">결제방법</span>
                <select
                  className="border rounded p-1 -ml-5 text-[20px] w-40 text-center focus:outline-none focus:ring-2 focus:ring-gray-400 shadow-lg"
                  defaultValue="선택"
                >
                  <option value="card">무통장입금</option>
                  <option value="cash">카카오페이</option>
                </select>
            </div>

            {/* 예약하기 + 돌아가기 버튼 */}
            <div className="mt-4 flex flex-col gap-6">
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

        {/* 사진 아래 안내사항 박스 */}
        <div className="bg-gray-50 rounded-lg p-4 mt-6 shadow-all-xl border border-gray-200 w-full max-w-[1400px] mb-5">
          <h3 className="font-semibold text-[20px] mb-2">[ 안내사항 ]</h3>
            <ul className="list-none list-inside text-[16px] text-gray-700 mt-2 space-y-2 ">
              <li>- 예약 시간 10분 전까지 도착해주세요.</li>
              <li>- 마스크 착용을 권장합니다.</li>
              <li>- 모든 테마는 2인 기준으로 진행됩니다.</li>
            </ul>
        </div>
      </div>
    </div>
  );
}
