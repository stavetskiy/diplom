// ✅ BookingPage.jsx
import { useState, useEffect } from "react";
import { auth, db } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, useSearchParams } from "react-router-dom";

import TableMap from "../map/TableMap";
import BookingConfirmation from "./BookingConfirmation";
import Header from "../Header";
import Footer from "../Footer";
import GuestSuccessModal from "../common/modal/GuestSuccessModal";
import photo1 from "../../assets/photo1.jpg";

const BookingPage = () => {
  const [userId, setUserId] = useState(null);
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [duration, setDuration] = useState(2);
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [guestSuccessData, setGuestSuccessData] = useState(null);

  const [searchParams] = useSearchParams();
  const isGuest = searchParams.get("guest") === "true";

  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (selectedDate && selectedTime && duration) {
      setStep(2);
    }
  }, [selectedDate, selectedTime, duration]);

  const handleTableSelect = async (tableId) => {
    setSelectedTableId(tableId);

    try {
      const tableRef = doc(db, "tables", tableId);
      const tableSnap = await getDoc(tableRef);

      if (tableSnap.exists()) {
        const tableData = tableSnap.data();
        setSelectedTable({ id: tableId, ...tableData });
        setStep(3);
      } else {
        console.error("Стіл не знайдено в Firestore");
      }
    } catch (err) {
      console.error("Помилка при завантаженні столу:", err);
    }
  };

  const completeBooking = (data) => {
    if (data?.guestInfo) {
      setGuestSuccessData(data);
    } else {
      navigate("/profile/bookings");
    }
  };

  return (
    <>
      <Header />

      <div className="flex flex-col lg:flex-row max-w-6xl mx-auto px-4 pt-6 pb-10 gap-10">
        {/* LEFT SIDE: Steps */}
        <div className="w-full lg:w-[40%] flex flex-col gap-4">
          {/* КРОК 1 */}
          <h2 className="text-xl font-semibold">
            Крок 1: Дата, час, тривалість
          </h2>
          <section className="bg-white border rounded-lg shadow p-6 w-full space-y-4">
            <div className="space-y-1">
              <label className="block font-medium">Оберіть дату</label>
              <input
                type="date"
                className="border p-2 rounded w-full text-lg"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="block font-medium">Оберіть час</label>
              <input
                type="time"
                className="border p-2 rounded w-full text-lg"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="block font-medium">Тривалість бронювання</label>
              <select
                className="border p-2 rounded w-full text-lg"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
              >
                {[2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6].map((d) => (
                  <option key={d} value={d}>
                    {d} год
                  </option>
                ))}
              </select>
            </div>
          </section>

          {/* КРОК 3 */}
          {step >= 3 && selectedTable && (
            <section className="space-y-4 transition-all duration-500 ease-out opacity-100 scale-100 animate-fade">
              <BookingConfirmation
                table={selectedTable}
                date={selectedDate}
                time={selectedTime}
                duration={duration}
                userId={userId}
                isGuest={isGuest}
                onConfirm={completeBooking}
              />
            </section>
          )}
        </div>

        {/* RIGHT SIDE: MAP or Placeholder */}
        <div className="w-full max-w-[550px] mx-auto space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Крок 2: Вибір столу</h2>
          </div>

          {step >= 2 && selectedDate && selectedTime && duration ? (
            <TableMap
              selectedTableId={selectedTableId}
              onTableSelect={handleTableSelect}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              duration={duration}
            />
          ) : (
            <div className="w-full aspect-[3/4] bg-white border border-dashed rounded-md shadow-md flex items-center justify-center text-center text-gray-500">
              <p className="text-lg px-4">
                🕒 Щоб продовжити — оберіть дату, час і тривалість бронювання.
              </p>
            </div>
          )}
        </div>
      </div>

      {guestSuccessData && (
        <GuestSuccessModal
          guestInfo={guestSuccessData.guestInfo}
          reservationInfo={{
            date: selectedDate,
            time: selectedTime,
            duration,
            tableId: selectedTable?.id,
          }}
          onClose={() => setGuestSuccessData(null)}
        />
      )}

      <Footer />
    </>
  );
};

export default BookingPage;
