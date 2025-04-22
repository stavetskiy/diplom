import React from "react";

const BaseModal = ({ isOpen = true, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-2xl shadow-xl max-w-lg w-[90%] transition-all duration-300"
        onClick={(e) => e.stopPropagation()} // Не закриває при кліку всередині
      >
        {children}
      </div>
    </div>
  );
};

export default BaseModal;
