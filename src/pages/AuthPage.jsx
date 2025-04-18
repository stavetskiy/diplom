import { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import Header from "../components/Header";
import { useNavigate, useLocation } from "react-router-dom";

const AuthPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/";

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate("/"); // або "/"
      }
    });

    return unsubscribe;
  }, [navigate]);

  const validate = () => {
    const errors = {};
    const nameRegex = /^[a-zA-Zа-яА-ЯёЁіІїЇєЄґҐ'’\- ]{2,}$/u;
    const phoneRegex = /^\+380\d{9}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nameRegex.test(name)) {
      errors.name = "Введіть коректне ім’я (укр/англ, мін. 2 літери)";
    }

    if (!nameRegex.test(surname)) {
      errors.surname = "Введіть коректне прізвище (укр/англ, мін. 2 літери)";
    }

    if (!emailRegex.test(email)) {
      errors.email = "Некоректний email";
    }

    if (!phoneRegex.test(phone)) {
      errors.phone = "Номер має бути у форматі +380XXXXXXXXX";
    }

    if (!passwordRegex.test(password)) {
      errors.password =
        "Пароль має містити велику літеру та цифру, мін. 6 символів";
    }

    if (password !== repeatPassword) {
      errors.repeatPassword = "Паролі не співпадають";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (isRegistering && !validate()) {
      setLoading(false);
      return;
    }

    try {
      if (isRegistering) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
          name,
          surname,
          email,
          phone,
        });
        navigate(redirectTo);
      } else {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const user = userCredential.user;
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          throw new Error("Користувача не знайдено в базі.");
        }

        navigate(redirectTo);
      }
    } catch (err) {
      setError(err.message || "Помилка авторизації");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4">
          {isRegistering ? "Реєстрація" : "Вхід"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <>
              <div>
                <input
                  type="text"
                  placeholder="Ім'я"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border p-2 rounded"
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
                  className="w-full border p-2 rounded"
                />
                {fieldErrors.surname && (
                  <p className="text-red-500 text-sm">{fieldErrors.surname}</p>
                )}
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="Номер телефону"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border p-2 rounded"
                />
                {fieldErrors.phone && (
                  <p className="text-red-500 text-sm">{fieldErrors.phone}</p>
                )}
              </div>
            </>
          )}
          <div>
            <input
              type="email"
              placeholder="Ел. пошта"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-2 rounded"
            />
            {fieldErrors.email && (
              <p className="text-red-500 text-sm">{fieldErrors.email}</p>
            )}
          </div>
          <div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-2 rounded"
            />
            <button
              type="button"
              className="text-sm text-blue-600 mt-1 hover:underline"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Приховати пароль" : "Показати пароль"}
            </button>
            {fieldErrors.password && (
              <p className="text-red-500 text-sm">{fieldErrors.password}</p>
            )}
          </div>
          {isRegistering && (
            <div>
              <input
                type="password"
                placeholder="Повторіть пароль"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                className="w-full border p-2 rounded"
              />
              {fieldErrors.repeatPassword && (
                <p className="text-red-500 text-sm">
                  {fieldErrors.repeatPassword}
                </p>
              )}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading
              ? "Зачекайте..."
              : isRegistering
              ? "Зареєструватися"
              : "Увійти"}
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
        <p className="mt-4 text-sm text-center">
          {isRegistering ? "Вже маєте акаунт?" : "Немає акаунту?"}{" "}
          <button
            className="text-blue-600 hover:underline"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setFieldErrors({});
              setError("");
              setPassword("");
              setRepeatPassword("");
            }}
          >
            {isRegistering ? "Увійти" : "Зареєструватися"}
          </button>
        </p>
      </div>
    </>
  );
};

export default AuthPage;
