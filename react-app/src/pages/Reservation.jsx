import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Calendar } from "../components/ui/Calendar";
import toadImg from "../assets/images/toad.jpg";
import pinokioImg from "../assets/images/pinokio.png";
import reverbImg from "../assets/images/reverb.png";
import goallthewayImg from "../assets/images/goalltheway.jpg";
import luciddreamImg from "../assets/images/luciddream.jpg";
import apartmentImg from "../assets/images/apartment.jpg";

export default function ReservationPage() {
  const { id } = useParams();

  const themesData = [
    { title: "두껍아 두껍아 헌집줄께 새집다오", imageUrl: toadImg, description: "두꺼비 테마 설명이 여기에 들어갑니다." },
    { title: "피노키오", imageUrl: pinokioImg, description: "피노키오 테마 설명이 여기에 들어갑니다." },
    { title: "잔향", imageUrl: reverbImg, description: "잔향 테마 설명이 여기에 들어갑니다." },
    { title: "끝까지 간다", imageUrl: goallthewayImg, description: "끝까지 간다 테마 설명이 여기에 들어갑니다." },
    { title: "루시드 드림", imageUrl: luciddreamImg, description: "루시드 드림 테마 설명이 여기에 들어갑니다." },
    { title: "201호 202호", imageUrl: apartmentImg, description: "201호 202호 테마 설명이 여기에 들어갑니다." },
  ];

  const themeData = themesData[Number(id) - 1];
  const [selectedTime, setSelectedTime] = useState(null);

  return (
    <div className="min-h-screen bg-gray-200 flex justify-center py-10 px-4">
      <div className="bg-white w-full max-w-[1300px] rounded-xl shadow-lg p-10 flex gap-6">

        {/* ========== 왼쪽 박스: 테마 이미지 + 제목 + 설명 ========== */}
        <div className="w-[70%] flex flex-col items-center">
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

        {/* ========== 오른쪽 박스: 캘린더 + 시간 선택 ========== */}
        <div className="w-[100%] flex flex-col gap-6">

        {/* 날짜 선택 박스 */}
        <div className="bg-gray-50 rounded-lg p-6 shadow w-[420px] h-[485px]">
          <h3 className="text-lg font-bold mb-4">날짜 선택</h3>
          <div className="w-full max-w-[450px]">
            <Calendar className="w-full h-[380px]" />
          </div>
        </div>

          {/* 시간 선택 박스 */}
          <div className="bg-gray-50 rounded-lg p-6 shadow flex flex-col gap-4">
            <h3 className="text-lg font-bold">시간 선택</h3>
            <div className="grid grid-cols-4 gap-3 text-center">
              {["10:00", "12:00", "14:00", "16:00", "18:00", "20:00"].map(
                (time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`py-2 border rounded
                      ${
                        selectedTime === time
                          ? "bg-black text-white"
                          : "bg-white hover:bg-gray-100"
                      }`}
                  >
                    {time}
                  </button>
                )
              )}
            </div>

            {/* 예약 버튼 */}
            <div className="mt-4 flex flex-col gap-3">
              <button className="w-full py-3 bg-black text-white rounded-lg text-lg hover:bg-gray-800 transition">
                예약하기
              </button>
              <button
                onClick={() => window.history.back()}
                className="w-full py-3 border rounded-lg hover:bg-gray-50"
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
