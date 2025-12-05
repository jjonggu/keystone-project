import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from '../pages/Home';
import Reservation from '../pages/Reservation';
import Map from '../pages/Map';
import Payment from '../pages/Payment';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reservation/:id" element={<Reservation />} />
        <Route path="/reservation/:id/payment" element={<Payment />} />
         // 지도
        <Route path="/map" element={<Map />} />
      </Routes>
    </BrowserRouter>
  );
}
