import { validateBooking } from "../utils/validateBooking";

describe("validateBooking", () => {
  const baseData = {
    duration: 2,
    isGuest: false,
    userId: "testUserId",
    guestName: "",
    guestSurname: "",
    guestPhone: "",
  };

  test("повертає помилку, якщо дата в минулому", () => {
    const result = validateBooking({
      ...baseData,
      date: "2000-01-01",
      time: "12:00",
    });
    expect(result).toMatch(/в минулому/);
  });

  test("повертає помилку, якщо час до відкриття (будній день)", () => {
    const futureWeekday = getFutureDateByWeekday(1); // Понеділок
    const result = validateBooking({
      ...baseData,
      date: futureWeekday,
      time: "10:00",
    });
    expect(result).toMatch(/Ресторан працює з 12:00/);
  });

  test("повертає помилку, якщо час після закриття", () => {
    const futureDate = getFutureDateByWeekday(2); // Вівторок
    const result = validateBooking({
      ...baseData,
      date: futureDate,
      time: "23:30",
    });
    expect(result).toMatch(/Оберіть інший час/);
  });

  test("не повертає помилку для коректного часу в будній день", () => {
    const futureDate = getFutureDateByWeekday(3); // Середа
    const result = validateBooking({
      ...baseData,
      date: futureDate,
      time: "13:00",
    });
    expect(result).toBe(null);
  });

  test("не повертає помилку для коректного часу у вихідний", () => {
    const futureWeekend = getFutureDateByWeekday(6); // Субота
    const result = validateBooking({
      ...baseData,
      date: futureWeekend,
      time: "11:30",
    });
    expect(result).toBe(null);
  });

  describe("валидація даних гостя", () => {
    const guestBase = {
      ...baseData,
      isGuest: true,
      userId: null,
      date: getFutureDateByWeekday(4),
      time: "14:00",
    };

    test("повертає помилку, якщо поля порожні", () => {
      const result = validateBooking({
        ...guestBase,
        guestName: "",
        guestSurname: "",
        guestPhone: "",
      });
      expect(result).toMatch(/заповніть усі поля/);
    });

    test("повертає помилку, якщо ім’я некоректне", () => {
      const result = validateBooking({
        ...guestBase,
        guestName: "1",
        guestSurname: "Іванов",
        guestPhone: "+380991234567",
      });
      expect(result).toMatch(/ім’я/);
    });

    test("повертає помилку, якщо прізвище некоректне", () => {
      const result = validateBooking({
        ...guestBase,
        guestName: "Іван",
        guestSurname: "1",
        guestPhone: "+380991234567",
      });
      expect(result).toMatch(/прізвище/);
    });

    test("повертає помилку, якщо телефон некоректний", () => {
      const result = validateBooking({
        ...guestBase,
        guestName: "Іван",
        guestSurname: "Іванов",
        guestPhone: "12345",
      });
      expect(result).toMatch(/телефону/);
    });

    test("не повертає помилку, якщо усі поля коректні", () => {
      const result = validateBooking({
        ...guestBase,
        guestName: "Іван",
        guestSurname: "Іванов",
        guestPhone: "+380991234567",
      });
      expect(result).toBe(null);
    });
  });
});

// 🧩 Допоміжна функція: знайти майбутню дату за днем тижня
function getFutureDateByWeekday(desiredDay) {
  const today = new Date();
  const currentDay = today.getDay();
  const diff = (desiredDay + 7 - currentDay) % 7 || 7;
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + diff);
  return targetDate.toISOString().split("T")[0];
}
