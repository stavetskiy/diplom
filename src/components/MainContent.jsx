import React from "react";
import BookingButton from "./common/BookingButton";
import ShowOnMapButton from "./common/ShowOnMapButton";
import WorkingHours from "./info/WorkingHours";
import AboutRestaurant from "./info/AboutRestaurant";
import { isRestaurantOpen } from "../utils/isRestaurantOpen";
import restaurantPhoto from "../assets/photo.jpeg"; // 🖼️ локальне фото

const MainContent = () => {
  return (
    <main className="flex-1">
      {/* Банер з фото ресторану */}
      <section
        className="relative h-[300px] bg-cover bg-center mb-8 rounded-b-3xl shadow-lg overflow-hidden"
        style={{
          backgroundImage: `url(${restaurantPhoto})`,
        }}
      >
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Ласкаво просимо до нашого ресторану
          </h1>
          <p className="text-lg font-medium mb-4">
            {isRestaurantOpen() ? "Ми відкриті" : "Ми зачинені"}
          </p>
          <div className="flex flex-col md:flex-row gap-4">
            <BookingButton />
            <ShowOnMapButton />
          </div>
        </div>
      </section>

      {/* Інформаційні блоки */}
      <section className="flex flex-col md:flex-row justify-center gap-6 px-4 mb-12 max-w-6xl mx-auto">
        <WorkingHours />
        <AboutRestaurant />
      </section>
    </main>
  );
};

export default MainContent;
