import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "../pages/Main";
import Reservation from "../pages/Reservation";
import ReservationFormPage from "../pages/ReservationFormPage";
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
        {/*예약자 정보 입력 */}
        <Route path="/reservation/form" element={<ReservationFormPage />}/>
        {/*설명*/}
        <Route path="/about" element={<About />} />
        {/* 지도 */}
        <Route path="/map" element={<Map />} />
      </Routes>
    </BrowserRouter>
  );
}
