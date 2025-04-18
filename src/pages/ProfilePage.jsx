import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { format } from "date-fns";
import EditProfileForm from "../pages/profile/EditProfileForm";
import Header from "../components/Header";

const ProfilePage = () => {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");
  const [reservations, setReservations] = useState([]);
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUserName(userData.name || "");
          setSurname(userData.surname || "");
          setEmail(userData.email || "");
          setPhone(userData.phone || "");
        }
      }
    });
    return unsub;
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
        <h2 className="text-2xl font-bold mb-4">
          {userName ? `${userName}, це ваші бронювання:` : "Ваші бронювання"}
        </h2>

        {userId && (
          <EditProfileForm
            userId={userId}
            currentName={userName}
            onNameUpdate={(newName) => setUserName(newName)}
          />
        )}

        <div className="mb-6 p-4 bg-white shadow rounded border">
          <h3 className="text-xl font-semibold mb-2">
            Інформація про користувача
          </h3>
          <p>
            <strong>Ім'я:</strong> {userName}
          </p>
          <p>
            <strong>Прізвище:</strong> {surname}
          </p>
          <p>
            <strong>Email:</strong> {email}
          </p>
          <p>
            <strong>Телефон:</strong> {phone}
          </p>
        </div>

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

export default ProfilePage;
