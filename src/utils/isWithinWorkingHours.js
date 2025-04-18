export const isWithinWorkingHours = (dateStr, timeStr, duration) => {
  const date = new Date(`${dateStr}T${timeStr}`);
  const day = date.getDay(); // 0 — неділя, 1 — понеділок, ..., 6 — субота

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

  const startTime = date.getHours() + date.getMinutes() / 60;
  const endTime = startTime + duration;

  return startTime >= open && endTime <= close;
};
