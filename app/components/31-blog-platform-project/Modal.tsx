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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="glass rounded-2xl shadow-lg max-w-lg w-full mx-auto p-6 md:p-8 relative animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-border">
          {title && (
            <h2 className="text-2xl md:text-3xl font-bold heading-gradient">
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground hover:bg-muted text-2xl leading-none transition-all duration-200 w-8 h-8 rounded-full flex items-center justify-center"
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
