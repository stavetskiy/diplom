import React from "react";
import BaseModal from "../modal/BaseModal";

const ModalWarning = ({ onClose, onContinueAsGuest, onLogin }) => {
  return (
    <BaseModal onClose={onClose}>
      <h2 className="text-2xl font-bold text-red-600 mb-4 text-center">
        Увага!
      </h2>
      <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6 text-center">
        Ви не увійшли в систему. Щоб продовжити бронювання, будь ласка, увійдіть
        у свій акаунт або скористайтеся гостьовим режимом.
      </p>

      <div className="flex flex-col md:flex-row justify-center md:justify-between gap-3">
        <button
          onClick={onClose}
          className="px-5 py-2 rounded-xl bg-gray-200 text-gray-800 hover:bg-gray-300 transition text-sm font-medium"
        >
          Скасувати
        </button>
        <button
          onClick={onContinueAsGuest}
          className="px-5 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition text-sm font-semibold"
        >
          Продовжити як гість
        </button>
        <button
          onClick={onLogin}
          className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition text-sm font-semibold"
        >
          Увійти
        </button>
      </div>
    </BaseModal>
  );
};

export default ModalWarning;
