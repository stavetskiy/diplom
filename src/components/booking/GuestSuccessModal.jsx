import React from "react";
import { useNavigate } from "react-router-dom";

const GuestSuccessModal = ({ guestInfo, reservationInfo }) => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-center text-green-600">
          Бронювання підтверджено!
        </h2>

        <div className="space-y-2 text-sm text-gray-800">
          <p>
            <strong>Ім’я:</strong> {guestInfo.name}
          </p>
          <p>
            <strong>Прізвище:</strong> {guestInfo.surname}
          </p>
          <p>
            <strong>Телефон:</strong> {guestInfo.phone}
          </p>
          <hr className="my-2" />
          <p>
            <strong>Дата:</strong> {reservationInfo.date}
          </p>
          <p>
            <strong>Час:</strong> {reservationInfo.time}
          </p>
          <p>
            <strong>Тривалість:</strong> {reservationInfo.duration} год
          </p>
          <p>
            <strong>Стіл №:</strong> {reservationInfo.tableId.replace("T", "")}
          </p>
        </div>
        <p className="text-green-600 text-sm text-center mt-4">
          🔔 Інформацію про бронювання відправлено на ваш номер телефону
        </p>
        <div className="mt-6 text-center">
          <button
            onClick={handleClose}
            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Ок
          </button>
        </div>
      </div>
    </div>
  );
};
export default GuestSuccessModal;
