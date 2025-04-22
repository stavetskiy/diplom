import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";

const tablePositions = {
  T1: { top: "92%", left: "20%", type: 4 },
  T2: { top: "80%", left: "21%", type: 2 },
  T3: { top: "68%", left: "15%", type: 4 },
  T4: { top: "80%", left: "40%", type: 2 },
  T5: { top: "90%", left: "50%", type: 2 },
  T6: { top: "80%", left: "60%", type: 2 },
  T7: { top: "67%", left: "44%", type: 6 },
  T8: { top: "54%", left: "23%", type: 2 },
  T9: { top: "54%", left: "40%", type: 2 },
  T10: { top: "43%", left: "23%", type: 4 },
  T11: { top: "43%", left: "40%", type: 2 },
  T12: { top: "32%", left: "40%", type: 2 },
  T13: { top: "32%", left: "23%", type: 2 },
  T14: { top: "21%", left: "30%", type: 2 },
  T15: { top: "21%", left: "13%", type: 2 },
  T16: { top: "10%", left: "13%", type: 2 },
  T17: { top: "10%", left: "30%", type: 2 },
  T18: { top: "12%", left: "55%", type: 6 },
  T19: { top: "10%", left: "75%", type: 2 },
  T20: { top: "10%", left: "90%", type: 2 },
  T21: { top: "21%", left: "75%", type: 2 },
  T22: { top: "21%", left: "90%", type: 2 },
  T23: { top: "32%", left: "75%", type: 4 },
  T24: { top: "43%", left: "75%", type: 2 },
  T25: { top: "54%", left: "75%", type: 2 },
  T26: { top: "65%", left: "75%", type: 2 },
};

const furnitureElements = [
  { id: "window1", top: "0%", left: "20%", label: "Вікно" },
  { id: "window2", top: "0%", left: "50%", label: "Вікно" },
  { id: "window3", top: "0%", left: "80%", label: "Вікно" },
  { id: "window4", top: "15%", left: "0%", label: "Вікно" },
  { id: "window5", top: "15%", left: "100%", label: "Вікно" },
  { id: "entrance", top: "100%", left: "80%", label: "Вхід" },
  { id: "wc", top: "80%", left: "100%", label: "WC" },
  { id: "fireplace", top: "100%", left: "40%", label: "Камін" },
];

const getFurnitureLabel = (label) => {
  switch (label) {
    case "Вхід":
      return "🚪 Вхід";
    case "WC":
      return "🚻 WC";
    case "Камін":
      return "🔥 Камін";
    case "Вікно":
      return "🪟 Вікно";
    default:
      return label;
  }
};

const TableMap = ({
  onTableSelect,
  selectedTableId,
  selectedDate,
  selectedTime,
  duration,
}) => {
  const [tables, setTables] = useState({});

  useEffect(() => {
    const fetchTables = async () => {
      const snapshot = await getDocs(collection(db, "tables"));
      const reservationsSnap = await getDocs(
        query(
          collection(db, "reservations"),
          where("date", "==", selectedDate),
          where("status", "==", "active")
        )
      );

      const requestedStart = new Date(`${selectedDate}T${selectedTime}`);
      const requestedEnd = new Date(
        requestedStart.getTime() + duration * 60 * 60 * 1000
      );

      const reservedTables = new Set();

      reservationsSnap.docs.forEach((docSnap) => {
        const res = docSnap.data();
        const resStart = new Date(`${res.date}T${res.time}`);
        const resEnd = new Date(
          resStart.getTime() + (res.duration || 120) * 60 * 60 * 1000
        );

        const isConflict = requestedStart < resEnd && requestedEnd > resStart;

        if (isConflict) {
          reservedTables.add(res.tableId);
        }
      });

      const tableData = {};
      snapshot.forEach((doc) => {
        const id = doc.id;
        tableData[id] = {
          ...doc.data(),
          status: reservedTables.has(id) ? "reserved" : "available",
        };
      });

      setTables(tableData);
    };

    if (selectedDate && selectedTime && duration) {
      fetchTables();
    }
  }, [selectedDate, selectedTime, duration]);

  const getColor = (table) => {
    if (table?.status === "reserved") return "bg-gray-400";
    if (table?.type === 2) return "bg-yellow-300";
    if (table?.type === 4) return "bg-orange-400";
    if (table?.type === 6) return "bg-cyan-300";
    return "bg-white";
  };

  const getSize = (table) => {
    if (table?.type === 2) return 40;
    if (table?.type === 4) return 55;
    if (table?.type === 6) return 65;
    return 40;
  };

  return (
    <div className="relative w-full aspect-[3/4] bg-white border rounded-md shadow-lg">
      {/* Інтер'єр */}
      {furnitureElements.map((el) => (
        <div
          key={el.id}
          className="absolute bg-gray-100 text-gray-800 text-xs font-medium border rounded-full px-2 py-0.5 shadow-sm"
          style={{
            top: el.top,
            left: el.left,
            transform: "translate(-50%, -50%)",
            whiteSpace: "nowrap",
          }}
        >
          {getFurnitureLabel(el.label)}
        </div>
      ))}

      {/* Столи */}
      {Object.entries(tablePositions).map(([id, pos]) => {
        const table = tables[id];
        const isSelected = selectedTableId === id;
        const size = getSize(table);

        return (
          <button
            key={id}
            onClick={() => table?.status !== "reserved" && onTableSelect(id)}
            title={`Стіл №${id.replace("T", "")}, ${table?.type} місць${
              table?.status === "reserved" ? " (заброньовано)" : ""
            }`}
            className={`absolute rounded-full text-sm font-bold flex items-center justify-center border
              ${getColor(table)}
              ${isSelected ? "ring-4 ring-green-500" : ""}
              ${
                table?.status !== "reserved"
                  ? "hover:ring hover:ring-blue-400"
                  : ""
              }
              transition-transform duration-200 ease-in-out
            `}
            style={{
              top: pos.top,
              left: pos.left,
              width: `${size}px`,
              height: `${size}px`,
              transform: "translate(-50%, -50%)",
              cursor: table?.status === "reserved" ? "not-allowed" : "pointer",
            }}
          >
            {id.replace("T", "")}
          </button>
        );
      })}
    </div>
  );
};

export default TableMap;
