"use client";

import React, { useState, useEffect } from "react";
import AppShell from "@/components/AppShell";
import { useDoctors } from "@/hooks/useDoctors";
import { Users, UserCheck, UserX, AlertTriangle, Sparkles, Phone, RefreshCw } from "lucide-react";

export default function AttendancePage() {
  const { doctors, stats, absentDoctors, toggleAttendance, getAIStaffingImpact, loading } = useDoctors();
  const [impactLoading, setImpactLoading] = useState(false);
  const [impactData, setImpactData] = useState<{
    waitTimeIncrease: number;
    riskAreas: string;
    recommendations: string[];
    fallback: boolean;
  } | null>(null);

  useEffect(() => {
    if (absentDoctors.length > 0) {
      Promise.resolve().then(() => {
        setImpactLoading(true);
      });
      getAIStaffingImpact(absentDoctors).then((res) => {
        setImpactData(res);
        setImpactLoading(false);
      });
    } else {
      Promise.resolve().then(() => {
        setImpactData(null);
      });
    }
  }, [absentDoctors, getAIStaffingImpact]);

  if (loading) {
    return (
      <AppShell>
        <div className="attendance-container animate-fade-in flex-center" style={{ minHeight: '400px', flexDirection: 'column' }}>
          <RefreshCw size={24} className="spin-icon text-clinical-teal" />
          <p style={{ marginTop: '12px', color: 'var(--color-outline)' }}>Loading doctor roster...</p>
        </div>
      </AppShell>
    );
  }

  const absentDocsList = absentDoctors;

  return (
    <AppShell>
      <div className="attendance-container animate-fade-in">
        {/* Header */}
        <div className="page-header">
          <div className="header-meta">
            <h1 className="page-title">Doctor Attendance</h1>
            <p className="page-subtitle">Track roster check-ins, department coverage metrics, and staffing alerts.</p>
          </div>
        </div>

        {/* Stats Summary Row */}
        <section className="stats-summary-row">
          <div className="summary-card glass-container">
            <span className="card-icon status-ok"><UserCheck size={20} /></span>
            <div className="summary-info">
              <span className="summary-label">Doctors Present</span>
              <span className="summary-value">{stats.presentCount} / {stats.total}</span>
            </div>
          </div>
          <div className="summary-card glass-container">
            <span className="card-icon status-err"><UserX size={20} /></span>
            <div className="summary-info">
              <span className="summary-label">Absent / On Leave</span>
              <span className="summary-value">{stats.absentCount + stats.leaveCount}</span>
            </div>
          </div>
          <div className="summary-card glass-container">
            <span className="card-icon status-info"><Users size={20} /></span>
            <div className="summary-info">
              <span className="summary-label">Total Coverage</span>
              <span className="summary-value">{stats.coveragePercent}%</span>
            </div>
          </div>
        </section>

        {/* AI Impact Card */}
        {absentDoctors.length > 0 && (
          <section className="ai-impact-section glass-container glow-pulsing-subtle">
            <div className="ai-impact-header">
              <Sparkles size={18} className="text-clinical-teal" />
              <h2 className="ai-impact-title">AI Operational Staffing Impact</h2>
            </div>

            {impactLoading ? (
              <div className="flex-center flex-col" style={{ padding: '30px 0', gap: '8px' }}>
                <RefreshCw size={20} className="spin-icon text-clinical-teal" />
                <p className="text-outline" style={{ fontSize: '0.8rem' }}>Gemini is projecting roster wait-times...</p>
              </div>
            ) : impactData ? (
              <>
                <div className="impact-grid">
                  <div className="impact-item">
                    <span className="impact-label">Estimated Wait Time Increase:</span>
                    <span className="impact-value text-err font-semibold">
                      +{impactData.waitTimeIncrease} Minutes
                    </span>
                  </div>
                  <div className="impact-item">
                    <span className="impact-label">Primary Risk Areas:</span>
                    <span className="impact-value font-semibold text-warning">
                      {impactData.riskAreas}
                    </span>
                  </div>
                </div>

                {impactData.fallback && (
                  <div className="fallback-warning-badge flex-center gap-1 text-warning font-semibold text-body-xs" style={{ display: 'inline-flex', background: 'rgba(217, 119, 6, 0.1)', border: '1px solid rgba(217, 119, 6, 0.3)', padding: '6px 12px', borderRadius: '4px', margin: '8px 0', width: '100%', boxSizing: 'border-box' }}>
                    <AlertTriangle size={12} />
                    <span>Live API offline. Showing simulated roster impact parameters.</span>
                  </div>
                )}

                <div className="allocation-recommendations bg-teal-container">
                  {impactData.recommendations.map((rec, idx) => (
                    <div key={idx} className="rec-bullet">
                      <span className="bullet-dot"></span>
                      <p className="rec-text text-body-sm">{rec}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-outline">Failed to calculate operational impact.</p>
            )}
          </section>
        )}

        {/* Doctor Roster Grid */}
        <section className="roster-section">
          <h2 className="section-title">Active Roster List</h2>
          <div className="roster-grid">
            {doctors.map((doc) => {
              const statusClass = `status-${doc.status}`;
              const formattedStatus = doc.status.replace("_", " ").toUpperCase();

              return (
                <div key={doc.id} className="doctor-card glass-container">
                  <div className="doc-card-header">
                    <div className="doc-meta">
                      <h3 className="doc-name">{doc.name}</h3>
                      <p className="doc-dept">{doc.department} • {doc.specialty}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleAttendance(doc.id)}
                      className={`status-chip ${statusClass}`}
                      title="Click to toggle Present/Absent"
                      style={{ border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                      {formattedStatus}
                    </button>
                  </div>

                  <div className="doc-card-body">
                    <div className="info-row">
                      <span className="info-label">Assigned Shift:</span>
                      <span className="info-value capitalized">{doc.shift}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Contact:</span>
                      <span className="info-value flex-center gap-1">
                        <Phone size={12} className="text-outline" />
                        <span>{doc.contact}</span>
                      </span>
                    </div>
                  </div>

                  <div className="doc-card-footer">
                    <button
                      className="btn-text-action"
                      onClick={() => alert(`Dialing ${doc.name} at ${doc.contact}...`)}
                    >
                      Contact Doctor
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <style jsx global>{`
        .attendance-container {
          padding: var(--spacing-space-6) var(--spacing-space-8);
          max-width: 1200px;
          margin: 0 auto;
        }

        .page-header {
          margin-bottom: var(--spacing-space-6);
        }

        .page-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--color-primary);
          letter-spacing: -0.02em;
        }

        .page-subtitle {
          font-size: 0.875rem;
          color: var(--color-on-surface-variant);
          margin-top: var(--spacing-space-1);
        }

        /* Summary Cards Row */
        .stats-summary-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-space-4);
          margin-bottom: var(--spacing-space-6);
        }

        .summary-card {
          display: flex;
          align-items: center;
          gap: var(--spacing-space-4);
          padding: var(--spacing-space-4);
        }

        .card-icon {
          width: 44px;
          height: 44px;
          border-radius: var(--rounded-full);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .status-ok {
          background-color: var(--color-success-container);
          color: var(--color-on-success-container);
        }

        .status-err {
          background-color: var(--color-error-container);
          color: var(--color-on-error-container);
        }

        .status-info {
          background-color: var(--color-primary-container);
          color: var(--color-on-primary-container);
        }

        .summary-info {
          display: flex;
          flex-direction: column;
        }

        .summary-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--color-outline);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .summary-value {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-on-surface);
        }

        /* AI Impact Section */
        .ai-impact-section {
          padding: var(--spacing-space-6);
          margin-bottom: var(--spacing-space-6);
        }

        .ai-impact-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-space-2);
          margin-bottom: var(--spacing-space-4);
          border-bottom: 1px solid var(--color-border-subtle);
          padding-bottom: var(--spacing-space-2);
        }

        .ai-impact-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--color-on-surface);
        }

        .impact-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--spacing-space-4);
          margin-bottom: var(--spacing-space-4);
        }

        .impact-item {
          display: flex;
          flex-direction: column;
          font-size: 0.875rem;
        }

        .impact-label {
          color: var(--color-on-surface-variant);
          margin-bottom: 2px;
        }

        .allocation-recommendations {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-space-3);
          padding: var(--spacing-space-4);
          border-radius: var(--rounded-md);
          border-left: 4px solid var(--color-clinical-teal);
        }

        .rec-bullet {
          display: flex;
          align-items: flex-start;
          gap: var(--spacing-space-2);
        }

        .bullet-dot {
          width: 6px;
          height: 6px;
          border-radius: var(--rounded-full);
          background-color: var(--color-clinical-teal);
          margin-top: 6px;
          flex-shrink: 0;
        }

        .rec-text {
          line-height: 1.4;
        }

        /* Doctor Cards Grid */
        .section-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--color-on-surface);
          margin-bottom: var(--spacing-space-4);
        }

        .roster-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: var(--spacing-space-4);
        }

        .doctor-card {
          padding: var(--spacing-space-4);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-space-3);
        }

        .doc-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: var(--spacing-space-2);
        }

        .doc-name {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--color-on-surface);
        }

        .doc-dept {
          font-size: 0.75rem;
          color: var(--color-outline);
          margin-top: 2px;
        }

        .status-chip {
          font-size: 0.65rem;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: var(--rounded-sm);
        }

        .status-present {
          background-color: var(--color-success-container);
          color: var(--color-on-success-container);
        }

        .status-absent {
          background-color: var(--color-error-container);
          color: var(--color-on-error-container);
        }

        .status-on_leave {
          background-color: var(--color-warning-container);
          color: var(--color-on-warning-container);
        }

        .doc-card-body {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-space-2);
          border-top: 1px solid var(--color-border-subtle);
          padding-top: var(--spacing-space-2);
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.8125rem;
        }

        .info-label {
          color: var(--color-on-surface-variant);
        }

        .info-value {
          color: var(--color-on-surface);
        }

        .capitalized {
          text-transform: capitalize;
        }

        .doc-card-footer {
          margin-top: auto;
          display: flex;
          justify-content: flex-end;
          border-top: 1px solid var(--color-border-subtle);
          padding-top: var(--spacing-space-3);
        }

        .btn-text-action {
          background: none;
          border: none;
          color: var(--color-primary);
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          padding: var(--spacing-space-1) var(--spacing-space-2);
          border-radius: var(--rounded-sm);
        }

        .btn-text-action:hover {
          background: var(--color-surface-container);
        }

        @media (max-width: 768px) {
          .stats-summary-row {
            grid-template-columns: 1fr;
          }
          .impact-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </AppShell>
  );
}
