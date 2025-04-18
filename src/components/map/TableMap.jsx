import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";

const tablePositions = {
  T1: { top: "90%", left: "10%", type: 4 },
  T2: { top: "75%", left: "15%", type: 2 },
  T3: { top: "60%", left: "10%", type: 4 },
  T4: { top: "75%", left: "30%", type: 2 },
  T5: { top: "85%", left: "35%", type: 2 },
  T6: { top: "75%", left: "45%", type: 2 },
  T7: { top: "60%", left: "30%", type: 6 },
  T8: { top: "45%", left: "10%", type: 2 },
  T9: { top: "45%", left: "45%", type: 2 },
  T10: { top: "30%", left: "10%", type: 2 },
  T11: { top: "30%", left: "45%", type: 2 },
  T12: { top: "20%", left: "45%", type: 2 },
  T13: { top: "20%", left: "10%", type: 2 },
  T14: { top: "10%", left: "30%", type: 2 },
  T15: { top: "10%", left: "10%", type: 2 },
  T16: { top: "0%", left: "10%", type: 2 },
  T17: { top: "0%", left: "30%", type: 2 },
  T18: { top: "10%", left: "60%", type: 6 },
  T19: { top: "0%", left: "70%", type: 2 },
  T20: { top: "0%", left: "90%", type: 2 },
  T21: { top: "10%", left: "70%", type: 2 },
  T22: { top: "10%", left: "90%", type: 2 },
  T23: { top: "20%", left: "70%", type: 4 },
  T24: { top: "30%", left: "70%", type: 2 },
  T25: { top: "45%", left: "70%", type: 2 },
  T26: { top: "60%", left: "70%", type: 2 },
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
          resStart.getTime() + (res.duration || 2) * 60 * 60 * 1000
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
    if (table?.type === 4) return "bg-blue-400";
    if (table?.type === 6) return "bg-red-400";
    return "bg-white";
  };

  const getSize = (table) => {
    if (table?.type === 2) return 40;
    if (table?.type === 4) return 50;
    if (table?.type === 6) return 60;
    return 40;
  };

  return (
    <div className="relative w-full h-full bg-white border rounded-md shadow-md">
      {Object.entries(tablePositions).map(([id, pos]) => {
        const table = tables[id];
        const isSelected = selectedTableId === id;
        const size = getSize(table);

        return (
          <button
            key={id}
            onClick={() => table?.status !== "reserved" && onTableSelect(id)}
            className={`absolute rounded-full text-sm font-bold flex items-center justify-center border 
              ${getColor(table)} 
              ${isSelected ? "ring-4 ring-green-500" : ""}
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
