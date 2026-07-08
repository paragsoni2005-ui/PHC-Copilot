"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { LogOut } from "lucide-react";

interface ReceptionistShellProps {
  children: React.ReactNode;
}

export default function ReceptionistShell({ children }: ReceptionistShellProps) {
  const { signOut } = useAuth();
  
  return (
    <div className="receptionist-shell">
      <header className="receptionist-header">
        <div className="header-brand">
          <svg
            width="28"
            height="28"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M38 12C38 8.68629 40.6863 6 44 6H76C79.3137 6 82 8.68629 82 12V38H108C111.314 38 114 40.6863 114 44V76C114 79.3137 111.314 82 108 82H82V108C82 111.314 79.3137 114 76 114H44C40.6863 114 38 111.314 38 108V82H12C8.68629 82 6 79.3137 6 76V44C6 40.6863 8.68629 38 12 38H38V12Z"
              fill="var(--color-primary)"
            />
            <path
              d="M90 6C90 19.2548 76.7452 32.51 90 32.51C90 45.765 103.255 32.51 90 32.51C90 19.2548 103.255 6 90 6Z"
              fill="var(--color-clinical-teal)"
            />
          </svg>
          <span className="brand-text">PHC Copilot <span className="brand-badge">Receptionist</span></span>
        </div>
        <div className="header-actions">
          <Link href="/" className="btn-home">Home</Link>
          <button onClick={signOut} className="btn-signout">
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>
      
      <main className="receptionist-main">
        {children}
      </main>

      <style jsx>{`
        .receptionist-shell {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background-color: var(--color-surface-container-lowest);
        }
        
        .receptionist-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 32px;
          background: white;
          border-bottom: 1px solid var(--color-border-subtle);
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .header-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .brand-text {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--color-on-surface);
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .brand-badge {
          font-size: 0.75rem;
          background: rgba(13, 148, 136, 0.1);
          color: var(--color-clinical-teal);
          padding: 4px 10px;
          border-radius: var(--rounded-full);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .btn-home {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-on-surface-variant);
          text-decoration: none;
        }

        .btn-home:hover {
          color: var(--color-primary);
        }

        .btn-signout {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: var(--rounded-default);
          background: var(--color-surface-container);
          color: var(--color-on-surface);
          font-size: 0.875rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-signout:hover {
          background: var(--color-surface-container-high);
        }

        .receptionist-main {
          flex: 1;
          padding: 32px;
          max-width: 1600px;
          margin: 0 auto;
          width: 100%;
        }

        @media (max-width: 768px) {
          .receptionist-header {
            padding: 16px;
          }
          .receptionist-main {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
}
