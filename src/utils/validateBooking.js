import { collection, getDocs, query, where } from "firebase/firestore";

const doesOverlap = (startA, endA, startB, endB) => {
  return startA < endB && startB < endA;
};

const isWithinWorkingHours = (start, duration) => {
  const opening = 10;
  const closing = 22;
  const end = new Date(start.getTime() + duration * 60000);

  return (
    start.getHours() >= opening &&
    (end.getHours() < closing ||
      (end.getHours() === closing && end.getMinutes() === 0))
  );
};

export const validateBooking = async ({
  db,
  tableId,
  date,
  time,
  duration,
}) => {
  const startDate = new Date(`${date}T${time}`);
  const endDate = new Date(startDate.getTime() + duration * 60000);

  if (!isWithinWorkingHours(startDate, duration)) {
    return "⛔ Час бронювання виходить за межі графіку роботи ресторану.";
  }

  const q = query(
    collection(db, "bookings"),
    where("tableId", "==", tableId),
    where("date", "==", date)
  );

  const snapshot = await getDocs(q);

  for (const doc of snapshot.docs) {
    const { startTime, duration: existingDuration } = doc.data();
    const existingStart = new Date(`${date}T${startTime}`);
    const existingEnd = new Date(
      existingStart.getTime() + existingDuration * 60000
    );

    if (doesOverlap(startDate, endDate, existingStart, existingEnd)) {
      return `❗Цей стіл зайнятий у зазначений період (${startTime} + ${existingDuration} хв).`;
    }
  }

  return "ok";
};
