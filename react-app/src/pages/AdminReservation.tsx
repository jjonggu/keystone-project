// src/pages/AdminReservationPage.tsx
import React, { useEffect, useState } from "react";
import { FaRocket } from "react-icons/fa";
import Menubar from "../components/ui/Menubar";
import api from "../api";
import type { Reservation } from "../types/reservation";

const AdminReservationPage: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // X-ADMIN-KEY 헤더 추가
    api.get<Reservation[]>("/admin/reservations", {
      headers: { "X-ADMIN-KEY": "keystone-admin-secret-123" },
    })
      .then((res) => {
        setReservations(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

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

      {/* CONTENT */}
      <main className="mt-[12rem] max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">예약 관리 페이지</h1>

        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <div className="overflow-x-auto shadow-md rounded-lg bg-white">
          <table className="min-w-full divide-y divide-gray-200 text-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-8 py-4 text-left font-bold text-gray-700">ID</th>
                <th className="px-8 py-4 text-left font-bold text-gray-700">예약일</th>
                <th className="px-8 py-4 text-left font-bold text-gray-700">테마</th>
                <th className="px-8 py-4 text-left font-bold text-gray-700">시간</th>
                <th className="px-8 py-4 text-left font-bold text-gray-700">예약자</th>
                <th className="px-8 py-4 text-left font-bold text-gray-700">연락처</th>
                <th className="px-8 py-4 text-left font-bold text-gray-700">인원</th>
                <th className="px-8 py-4 text-left font-bold text-gray-700">예약 상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reservations.map((r) => (
                <tr key={r.reservationId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-4 text-gray-800">{r.reservationId}</td>
                  <td className="px-8 py-4 text-gray-800">{r.reservationDate}</td>
                  <td className="px-8 py-4 text-gray-800">{r.themeName}</td>
                  <td className="px-8 py-4 text-gray-800">{r.startTime} ~ {r.endTime}</td>
                  <td className="px-8 py-4 text-gray-800">{r.customerName}</td>
                  <td className="px-8 py-4 text-gray-800">{r.customerPhone}</td>
                  <td className="px-8 py-4 text-gray-800">{r.headCount}</td>
                  <td className={`px-8 py-4 font-semibold ${
                    r.reservationStatus === "예약됨" ? "text-green-600" : "text-red-600"
                  }`}>
                    {r.reservationStatus}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </main>

      {/* QUICK RESERVATION BUTTON (optional) */}
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
    </div>
  );
};

export default AdminReservationPage;
