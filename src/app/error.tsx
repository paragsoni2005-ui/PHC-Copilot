"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, RefreshCw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to an analytics service
    console.error("Next.js Error Boundary caught an exception:", error);
  }, [error]);

  return (
    <div className="error-container">
      <motion.div 
        className="error-card glass-container"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="icon-badge flex-center">
          <ShieldAlert size={36} className="alert-icon" />
        </div>
        <h1 className="error-title">System Error Encountered</h1>
        <p className="error-subtitle">
          An unexpected error occurred while processing operational clinic records. Our system has automatically flagged this event.
        </p>
        <button 
          className="btn-reset flex-center gap-2"
          onClick={() => reset()}
        >
          <RefreshCw size={16} />
          <span>Try Again / Refresh System</span>
        </button>
      </motion.div>

      <style jsx>{`
        .error-container {
          min-height: 100vh;
          width: 100vw;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at 50% 50%, rgba(254, 242, 242, 0.4) 0%, rgba(247, 249, 251, 1) 90%);
          padding: 24px;
        }

        .error-card {
          max-width: 480px;
          width: 100%;
          padding: 48px 32px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.7);
        }

        .icon-badge {
          width: 80px;
          height: 80px;
          border-radius: var(--rounded-full);
          background: rgba(186, 26, 26, 0.08);
          color: var(--color-error);
          margin-bottom: 8px;
        }

        .alert-icon {
          animation: shake 0.5s ease-in-out infinite alternate;
        }

        @keyframes shake {
          0% { transform: rotate(-5deg); }
          100% { transform: rotate(5deg); }
        }

        .error-title {
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--color-primary);
          letter-spacing: -0.02em;
        }

        .error-subtitle {
          font-size: 0.95rem;
          color: var(--color-on-surface-variant);
          line-height: 1.6;
          max-width: 380px;
        }

        .btn-reset {
          background-color: var(--color-primary);
          color: var(--color-on-primary);
          padding: 12px 28px;
          border-radius: var(--rounded-default);
          font-weight: 600;
          font-size: 0.9rem;
          box-shadow: 0 4px 14px rgba(9, 20, 38, 0.3);
          border: none;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .btn-reset:hover {
          transform: translateY(-2px);
        }

        .gap-2 { gap: 8px; }
      `}</style>
    </div>
  );
}
