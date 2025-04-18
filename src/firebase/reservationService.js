import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

export const createReservation = async ({
  userId,
  tableId,
  date,
  time,
  duration,
  guestInfo = null,
}) => {
  const reservation = {
    userId: userId || null,
    tableId,
    date,
    time,
    duration,
    status: "active",
    createdAt: new Date(),
  };

  if (guestInfo) {
    reservation.guestInfo = guestInfo; // { name, surname, phone }
  }

  try {
    await addDoc(collection(db, "reservations"), reservation);
  } catch (error) {
    console.error("Помилка при створенні бронювання:", error);
    throw error;
  }
};
