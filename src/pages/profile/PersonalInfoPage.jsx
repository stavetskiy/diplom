import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";

const PersonalInfoPage = () => {
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState({});
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
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUserId(user.uid);
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
        }
      }
    });

    return unsubscribe;
  }, []);

  return (
    <>
      <Header />
      <div className="p-6 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Персональні дані</h2>

        <div className="bg-white shadow rounded p-4 border space-y-2">
          <p>
            <strong>Ім’я:</strong> {userData.name || "—"}
          </p>
          <p>
            <strong>Прізвище:</strong> {userData.surname || "—"}
          </p>
          <p>
            <strong>Email:</strong> {userData.email || auth.currentUser?.email}
          </p>
          <p>
            <strong>Телефон:</strong> {userData.phone || "—"}
          </p>
        </div>
      </div>
    </>
  );
};

export default PersonalInfoPage;
