import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "../pages/Main";
import Reservation from "../pages/Reservation";
import Map from "../pages/Map";
import About from "../pages/About";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 테마 정보 페이지 */}
        <Route path="/" element={<Main />} />
        {/* 테마 예약 페이지 */}
        <Route path="/reservation" element={<Reservation />} />
        {/* 테마 예약 후 결제 */}
        <Route path="/about" element={<About />} />
        {/* 지도 */}
        <Route path="/map" element={<Map />} />
      </Routes>
    </BrowserRouter>
  );
}
