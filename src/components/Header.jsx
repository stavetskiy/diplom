import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import userIcon from "../assets/user.png"; // шлях до user.png

const Header = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef();

  // Закриття меню при кліку поза ним
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Слухач авторизації
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const userSnap = await getDoc(doc(db, "users", user.uid));
        if (userSnap.exists()) {
          setUserData(userSnap.data());
        }
      }
    });
    return () => unsub();
  }, []);

  const handleProfileClick = () => {
    if (!user) {
      navigate("/auth");
    } else {
      setMenuOpen(!menuOpen);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="bg-blue-400 p-4 flex justify-between items-center relative z-50">
      <div
        className="flex items-center gap-4 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <div className="bg-red-600 text-white px-2 py-1 text-sm">Лого</div>
        <h1 className="text-xl font-semibold text-white">Назва ресторану</h1>
      </div>
      <div className="relative" ref={menuRef}>
        <button onClick={handleProfileClick} className="focus:outline-none">
          <img
            src={userIcon}
            alt="User"
            className="w-10 h-10 rounded-full border-2 border-white"
          />
        </button>

        {menuOpen && user && (
          <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded border overflow-hidden">
            <div className="px-4 py-3 text-sm text-gray-600 border-b">
              {userData.name} {userData.surname}
            </div>
            <button
              onClick={() => {
                navigate("/profile/bookings");
                setMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
            >
              Мої бронювання
            </button>
            <button
              onClick={() => {
                navigate("/profile/personal");
                setMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
            >
              Мої персональні дані
            </button>
            <button
              onClick={() => {
                navigate("/profile/edit");
                setMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
            >
              Змінити персональні дані
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-red-100 text-sm text-red-600"
            >
              Вийти
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
