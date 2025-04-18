// src/components/WorkingHours.jsx
import React from "react";

const workingHours = [
  { day: "Понеділок", time: "12:00 – 23:00" },
  { day: "Вівторок", time: "12:00 – 23:00" },
  { day: "Середа", time: "12:00 – 23:00" },
  { day: "Четвер", time: "12:00 – 23:00" },
  { day: "П’ятниця", time: "12:00 – 23:00" },
  { day: "Субота", time: "11:00 – 23:00" },
  { day: "Неділя", time: "11:00 – 23:00" },
];

const WorkingHours = () => {
  return (
    <div className="bg-white shadow rounded-lg p-6 w-full md:w-1/2">
      <h2 className="text-2xl font-bold mb-4">Графік роботи</h2>
      <ul className="text-gray-700 space-y-1">
        {workingHours.map(({ day, time }) => (
          <li key={day} className="flex justify-between border-b pb-1">
            <span>{day}</span>
            <span>{time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WorkingHours;
