import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { auth } from "../firebase";
import ModalWarning from "./ModalWarning"; // не забудь створити цей файл

const BookingButton = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    if (auth.currentUser) {
      navigate("/booking");
    } else {
      setShowModal(true);
    }
  };

  const handleLogin = () => {
    navigate("/auth?redirect=booking");
  };

  const handleContinueAsGuest = () => {
    navigate("/booking?guest=true");
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
      >
        Забронювати столик
      </button>

      {showModal && (
        <ModalWarning
          onClose={() => setShowModal(false)}
          onLogin={handleLogin}
          onContinueAsGuest={handleContinueAsGuest}
        />
      )}
    </>
  );
};

export default BookingButton;
