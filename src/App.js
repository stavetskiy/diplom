import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage"; // Головна сторінка
import BookingPage from "./components/booking/BookingPage"; // Сторінка бронювання
import AuthPage from "./pages/AuthPage";
import { useEffect } from "react";
// import { seedTables } from "./utils/seedTables";
import BookingsPage from "./pages/profile/BookingsPage";
import PersonalInfoPage from "./pages/profile/PersonalInfoPage";
import EditProfilePage from "./pages/profile/EditProfilePage";

function App() {
  //  useEffect(() => {
  //    seedTables();
  //  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/booking" element={<BookingPage />} />

        {/* Профільні сторінки */}
        <Route path="/profile/bookings" element={<BookingsPage />} />
        <Route path="/profile/personal" element={<PersonalInfoPage />} />
        <Route path="/profile/edit" element={<EditProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
