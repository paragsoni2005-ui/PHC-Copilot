"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Pill,
  TrendingUp,
  Users,
  Settings,
  Sparkles,
  User,
  LogOut,
  ClipboardList
} from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, loading, signOut, hasAccess } = useAuth();

  // Route protection gate - bypassed since auth is disabled
  useEffect(() => {
    // No-op redirect gate
  }, [pathname]);

  // Helper to format today's date
  const getFormattedDate = () => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date().toLocaleDateString("en-US", options);
  };

  // Construct unified navigation links for all features
  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "OPD Intake", href: "/opd-registration", icon: ClipboardList },
    { name: "Briefing", href: "/briefing", icon: Sparkles },
    { name: "Medicines", href: "/medicines", icon: Pill },
    { name: "Footfall", href: "/footfall", icon: TrendingUp },
    { name: "Attendance", href: "/attendance", icon: Users },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const profileName = "Staff";
  const profileRole = "Clinic Operations";
  const greetingHeader = pathname === "/opd-registration" ? "OPD Registration Desk" : "Good Morning, Doctor";

  return (
    <div className="app-shell-layout">
      {/* Sidebar Navigation - Desktop */}
      <aside className="app-sidebar glass-sidebar">
        <div className="sidebar-brand">
          <svg
            width="32"
            height="32"
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
          <span className="brand-text">PHC Copilot</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`nav-item ${isActive ? "nav-item-active" : ""}`}
              >
                <Icon className="nav-icon" size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
          
          {/* Sign Out Trigger */}
          <button onClick={signOut} className="nav-item btn-signout">
            <LogOut size={20} className="nav-icon" />
            <span>Sign Out</span>
          </button>
        </nav>

        {/* User Profile Footer */}
        <div className="sidebar-profile">
          <div className="profile-avatar flex-center">
            <User size={20} className="avatar-icon" />
          </div>
          <div className="profile-info">
            <p className="profile-name">{profileName}</p>
            <p className="profile-role">{profileRole}</p>
          </div>
        </div>
      </aside>

      {/* Main content viewport */}
      <div className="app-main-viewport">
        {/* Page greeting header */}
        <header className="app-header">
          <div className="greeting-wrapper">
            <h2 className="greeting-title">{greetingHeader}</h2>
            <p className="greeting-date">{getFormattedDate()}</p>
          </div>
          <div className="header-actions">
            <div className="badge-ai-status">
              <Sparkles size={14} className="status-sparkle" />
              <span>Gemini Operational</span>
            </div>
          </div>
        </header>

        {/* Content body container */}
        <main className="app-content-body">{children}</main>
      </div>

      {/* Navigation Rail - Mobile (only visible on small viewports) */}
      <nav className="app-mobile-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`mobile-nav-item ${isActive ? "mobile-nav-item-active" : ""}`}
            >
              <Icon size={20} />
              <span className="mobile-label">{item.name}</span>
            </Link>
          );
        })}
        
        {/* Mobile Sign Out */}
        <button onClick={signOut} className="mobile-nav-item btn-mobile-signout">
          <LogOut size={20} />
          <span className="mobile-label">Sign Out</span>
        </button>
      </nav>

      <style jsx global>{`
        .app-shell-layout {
          display: flex;
          min-height: 100vh;
          width: 100vw;
          position: relative;
        }

        /* Sidebar - Desktop Layout */
        .app-sidebar {
          width: var(--spacing-sidebar-width);
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          display: flex;
          flex-direction: column;
          padding: var(--spacing-space-6) var(--spacing-space-4);
          z-index: 100;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: var(--spacing-space-2);
          margin-bottom: var(--spacing-space-12);
          padding-left: var(--spacing-space-2);
        }

        .brand-text {
          font-size: 1.25rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--color-primary);
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-space-1);
          flex: 1;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-space-3);
          padding: var(--spacing-space-3) var(--spacing-space-4);
          border-radius: var(--rounded-default);
          color: var(--color-on-surface-variant);
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.2s ease;
          width: 100%;
          text-align: left;
        }

        .nav-item:hover {
          background-color: var(--color-surface-container);
          color: var(--color-primary);
        }

        .nav-item-active {
          background-color: var(--color-primary);
          color: var(--color-on-primary) !important;
          box-shadow: 0 4px 10px rgba(9, 20, 38, 0.1);
        }

        .btn-signout {
          color: var(--color-error);
          margin-top: 16px;
        }
        .btn-signout:hover {
          background-color: var(--color-error-container);
          color: var(--color-on-error-container);
        }

        .sidebar-profile {
          margin-top: auto;
          display: flex;
          align-items: center;
          gap: var(--spacing-space-3);
          padding: var(--spacing-space-3);
          border-radius: var(--rounded-md);
          background: rgba(255, 255, 255, 0.4);
          border: 1px solid var(--color-border-subtle);
        }

        .profile-avatar {
          width: 36px;
          height: 36px;
          border-radius: var(--rounded-full);
          background-color: var(--color-primary-container);
          color: var(--color-on-primary-container);
        }

        .profile-info {
          display: flex;
          flex-direction: column;
        }

        .profile-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-primary);
        }

        .profile-role {
          font-size: 0.75rem;
          color: var(--color-outline);
        }

        /* Viewport Main Panel */
        .app-main-viewport {
          flex: 1;
          margin-left: var(--spacing-sidebar-width);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          padding-bottom: 0;
        }

        .app-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--spacing-space-6) var(--spacing-margin-page);
          border-bottom: 1px solid var(--color-border-subtle);
          background-color: rgba(247, 249, 257, 0.5);
          backdrop-filter: blur(8px);
          position: sticky;
          top: 0;
          z-index: 90;
        }

        .greeting-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-primary);
        }

        .greeting-date {
          font-size: 0.875rem;
          color: var(--color-on-surface-variant);
        }

        .badge-ai-status {
          display: flex;
          align-items: center;
          gap: var(--spacing-space-1);
          background: rgba(13, 148, 136, 0.1);
          color: var(--color-clinical-teal);
          font-size: 0.75rem;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: var(--rounded-full);
          border: 1px solid rgba(13, 148, 136, 0.2);
        }

        .status-sparkle {
          animation: pulseGlow 2s infinite ease-in-out;
        }

        .app-content-body {
          flex: 1;
          padding: var(--spacing-margin-page);
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
        }

        /* Mobile bottom nav - hidden on desktop */
        .app-mobile-nav {
          display: none;
        }

        .btn-mobile-signout {
          border: none;
          background: none;
          color: var(--color-error);
        }

        /* Responsive breakpoints */
        @media (max-width: 1024px) {
          .app-sidebar {
            display: none;
          }

          .app-main-viewport {
            margin-left: 0;
            padding-bottom: 70px; /* space for bottom nav */
          }

          .app-mobile-nav {
            display: flex;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 64px;
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(12px);
            border-top: 1px solid var(--color-border-subtle);
            justify-content: space-around;
            align-items: center;
            z-index: 100;
            padding: 0 var(--spacing-space-2);
          }

          .mobile-nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: var(--color-on-surface-variant);
            font-size: 0.7rem;
            font-weight: 500;
            flex: 1;
            height: 100%;
            gap: 2px;
          }

          .mobile-nav-item-active {
            color: var(--color-secondary);
          }

          .mobile-label {
            font-size: 0.65rem;
          }
        }
      `}</style>
    </div>
  );
}
