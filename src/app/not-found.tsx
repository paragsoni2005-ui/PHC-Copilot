"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Stethoscope, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="notfound-container">
      <motion.div 
        className="notfound-card glass-container"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="icon-badge flex-center">
          <Stethoscope size={36} className="stethoscope-icon" />
        </div>
        <h1 className="notfound-title">404 - Page Not Found</h1>
        <p className="notfound-subtitle">
          The clinic operations record or page you are looking for does not exist or has been relocated.
        </p>
        <Link href="/dashboard" passHref legacyBehavior>
          <motion.a 
            className="btn-back flex-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowLeft size={16} />
            <span>Return to Dashboard</span>
          </motion.a>
        </Link>
      </motion.div>

      <style jsx>{`
        .notfound-container {
          min-height: 100vh;
          width: 100vw;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at 50% 50%, rgba(240, 249, 255, 0.4) 0%, rgba(247, 249, 251, 1) 90%);
          padding: 24px;
        }

        .notfound-card {
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
          background: rgba(13, 148, 136, 0.08);
          color: var(--color-clinical-teal);
          margin-bottom: 8px;
        }

        .stethoscope-icon {
          animation: float 4s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        .notfound-title {
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--color-primary);
          letter-spacing: -0.02em;
        }

        .notfound-subtitle {
          font-size: 0.95rem;
          color: var(--color-on-surface-variant);
          line-height: 1.6;
          max-width: 380px;
        }

        .btn-back {
          background-color: var(--color-clinical-teal);
          color: var(--color-on-primary);
          padding: 12px 28px;
          border-radius: var(--rounded-default);
          font-weight: 600;
          font-size: 0.9rem;
          box-shadow: 0 4px 14px rgba(13, 148, 136, 0.3);
          border: none;
          cursor: pointer;
          text-decoration: none;
        }

        .gap-2 { gap: 8px; }
      `}</style>
    </div>
  );
}
