import { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import Header from "../components/Header";
import { useNavigate, useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import photo1 from "../assets/photo1.jpg";

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
    <div
      className="relative min-h-screen bg-cover bg-center flex flex-col"
      style={{ backgroundImage: `url(${photo1})` }}
    >
      <div className="absolute inset-0 bg-black/40 z-0" />
      <Header />

      <main className="relative z-10 flex items-center justify-center px-4 mt-40 mb-40">
        <div className="bg-white bg-opacity-95 p-8 rounded-2xl shadow-xl max-w-md w-full min-h-[520px] transition-all duration-300 ease-in-out">
          <h2 className="text-3xl font-bold text-center text-red-600 mb-2">
            Flavorium
          </h2>
          <p className="text-center text-sm text-gray-600 mb-6">
            Увійдіть, щоб керувати бронюваннями або зареєструйтесь
          </p>

          {/* Блок ВХОДУ */}
          <div
            className={`transition-all duration-300 transform ${
              isRegistering
                ? "opacity-0 scale-95 absolute pointer-events-none"
                : "opacity-100 scale-100 relative"
            }`}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
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
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Зачекайте..." : "Увійти"}
              </button>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </form>
            <p className="mt-4 text-sm text-center">
              Немає акаунту?{" "}
              <button
                className="text-blue-600 hover:underline"
                onClick={() => {
                  setIsRegistering(true);
                  setFieldErrors({});
                  setError("");
                  setPassword("");
                  setRepeatPassword("");
                }}
              >
                Зареєструватися
              </button>
            </p>
          </div>

          {/* Блок РЕЄСТРАЦІЇ */}
          <div
            className={`transition-all duration-300 transform ${
              isRegistering
                ? "opacity-100 scale-100 relative"
                : "opacity-0 scale-95 absolute pointer-events-none"
            }`}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
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
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Зачекайте..." : "Зареєструватися"}
              </button>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </form>
            <p className="mt-4 text-sm text-center">
              Вже маєте акаунт?{" "}
              <button
                className="text-blue-600 hover:underline"
                onClick={() => {
                  setIsRegistering(false);
                  setFieldErrors({});
                  setError("");
                  setPassword("");
                  setRepeatPassword("");
                }}
              >
                Увійти
              </button>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AuthPage;
