import React from "react";

const ModalWarning = ({ onClose, onContinueAsGuest, onLogin }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Увага</h2>
        <p className="mb-6">
          Ви не увійшли в систему. Щоб продовжити бронювання, увійдіть в акаунт
          або продовжіть як гість.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Скасувати
          </button>
          <button
            onClick={onContinueAsGuest}
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            Продовжити як гість
          </button>
          <button
            onClick={onLogin}
            className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
          >
            Увійти
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalWarning;
