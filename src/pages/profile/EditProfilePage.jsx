import { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import EditProfileForm from "./EditProfileForm";
import photo from "../../assets/photo.jpeg";
import Footer from "../../components/Footer";

const EditProfilePage = () => {
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/auth");
      } else {
        setUserId(user.uid);
      }
    });

    return () => unsub();
  }, [navigate]);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${photo})` }}
    >
      <div className="bg-black/40 min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          <div className="p-6 max-w-xl mx-auto mt-8 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Редагувати дані
            </h2>
            {userId ? (
              <EditProfileForm userId={userId} />
            ) : (
              <p className="text-gray-600">Завантаження профілю...</p>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default EditProfilePage;
