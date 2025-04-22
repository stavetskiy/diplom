import { useState } from "react";
import { createReservation } from "../../firebase/reservationService";
import { validateBookingData } from "../../utils/validateBooking";

const BookingConfirmation = ({
  table,
  date,
  time,
  duration,
  userId,
  isGuest,
  onConfirm,
}) => {
  const [guestName, setGuestName] = useState("");
  const [guestSurname, setGuestSurname] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    const errorMessage = validateBookingData({
      date,
      time,
      duration,
      isGuest,
      userId,
      guestName,
      guestSurname,
      guestPhone,
    });

    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    const data = {
      userId: userId || null,
      tableId: table.id,
      date,
      time,
      duration,
    };

    if (isGuest && !userId) {
      data.guestInfo = {
        name: guestName,
        surname: guestSurname,
        phone: guestPhone,
      };
    }

    try {
      await createReservation(data);
      onConfirm(data);
    } catch (err) {
      console.error("Помилка під час бронювання:", err);
      setError("Щось пішло не так. Спробуйте ще раз.");
    }
  };

  const getLabelByType = (type) => {
    if (type === 2) return "Столик на двох";
    if (type === 4) return "Столик на чотирьох";
    if (type === 6) return "Столик на шістьох";
    return "Невідомий тип";
  };

  return (
    <div className="bg-white border rounded-lg shadow p-6 w-full">
      <div className="space-y-2 text-lg text-gray-800 mb-2">
        <p>
          <strong>Тип столика:</strong> {getLabelByType(table.type)}
        </p>
        <p>
          <strong>Номер столика:</strong> {table.id.replace("T", "")}
        </p>
        <p>
          <strong>Дата:</strong> {date}
        </p>
        <p>
          <strong>Час:</strong> {time}
        </p>
        <p>
          <strong>Тривалість:</strong> {duration} год
        </p>
      </div>

      {isGuest && !userId && (
        <div className="space-y-2 mb-2">
          <h3 className="font-semibold text-base">Контактна інформація</h3>
          <input
            type="text"
            placeholder="Ім’я"
            className="border p-2 rounded w-full text-base"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Прізвище"
            className="border p-2 rounded w-full text-base"
            value={guestSurname}
            onChange={(e) => setGuestSurname(e.target.value)}
          />
          <input
            type="tel"
            placeholder="Номер телефону"
            className="border p-2 rounded w-full text-base"
            value={guestPhone}
            onChange={(e) => setGuestPhone(e.target.value)}
          />
        </div>
      )}

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <div className="flex justify-start mt-4">
        <button
          onClick={handleConfirm}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Підтвердити
        </button>
      </div>
    </div>
  );
};

export default BookingConfirmation;
