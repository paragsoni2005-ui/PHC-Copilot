"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SplashScreen from "@/components/SplashScreen";

export default function RootPage() {
  const [showSplash, setShowSplash] = useState(true);
  const router = useRouter();

  const handleSplashFinished = () => {
    setShowSplash(false);
  };

  useEffect(() => {
    // Once splash is finished, determine where to redirect
    if (!showSplash) {
      const isFirstVisitComplete = localStorage.getItem("phc_first_visit_complete");
      if (isFirstVisitComplete === "true") {
        router.push("/dashboard");
      } else {
        router.push("/onboarding");
      }
    }
  }, [showSplash, router]);

  // Keep rendering splash screen while loading
  if (showSplash) {
    return <SplashScreen onFinished={handleSplashFinished} />;
  }

  // Render a blank loader during actual redirection transition
  return (
    <div className="redirect-loading flex-center">
      <div className="spinner"></div>
      <style jsx>{`
        .redirect-loading {
          min-height: 100vh;
          width: 100vw;
          background-color: var(--color-background);
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid var(--color-border-subtle);
          border-top-color: var(--color-clinical-teal);
          border-radius: var(--rounded-full);
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
