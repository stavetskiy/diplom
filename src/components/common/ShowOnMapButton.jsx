import React from "react";

const ShowOnMapButton = () => {
  const openMap = () => {
    window.open(
      "https://www.google.com.ua/maps/place/Zaporiz%CA%B9kyy+Natsional%CA%B9nyy+Universytet/@47.818234,35.1782941,17z/data=!3m1!4b1!4m6!3m5!1s0x40dc5de206d5b881:0x2dde5310c609e987!8m2!3d47.8182304!4d35.180869!16s%2Fm%2F0ndwwmw?entry=ttu&g_ep=EgoyMDI1MDQxNi4xIKXMDSoJLDEwMjExNjQwSAFQAw%3D%3D",
      "_blank"
    );
  };

  return (
    <button
      onClick={openMap}
      className="px-6 py-3 bg-red-600 rounded-3xl shadow-md hover:bg-red-700 transition text-sm font-semibold"
    >
      Показати на карті
    </button>
  );
};

export default ShowOnMapButton;
