"use client";

import React, { FC, ReactNode } from "react";

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
  isOpen: boolean;
  title?: string;
}

const Modal: FC<ModalProps> = ({ children, onClose, isOpen, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full mx-auto p-6 relative">
        <div className="flex justify-between items-center mb-4">
          {title && <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">{title}</h2>}
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-2xl leading-none"
          >
            &times;
          </button>
        </div>
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
