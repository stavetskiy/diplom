import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, useSearchParams } from "react-router-dom";

import TableMap from "../components/booking/TableMap";
import BookingConfirmation from "../components/booking/BookingConfirmation";
import Header from "../components/Header";

const BookingPage = () => {
  const [userId, setUserId] = useState(null);
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [duration, setDuration] = useState(2);
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);

  const [searchParams] = useSearchParams();
  const isGuest = searchParams.get("guest") === "true";

  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
    });
    return unsub;
  }, []);

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

  const completeBooking = () => {
    navigate("/profile/bookings");
  };

  return (
    <>
      <Header />
      <div className="flex flex-row max-w-7xl mx-auto p-6 gap-10">
        {/* LEFT SIDE: Steps */}
        <div className="flex flex-col gap-8 w-full max-w-sm">
          {/* Step 1 */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">
              Крок 1: Дата, час, тривалість
            </h2>
            <input
              type="date"
              className="border p-2 rounded w-full"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <input
              type="time"
              className="border p-2 rounded w-full"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
            />
            <div>
              <label className="block mb-1 font-medium">
                Тривалість бронювання
              </label>
              <select
                className="border p-2 rounded w-full"
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
            {step === 1 && (
              <button
                onClick={() => selectedDate && selectedTime && setStep(2)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Далі
              </button>
            )}
          </section>

          {/* Step 3 */}
          {step >= 3 && selectedTable && (
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Крок 3: Підтвердження</h2>
              <BookingConfirmation
                table={selectedTable}
                date={selectedDate}
                time={selectedTime}
                duration={duration}
                userId={userId}
                isGuest={isGuest}
                onConfirm={completeBooking}
                onCancel={() => setStep(2)}
              />
            </section>
          )}
        </div>

        {/* RIGHT SIDE: MAP */}
        <div className="flex-grow aspect-[3/4]">
          {step >= 2 && selectedDate && selectedTime && (
            <div className="w-full h-full">
              <TableMap
                selectedTableId={selectedTableId}
                onTableSelect={handleTableSelect}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                duration={duration}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BookingPage;
