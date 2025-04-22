import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";

const EditProfileForm = ({ userId, onNameUpdate }) => {
  const user = auth.currentUser;

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        setName(data.name || "");
        setSurname(data.surname || "");
        setPhone(data.phone || "");
        setEmail(data.email || user.email);
      }
    };

    fetchUser();
  }, [userId]);

  const validateProfile = () => {
    const errors = {};
    const nameRegex = /^[a-zA-Zа-яА-ЯёЁіІїЇєЄґҐ'’\- ]{2,}$/u;
    const phoneRegex = /^\+380\d{9}$/;

    if (!nameRegex.test(name)) {
      errors.name = "Неправильне ім’я (укр/англ, мін. 2 символи)";
    }
    if (!nameRegex.test(surname)) {
      errors.surname = "Неправильне прізвище (укр/англ, мін. 2 символи)";
    }
    if (!email.includes("@")) {
      errors.email = "Некоректний email";
    }
    if (!phoneRegex.test(phone)) {
      errors.phone = "Номер має бути у форматі +380XXXXXXXXX";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateProfile()) return;

    try {
      await updateDoc(doc(db, "users", userId), {
        name,
        surname,
        phone,
        email, // зберігаємо лише в Firestore
      });

      if (onNameUpdate) onNameUpdate(name);

      setMessage("✅ Дані профілю успішно збережено");
      setError("");
    } catch (err) {
      setError("❌ Помилка оновлення профілю: " + err.message);
      setMessage("");
    }
  };

  const handleChangePassword = () => {
    if (newPassword.length < 6) {
      setError("Пароль має містити щонайменше 6 символів");
      setMessage("");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Паролі не співпадають");
      setMessage("");
      return;
    }

    // Пароль не змінюється, просто імітація:
    setMessage("✅ Новий пароль прийнято (тільки візуально)");
    setError("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="mb-8 p-6 bg-white shadow rounded border">
      <h3 className="text-xl font-semibold mb-4">Ваші дані</h3>

      <div className="grid gap-4">
        <div>
          <input
            type="text"
            placeholder="Ім'я"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded w-full"
          />
          {fieldErrors.name && (
            <p className="text-red-500 text-sm">{fieldErrors.name}</p>
          )}
        </div>
        <div>
          <input
            type="text"
            placeholder="Прізвище"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            className="border p-2 rounded w-full"
          />
          {fieldErrors.surname && (
            <p className="text-red-500 text-sm">{fieldErrors.surname}</p>
          )}
        </div>
        <div>
          <input
            type="email"
            placeholder="Електронна пошта"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded w-full"
          />
          {fieldErrors.email && (
            <p className="text-red-500 text-sm">{fieldErrors.email}</p>
          )}
        </div>
        <div>
          <input
            type="tel"
            placeholder="Номер телефону"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border p-2 rounded w-full"
          />
          {fieldErrors.phone && (
            <p className="text-red-500 text-sm">{fieldErrors.phone}</p>
          )}
        </div>
        <button
          onClick={handleSaveProfile}
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Зберегти зміни
        </button>
      </div>

      <div className="mt-8">
        <h4 className="font-semibold mb-2">Зміна пароля</h4>
        <input
          type="password"
          placeholder="Новий пароль"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="border p-2 rounded mb-2 w-full"
        />
        <input
          type="password"
          placeholder="Повторіть новий пароль"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="border p-2 rounded mb-2 w-full"
        />
        <button
          onClick={handleChangePassword}
          className="bg-green-600 text-white py-2 rounded hover:bg-green-700 w-full"
        >
          Змінити пароль
        </button>
      </div>

      {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default EditProfileForm;
