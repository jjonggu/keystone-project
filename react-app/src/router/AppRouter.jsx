import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import ReservationPage from "../pages/Reservation";
import Payment from "../pages/Payment";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reservation/:id" element={<ReservationPage />} />
        <Route path="/reservation/:id/payment" element={<Payment />} />
      </Routes>
    </BrowserRouter>
  );
}
