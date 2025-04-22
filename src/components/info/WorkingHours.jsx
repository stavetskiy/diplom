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
    <div className="bg-white border border-gray-300 shadow-md rounded-xl p-6 w-full md:w-1/2">
      <h2 className="text-3xl mb-5 font-semibold text-gray-800">
        Графік роботи
      </h2>
      <ul className="text-gray-800 space-y-2 text-base md:text-lg">
        {workingHours.map(({ day, time }) => (
          <li
            key={day}
            className="flex justify-between border-b-2 border-gray-200 pb-2"
          >
            <span>{day}</span>
            <span>{time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WorkingHours;
