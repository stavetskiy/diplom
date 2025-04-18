import { useState } from "react";
import { createReservation } from "../../firebase/reservationService";
import GuestSuccessModal from "../common/GuestSuccessModal";

const BookingConfirmation = ({
  table,
  date,
  time,
  duration,
  userId,
  isGuest,
  onConfirm,
  onCancel,
}) => {
  const [guestName, setGuestName] = useState("");
  const [guestSurname, setGuestSurname] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleConfirm = async () => {
    const now = new Date();
    const selectedDateTime = new Date(`${date}T${time}`);

    // Перевірка: не в минулому
    if (selectedDateTime < now) {
      setError("Дата та час бронювання не можуть бути в минулому.");
      return;
    }

    // Перевірка часу по днях тижня
    const dayOfWeek = selectedDateTime.getDay(); // 0 = Sunday, 6 = Saturday
    const hours = selectedDateTime.getHours();
    const minutes = selectedDateTime.getMinutes();
    const timeAsNumber = hours + minutes / 60;

    let openHour = 12;
    let closeHour = 23;
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      openHour = 11;
    }

    if (timeAsNumber < openHour || timeAsNumber >= closeHour) {
      setError(
        `Ресторан працює ${
          openHour === 11
            ? "з 11:00 до 23:00 (вихідні)"
            : "з 12:00 до 23:00 (будні)"
        }. Оберіть інший час.`
      );
      return;
    }

    // Перевірка гостьових полів
    const nameRegex = /^[a-zA-Zа-яА-ЯґҐіІїЇєЄ'-]{2,}$/u;
    const phoneRegex = /^\+?\d{10,13}$/;

    if (isGuest && !userId) {
      if (!guestName || !guestSurname || !guestPhone) {
        setError("Будь ласка, заповніть усі поля.");
        return;
      }

      if (!nameRegex.test(guestName)) {
        setError("Некоректне ім’я. Використовуйте лише літери.");
        return;
      }

      if (!nameRegex.test(guestSurname)) {
        setError("Некоректне прізвище. Використовуйте лише літери.");
        return;
      }

      if (!phoneRegex.test(guestPhone)) {
        setError("Некоректний номер телефону. Формат: +380XXXXXXXXX");
        return;
      }
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
      if (isGuest && !userId) {
        setShowModal(true);
      } else {
        onConfirm();
      }
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
      <h2 className="text-xl font-bold mb-4">Підтвердження бронювання</h2>

      <div className="space-y-2 text-sm text-gray-800 mb-4">
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
        <div className="space-y-3 mb-4">
          <h3 className="font-semibold">Контактна інформація</h3>
          <input
            type="text"
            placeholder="Ім’я"
            className="border p-2 rounded w-full"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Прізвище"
            className="border p-2 rounded w-full"
            value={guestSurname}
            onChange={(e) => setGuestSurname(e.target.value)}
          />
          <input
            type="tel"
            placeholder="Номер телефону"
            className="border p-2 rounded w-full"
            value={guestPhone}
            onChange={(e) => setGuestPhone(e.target.value)}
          />
        </div>
      )}

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <div className="flex justify-end gap-4">
        <button
          onClick={onCancel}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
        >
          Назад
        </button>
        <button
          onClick={handleConfirm}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Підтвердити
        </button>
      </div>

      {showModal && (
        <GuestSuccessModal
          guestInfo={{
            name: guestName,
            surname: guestSurname,
            phone: guestPhone,
          }}
          reservationInfo={{
            date,
            time,
            duration,
            tableId: table.id,
          }}
        />
      )}
    </div>
  );
};

export default BookingConfirmation;
