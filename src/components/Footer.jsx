import React from "react";

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white px-6 py-8 text-sm mt-12">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between gap-6 text-center sm:text-left">
        <div>
          <h4 className="font-semibold text-base mb-2">Контактна інформація</h4>
          <p>м. Запоріжжя, вул. Жуковського, 66</p>
          <p>Запорізька область, 69600</p>
          <p>Телефон: +380 (61) 228-75-02</p>
          <p>Email: info@restaurant.com</p>
        </div>
        <div>
          <h4 className="font-semibold text-base mb-2">Зворотній зв’язок</h4>
          <p>Ми завжди відкриті до ваших побажань і відгуків.</p>
          <p>
            Якщо у вас виникли питання, телефонуйте на цей номер +380 (61)
            228-75-08
          </p>
        </div>
      </div>
      <div className="text-center text-xs text-gray-300 mt-6">
        &copy; {new Date().getFullYear()} Restaurant. Усі права захищено.
      </div>
    </footer>
  );
};

export default Footer;
