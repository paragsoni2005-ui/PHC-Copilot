"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast container floating overlay */}
      <div className="toast-container">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`toast-card toast-${t.type}`}
            >
              <div className="toast-content">
                {t.type === "success" && <CheckCircle size={18} className="toast-icon text-teal" />}
                {t.type === "error" && <AlertCircle size={18} className="toast-icon text-red" />}
                {t.type === "info" && <Info size={18} className="toast-icon text-blue" />}
                <span className="toast-message">{t.message}</span>
              </div>
              <button className="toast-close" onClick={() => removeToast(t.id)}>
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        .toast-container {
          position: fixed;
          top: 80px;
          right: 24px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          z-index: 9999;
          pointer-events: none;
          max-width: 380px;
          width: calc(100vw - 48px);
        }

        .toast-card {
          pointer-events: auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          border-radius: var(--rounded-default);
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid var(--color-border-subtle);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
          gap: 12px;
        }

        .toast-content {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .toast-icon.text-teal { color: var(--color-clinical-teal); }
        .toast-icon.text-red { color: var(--color-error); }
        .toast-icon.text-blue { color: var(--color-secondary); }

        .toast-message {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--color-primary);
          line-height: 1.4;
        }

        .toast-close {
          color: var(--color-outline);
          opacity: 0.6;
          transition: opacity 0.2s;
        }

        .toast-close:hover {
          opacity: 1;
        }

        .toast-success {
          border-left: 4px solid var(--color-clinical-teal);
        }
        .toast-error {
          border-left: 4px solid var(--color-error);
        }
        .toast-info {
          border-left: 4px solid var(--color-secondary);
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
