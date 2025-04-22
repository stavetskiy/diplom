export const validateBookingData = ({
  date,
  time,
  duration,
  isGuest,
  userId,
  guestName,
  guestSurname,
  guestPhone,
}) => {
  const now = new Date();
  const selectedDateTime = new Date(`${date}T${time}`);

  if (selectedDateTime < now) {
    return "Дата та час бронювання не можуть бути в минулому.";
  }

  // Робочі години
  const dayOfWeek = selectedDateTime.getDay(); // 0 = Sunday, 6 = Saturday
  const hours = selectedDateTime.getHours();
  const minutes = selectedDateTime.getMinutes();
  const timeAsNumber = hours + minutes / 60;

  let openHour = 12;
  const closeHour = 23;
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    openHour = 11;
  }

  if (timeAsNumber < openHour || timeAsNumber >= closeHour) {
    return `Ресторан працює ${
      openHour === 11
        ? "з 11:00 до 23:00 (вихідні)"
        : "з 12:00 до 23:00 (будні)"
    }. Оберіть інший час.`;
  }

  if (isGuest && !userId) {
    const nameRegex = /^[a-zA-Zа-яА-ЯґҐіІїЇєЄ'-]{2,}$/u;
    const phoneRegex = /^\+?\d{10,13}$/;

    if (!guestName || !guestSurname || !guestPhone) {
      return "Будь ласка, заповніть усі поля.";
    }

    if (!nameRegex.test(guestName)) {
      return "Некоректне ім’я. Використовуйте лише літери.";
    }

    if (!nameRegex.test(guestSurname)) {
      return "Некоректне прізвище. Використовуйте лише літери.";
    }

    if (!phoneRegex.test(guestPhone)) {
      return "Некоректний номер телефону. Формат: +380XXXXXXXXX";
    }
  }

  return null; // помилок немає
};
