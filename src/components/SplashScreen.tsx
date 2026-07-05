"use client";

import React, { useEffect, useState } from "react";

interface SplashScreenProps {
  onFinished: () => void;
}

export default function SplashScreen({ onFinished }: SplashScreenProps) {
  const [fadeClass, setFadeClass] = useState("animate-fade-in");

  useEffect(() => {
    // 1.8 seconds of full show, then trigger fade out
    const fadeTimer = setTimeout(() => {
      setFadeClass("fade-out-animation");
    }, 1800);

    // Call onFinished callback after 2.2 seconds (fully invisible)
    const finishTimer = setTimeout(() => {
      onFinished();
    }, 2200);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinished]);

  return (
    <div className={`splash-screen-overlay ${fadeClass}`}>
      <div className="splash-content">
        {/* Emblem: Rounded Healthcare Cross + AI Spark Sparkle */}
        <div className="logo-glow-wrapper">
          <svg
            className="splash-logo"
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <radialGradient id="sparkleGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="var(--color-clinical-teal)" stopOpacity="0.4" />
                <stop offset="100%" stopColor="var(--color-clinical-teal)" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="crossGradient" x1="0" y1="0" x2="120" y2="120">
                <stop offset="0%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#1e293b" />
              </linearGradient>
            </defs>

            {/* Glowing background */}
            <circle cx="90" cy="30" r="28" fill="url(#sparkleGlow)" />

            {/* Rounded Cross */}
            <path
              d="M38 12C38 8.68629 40.6863 6 44 6H76C79.3137 6 82 8.68629 82 12V38H108C111.314 38 114 40.6863 114 44V76C114 79.3137 111.314 82 108 82H82V108C82 111.314 79.3137 114 76 114H44C40.6863 114 38 111.314 38 108V82H12C8.68629 82 6 79.3137 6 76V44C6 40.6863 8.68629 38 12 38H38V12Z"
              fill="url(#crossGradient)"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="2"
            />

            {/* Sparkling Star (AI icon) centered on upper right junction */}
            <path
              d="M90 6C90 19.2548 76.7452 32.51 90 32.51C90 45.765 103.255 32.51 90 32.51C90 19.2548 103.255 6 90 6Z"
              fill="var(--color-clinical-teal)"
            />
            <path
              d="M90 12C90 22 80 32.5 90 32.5C90 42.5 100 32.5 90 32.5C90 22.5 100 12 90 12Z"
              fill="#38bdf8"
            />
          </svg>
        </div>

        <h1 className="splash-title">PHC Copilot</h1>
        <p className="splash-subtitle">AI-Powered Healthcare Operations</p>
      </div>

      <div className="splash-footer">
        <p className="splash-vendor">Powered by Google Cloud & Gemini</p>
      </div>

      <style jsx global>{`
        .splash-screen-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: var(--color-surface);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding: var(--spacing-space-12) var(--spacing-margin-page);
          z-index: 9999;
          transition: opacity 0.4s ease;
        }

        .splash-content {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .logo-glow-wrapper {
          position: relative;
          margin-bottom: var(--spacing-space-6);
        }

        .splash-logo {
          filter: drop-shadow(0 10px 25px rgba(0, 0, 0, 0.08));
        }

        .splash-title {
          font-size: 2.25rem;
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: var(--spacing-space-2);
          letter-spacing: -0.02em;
        }

        .splash-subtitle {
          font-size: 1rem;
          font-weight: 500;
          color: var(--color-on-surface-variant);
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .splash-footer {
          margin-top: auto;
        }

        .splash-vendor {
          font-size: 0.75rem;
          color: var(--color-outline);
          letter-spacing: 0.02em;
        }

        .fade-out-animation {
          opacity: 0;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
