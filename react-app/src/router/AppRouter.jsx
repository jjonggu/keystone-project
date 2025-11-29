import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import ReservationPage from "../pages/Reservation";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reservation/:id" element={<ReservationPage />} />
      </Routes>
    </BrowserRouter>
  );
}
