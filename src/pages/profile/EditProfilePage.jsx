import { useEffect, useState } from "react";
import { auth } from "../../firebase";
import Header from "../../components/Header";
import EditProfileForm from "./EditProfileForm";
import { useNavigate } from "react-router-dom";

const EditProfilePage = () => {
  const [userId, setUserId] = useState(null);
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

  return (
    <>
      <Header />
      <div className="p-6 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Редагувати дані</h2>
        {userId ? (
          <EditProfileForm userId={userId} />
        ) : (
          <p>Завантаження профілю...</p>
        )}
      </div>
    </>
  );
};

export default EditProfilePage;
