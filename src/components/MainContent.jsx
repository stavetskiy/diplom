import React from "react";
import BookingButton from "./common/BookingButton";
import ShowOnMapButton from "./common/ShowOnMapButton";
import WorkingHours from "./info/WorkingHours";
import AboutRestaurant from "./info/AboutRestaurant";
import { isRestaurantOpen } from "../utils/isRestaurantOpen";

const MainContent = () => {
  return (
    <main className="flex-1">
      {/* Банер/обкладинка */}
      <section
        className="relative h-[250px] bg-cover bg-center mb-8 rounded-b-2xl shadow-lg"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1541544181002-3fdf4e42a5c7')`, // прикладне зображення
        }}
      >
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Ласкаво просимо до нашого ресторану
          </h1>
          <p className="text-lg font-medium">
            {isRestaurantOpen() ? "Ми відкриті" : "Ми зачинені"}
          </p>
          <div className="flex flex-col md:flex-row gap-4">
            <BookingButton />
            <ShowOnMapButton />
          </div>
        </div>
      </section>

      {/* Два блоки з інформацією — в рядок */}
      <section className="flex flex-col md:flex-row justify-center gap-6 px-4 mb-12 max-w-6xl mx-auto">
        <WorkingHours />
        <AboutRestaurant />
      </section>
    </main>
  );
};

export default MainContent;
