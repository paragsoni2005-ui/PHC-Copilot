"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import { useSettings } from "@/hooks/useSettings";
import {
  Save,
  RotateCcw,
  Key,
  User,
  Shield,
  CheckCircle2,
  RefreshCw,
  AlertTriangle
} from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { settings, loading, testingConnection, testResult, updateSettings, testConnection, clearTestResult } = useSettings();
  const [apiKey, setApiKey] = useState("");
  const [mode, setMode] = useState<'mock' | 'live'>("mock");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isDemoReset, setIsDemoReset] = useState(false);

  // Sync state when hook loaded
  useEffect(() => {
    if (!loading) {
      setApiKey(settings.apiKey);
      setMode(settings.mode);
    }
  }, [settings, loading]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings({ mode, apiKey });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 3000);
  };

  const handleTestConnection = async () => {
    await testConnection(apiKey);
  };

  const handleResetDemo = () => {
    localStorage.removeItem("phc_first_visit_complete");
    localStorage.removeItem("phc_checklist");
    localStorage.removeItem("phc_medicines");
    localStorage.removeItem("phc_doctors");
    localStorage.removeItem("phc_settings");
    setIsDemoReset(true);
    setTimeout(() => {
      router.push("/");
    }, 800);
  };

  return (
    <AppShell>
      <div className="settings-layout animate-fade-in">
        
        {/* Profile Card */}
        <section className="settings-card glass-container">
          <div className="card-header">
            <User size={18} className="header-icon" />
            <h3>Doctor Profile</h3>
          </div>
          <div className="profile-details-grid">
            <div className="profile-large-avatar flex-center">
              <User size={40} className="avatar-svg" />
            </div>
            <div className="profile-text-fields">
              <p className="field-label">Full Name</p>
              <p className="field-value">Dr. Sarah Johnson</p>
              
              <p className="field-label">Designation</p>
              <p className="field-value">Chief Medical Officer</p>

              <p className="field-label">Primary Health Centre</p>
              <p className="field-value">PHC Central District (Level 2)</p>
            </div>
          </div>
        </section>

        {/* API Key Configuration Form */}
        <section className="settings-card glass-container">
          <div className="card-header">
            <Key size={18} className="header-icon" />
            <h3>API Configuration</h3>
          </div>
          <form onSubmit={handleSaveSettings} className="settings-form">
            <div className="form-group">
              <label htmlFor="api-mode">Intelligence Provider Mode</label>
              <p className="form-help-text">
                Select between fully simulated offline mock briefings or connecting to Google Cloud Gemini API for real-time live synthesis.
              </p>
              <select
                id="api-mode"
                value={mode}
                onChange={(e) => {
                  setMode(e.target.value as 'mock' | 'live');
                  clearTestResult();
                }}
                className="settings-input"
                style={{ padding: '8px 12px' }}
              >
                <option value="mock">Local Simulator (Offline Mode)</option>
                <option value="live">Google Gemini Live (API Mode)</option>
              </select>
            </div>

            {mode === 'live' && (
              <div className="form-group animate-slide-down">
                <label htmlFor="gemini-key">Google Gemini API Key</label>
                <p className="form-help-text">
                  Input your Gemini Developer API key to generate operations summaries and restock instructions. Stored securely on client storage.
                </p>
                <div className="input-with-icon" style={{ display: 'flex', gap: '8px' }}>
                  <input
                    id="gemini-key"
                    type="password"
                    placeholder="Enter API Key (AIzaSy...)"
                    value={apiKey}
                    onChange={(e) => {
                      setApiKey(e.target.value);
                      clearTestResult();
                    }}
                    className="settings-input"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={testingConnection || !apiKey}
                    className="btn-secondary flex-center gap-2"
                    style={{ minWidth: '150px' }}
                  >
                    {testingConnection ? (
                      <RefreshCw size={16} className="spin-icon" />
                    ) : (
                      <span>Test Connection</span>
                    )}
                  </button>
                </div>

                {testResult && (
                  <div className={`connection-result-badge ${testResult.success ? "text-success" : "text-danger"}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 600, marginTop: '4px' }}>
                    {testResult.success ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                    <span>{testResult.message}</span>
                  </div>
                )}
              </div>
            )}

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                <Save size={16} />
                <span>Save Settings</span>
              </button>

              {savedSuccess && (
                <div className="save-status-success">
                  <CheckCircle2 size={16} />
                  <span>Configured Successfully</span>
                </div>
              )}
            </div>
          </form>
        </section>

        {/* Demo Operations (Reset Onboarding) */}
        <section className="settings-card glass-container">
          <div className="card-header">
            <Shield size={18} className="header-icon" />
            <h3>Demo Operations</h3>
          </div>
          <div className="demo-panel">
            <p className="form-help-text">
              Reset the onboarding and splash screen flags to test the application presentation flow from the beginning (ideal for presentation loops).
            </p>
            <button className="btn-secondary btn-danger" onClick={handleResetDemo}>
              <RotateCcw size={16} />
              <span>{isDemoReset ? "Resetting..." : "Reset Onboarding Presentation"}</span>
            </button>
          </div>
        </section>

      </div>

      <style jsx>{`
        .settings-layout {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-space-6);
          max-width: 800px;
          margin: 0 auto;
        }

        .settings-card {
          padding: var(--spacing-space-6);
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-space-2);
          border-bottom: 1px solid var(--color-border-subtle);
          padding-bottom: var(--spacing-space-3);
          margin-bottom: var(--spacing-space-4);
        }

        .header-icon {
          color: var(--color-secondary);
        }

        .card-header h3 {
          font-size: 1.125rem;
          font-weight: 700;
        }

        /* Profile details */
        .profile-details-grid {
          display: flex;
          gap: var(--spacing-space-6);
          align-items: center;
        }

        .profile-large-avatar {
          width: 80px;
          height: 80px;
          border-radius: var(--rounded-full);
          background-color: var(--color-primary-container);
          color: var(--color-on-primary-container);
          border: 2px solid var(--color-border-subtle);
        }

        .avatar-svg {
          opacity: 0.8;
        }

        .profile-text-fields {
          display: grid;
          grid-template-columns: 180px 1fr;
          row-gap: var(--spacing-space-2);
          column-gap: var(--spacing-space-4);
        }

        .field-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-outline);
        }

        .field-value {
          font-size: 0.875rem;
          color: var(--color-on-surface);
          font-weight: 500;
        }

        /* Forms styling */
        .settings-form {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-space-4);
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-space-2);
        }

        .form-group label {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-primary);
        }

        .form-help-text {
          font-size: 0.85rem;
          color: var(--color-on-surface-variant);
          line-height: 1.5;
          margin-bottom: var(--spacing-space-2);
        }

        .settings-input {
          width: 100%;
          padding: var(--spacing-space-2) var(--spacing-space-4);
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--rounded-default);
          background-color: var(--color-surface-container-lowest);
          color: var(--color-on-surface);
          transition: border-color 0.2s ease;
        }

        .settings-input:focus {
          border-color: var(--color-secondary);
        }

        .form-actions {
          display: flex;
          align-items: center;
          gap: var(--spacing-space-4);
          margin-top: var(--spacing-space-2);
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: var(--spacing-space-2);
          background-color: var(--color-primary);
          color: var(--color-on-primary);
          padding: var(--spacing-space-2) var(--spacing-space-6);
          border-radius: var(--rounded-default);
          font-size: 0.875rem;
          font-weight: 600;
          box-shadow: 0 4px 10px rgba(9, 20, 38, 0.1);
        }

        .btn-primary:hover {
          background-color: var(--color-primary-container);
          transform: translateY(-1px);
        }

        .save-status-success {
          display: inline-flex;
          align-items: center;
          gap: var(--spacing-space-1);
          color: var(--color-status-success);
          font-size: 0.875rem;
          font-weight: 600;
        }

        /* Demo panel */
        .demo-panel {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: var(--spacing-space-4);
        }

        .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: var(--spacing-space-2);
          border: 1px solid var(--color-outline-variant);
          padding: var(--spacing-space-2) var(--spacing-space-4);
          border-radius: var(--rounded-default);
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-on-surface);
          background: #ffffff;
        }

        .btn-secondary:hover {
          background-color: var(--color-surface-container-low);
        }

        .btn-danger:hover {
          color: var(--color-status-error);
          border-color: var(--color-status-error);
          background-color: rgba(239, 68, 68, 0.05);
        }

        @media (max-width: 768px) {
          .profile-details-grid {
            flex-direction: column;
            align-items: flex-start;
          }

          .profile-text-fields {
            grid-template-columns: 1fr;
            row-gap: 2px;
          }
        }
      `}</style>
    </AppShell>
  );
}
