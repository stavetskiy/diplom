import React from "react";

const Footer = () => {
  return (
    <footer className="bg-blue-600 text-white text-center p-6">
      <p>Контактна інформація:</p>
      <p>Адреса: вул. Прикладна, 123, Київ</p>
      <p>Телефон: +38 (098) 123-45-67</p>
      <p>Email: info@restaurant.com</p>
      <div className="mt-4 text-sm">
        Тут може бути зворотній зв’язок або інша корисна інформація для
        користувачів
      </div>
    </footer>
  );
};

export default Footer;
