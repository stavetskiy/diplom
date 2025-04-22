import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { auth } from "../../firebase";
import ModalWarning from "./modal/ModalWarning";

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
        className="px-6 py-3 bg-red-600 text-white rounded-3xl shadow-md hover:bg-red-700 transition text-base font-semibold"
      >
        Резервування
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
