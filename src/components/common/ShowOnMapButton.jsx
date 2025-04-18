import React from "react";

const ShowOnMapButton = () => {
  const openMap = () => {
    window.open("https://www.google.com/maps/place/Ресторан", "_blank");
  };

  return (
    <button
      onClick={openMap}
      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl shadow-md transition"
    >
      Показати на карті ресторану
    </button>
  );
};

export default ShowOnMapButton;
