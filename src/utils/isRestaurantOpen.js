export const isRestaurantOpen = () => {
  const now = new Date();
  const day = now.getDay(); // 0 — неділя, 1 — понеділок, ..., 6 — субота
  const hours = now.getHours();
  const minutes = now.getMinutes();

  // Отримати час як десяткове число (наприклад, 14:30 = 14.5)
  const currentTime = hours + minutes / 60;

  // Час роботи за днями тижня (0 — неділя, 6 — субота)
  const schedule = {
    0: [11, 23],
    1: [12, 23],
    2: [12, 23],
    3: [12, 23],
    4: [12, 23],
    5: [12, 23],
    6: [11, 23],
  };

  const [open, close] = schedule[day] || [];
  return currentTime >= open && currentTime < close;
};
