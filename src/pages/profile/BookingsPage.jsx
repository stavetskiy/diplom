import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { format } from "date-fns";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";

const BookingsPage = () => {
  const [userId, setUserId] = useState(null);
  const [reservations, setReservations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/auth");
      } else {
        setUserId(user.uid);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchReservations = async () => {
      if (!userId) return;
      const q = query(
        collection(db, "reservations"),
        where("userId", "==", userId)
      );
      const snapshot = await getDocs(q);
      const result = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReservations(result);
    };

    fetchReservations();
  }, [userId]);

  const handleCancel = async (id) => {
    const confirm = window.confirm("Скасувати це бронювання?");
    if (!confirm) return;

    await updateDoc(doc(db, "reservations", id), {
      status: "canceled",
    });

    setReservations((prev) =>
      prev.map((res) => (res.id === id ? { ...res, status: "canceled" } : res))
    );
  };

  const now = new Date();

  const future = reservations.filter(
    (r) => new Date(`${r.date}T${r.time}`) >= now && r.status === "active"
  );

  const past = reservations.filter(
    (r) => new Date(`${r.date}T${r.time}`) < now || r.status === "canceled"
  );

  return (
    <>
      <Header />
      <div className="p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Мої бронювання</h2>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">Майбутні</h3>
          {future.length === 0 ? (
            <p>Немає активних бронювань.</p>
          ) : (
            future.map((res) => (
              <div
                key={res.id}
                className="p-4 mb-2 bg-green-100 border rounded shadow flex justify-between items-center"
              >
                <div>
                  <p>
                    <strong>Стіл №:</strong> {res.tableId.replace("T", "")}
                  </p>
                  <p>
                    <strong>Дата:</strong>{" "}
                    {format(new Date(res.date), "dd.MM.yyyy")}
                  </p>
                  <p>
                    <strong>Час:</strong> {res.time}
                  </p>
                </div>
                <button
                  onClick={() => handleCancel(res.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Скасувати
                </button>
              </div>
            ))
          )}
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">Історія</h3>
          {past.length === 0 ? (
            <p>Немає минулих або скасованих бронювань.</p>
          ) : (
            past.map((res) => (
              <div
                key={res.id}
                className="p-4 mb-2 bg-gray-100 border rounded shadow"
              >
                <p>
                  <strong>Стіл №:</strong> {res.tableId.replace("T", "")}
                </p>
                <p>
                  <strong>Дата:</strong>{" "}
                  {format(new Date(res.date), "dd.MM.yyyy")}
                </p>
                <p>
                  <strong>Час:</strong> {res.time}
                </p>
                <p>
                  <strong>Статус:</strong>{" "}
                  {res.status === "canceled" ? "Скасовано" : "Завершено"}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default BookingsPage;
