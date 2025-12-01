import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import ReservationPage from "../pages/Reservation";
import Payment from "../pages/Payment";
import Map from "../pages/Map";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reservation/:id" element={<ReservationPage />} />
        <Route path="/reservation/:id/payment" element={<Payment />} />
         // 지도
        <Route path="/map/" element={<Map />} />
      </Routes>
    </BrowserRouter>
  );
}
