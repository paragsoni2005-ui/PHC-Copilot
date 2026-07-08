"use client";

import React from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import { useMedicines } from "@/hooks/useMedicines";
import { useDoctors } from "@/hooks/useDoctors";
import { useFootfall } from "@/hooks/useFootfall";
import { useChecklist } from "@/hooks/useChecklist";
import {
  Sparkles,
  AlertTriangle,
  TrendingUp,
  Users,
  CheckSquare,
  ChevronRight,
  Info,
  Calendar,
  Layers,
  Activity
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  
  // Wire up state management hooks
  const { stats: medStats, rawMedicines, loading: medLoading } = useMedicines();
  const { stats: docStats, loading: docLoading } = useDoctors();
  const { forecast, loading: footLoading } = useFootfall();
  const { items: tasks, toggleItem, loading: checkLoading } = useChecklist();

  const handleGenerateBriefing = () => {
    router.push("/briefing");
  };

  // Compute live values
  const totalAlertItems = medStats.criticalCount + medStats.warningCount;
  const alertSubtitle = rawMedicines
    .filter(m => m.riskLevel === 'critical' || m.riskLevel === 'warning')
    .slice(0, 2)
    .map(m => m.name.split(" ")[0])
    .join(", ") || "All stock adequate";

  const coverageText = `${docStats.presentCount} / ${docStats.total} Present`;
  const coverageSubtitle = docStats.coveragePercent === 100 
    ? "Full staff allocation active" 
    : `${docStats.coveragePercent}% coverage rostered`;

  const checklistDoneCount = tasks.filter(t => t.completed).length;

  return (
    <AppShell>
      <div className="dashboard-layout animate-fade-in">
        
        {/* Dynamic Hero: AI Briefing Card */}
        <section className="briefing-hero glass-container glow-pulsing">
          <div className="hero-content">
            <div className="badge-ai-sparkle">
              <Sparkles size={16} className="sparkle-icon" />
              <span>AI Operational Insight</span>
            </div>
            <h1 className="hero-title">Daily Briefing & Forecast</h1>
            <p className="hero-description text-body-base">
              {forecast?.aiRecommendation || "Loading recommendations..."}
            </p>

            <div className="hero-action-row">
              <button className="btn-ai-action" onClick={handleGenerateBriefing}>
                <Sparkles size={16} />
                <span>Generate Detailed Recommendations</span>
              </button>
            </div>
          </div>
          
          <div className="hero-illustration">
            <svg viewBox="0 0 100 100" className="hero-svg">
              <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(13, 148, 136, 0.1)" strokeWidth="6" />
              <path d="M25 65 L45 40 L60 50 L80 25" fill="none" stroke="var(--color-clinical-teal)" strokeWidth="4" strokeLinecap="round" />
              <circle cx="80" cy="25" r="5" fill="var(--color-clinical-teal)" />
            </svg>
          </div>
        </section>

        {/* 4 Statistics Cards Grid */}
        <section className="stats-grid">
          
          <div className="stat-card glass-container" onClick={() => router.push("/medicines")} style={{ cursor: 'pointer' }}>
            <div className="stat-header">
              <span className="stat-icon-box status-err"><AlertTriangle size={18} /></span>
              <span className="text-label-caps">Medicine Alert</span>
            </div>
            <div className="stat-body">
              <h2 className="stat-value">{medLoading ? "..." : `${totalAlertItems} Items Low`}</h2>
              <p className="stat-sub">{medLoading ? "Calculating stock..." : alertSubtitle}</p>
            </div>
            <div className="stat-footer">
              <span>View Inventory</span>
              <ChevronRight size={14} />
            </div>
          </div>

          <div className="stat-card glass-container" onClick={() => router.push("/footfall")} style={{ cursor: 'pointer' }}>
            <div className="stat-header">
              <span className="stat-icon-box status-info"><TrendingUp size={18} /></span>
              <span className="text-label-caps">Footfall Forecast</span>
            </div>
            <div className="stat-body">
              <h2 className="stat-value">{footLoading ? "..." : `${forecast?.predictedCount || 0} Patients`}</h2>
              <p className="stat-sub">{footLoading ? "Loading forecast..." : `Risk level: ${forecast?.riskLevel}`}</p>
            </div>
            <div className="stat-footer">
              <span>Analyze Trends</span>
              <ChevronRight size={14} />
            </div>
          </div>

          <div className="stat-card glass-container" onClick={() => router.push("/attendance")} style={{ cursor: 'pointer' }}>
            <div className="stat-header">
              <span className="stat-icon-box status-ok"><Users size={18} /></span>
              <span className="text-label-caps">Doctor Attendance</span>
            </div>
            <div className="stat-body">
              <h2 className="stat-value">{docLoading ? "..." : coverageText}</h2>
              <p className="stat-sub">{docLoading ? "Syncing roster..." : coverageSubtitle}</p>
            </div>
            <div className="stat-footer">
              <span>View Roster</span>
              <ChevronRight size={14} />
            </div>
          </div>

          <div className="stat-card glass-container" onClick={() => router.push("/briefing")} style={{ cursor: 'pointer' }}>
            <div className="stat-header">
              <span className="stat-icon-box status-warn"><Activity size={18} /></span>
              <span className="text-label-caps">Operational Risk</span>
            </div>
            <div className="stat-body">
              <h2 className="stat-value">{medLoading ? "..." : medStats.criticalCount > 0 ? "High Risk" : "Normal"}</h2>
              <p className="stat-sub">{medLoading ? "Loading risks..." : medStats.criticalCount > 0 ? `${medStats.criticalCount} stockout warnings` : "Operations stable"}</p>
            </div>
            <div className="stat-footer">
              <span>View Briefing</span>
              <ChevronRight size={14} />
            </div>
          </div>

        </section>

        {/* Dynamic Panels: Timeline Alerts & Action Checklist */}
        <section className="panels-section">
          
          {/* Timeline / Live Alerts Panel */}
          <div className="panel-card glass-container">
            <div className="panel-header">
              <h3 className="panel-title">Operational Alerts</h3>
              <span className="badge-alert-count">
                {rawMedicines.filter(m => m.riskLevel === 'critical').length + (docStats.absentCount > 0 ? 1 : 0)} Active
              </span>
            </div>
            <div className="panel-body">
              {rawMedicines.filter(m => m.riskLevel === 'critical').map(m => (
                <div key={m.id} className="alert-item alert-danger">
                  <span className="alert-dot"></span>
                  <div className="alert-content">
                    <p className="alert-text"><strong>{m.name} Stock Critical:</strong> Inventory has only {m.daysRemaining} days remaining ({m.stock} units left).</p>
                    <span className="alert-time">Just updated</span>
                  </div>
                </div>
              ))}

              {docStats.absentCount > 0 && (
                <div className="alert-item alert-warning">
                  <span className="alert-dot"></span>
                  <div className="alert-content">
                    <p className="alert-text"><strong>Staff Leave/Absenteeism:</strong> {docStats.absentCount} doctor(s) rostered are currently absent/leave.</p>
                    <span className="alert-time">Roster status alert</span>
                  </div>
                </div>
              )}

              {rawMedicines.filter(m => m.riskLevel === 'warning').map(m => (
                <div key={m.id} className="alert-item alert-warning">
                  <span className="alert-dot"></span>
                  <div className="alert-content">
                    <p className="alert-text"><strong>{m.name} Stock Warning:</strong> Reorder threshold breached. Only {m.daysRemaining} days remaining.</p>
                    <span className="alert-time">Just updated</span>
                  </div>
                </div>
              ))}

              {totalAlertItems === 0 && docStats.absentCount === 0 && (
                <div className="alert-item alert-success">
                  <span className="alert-dot"></span>
                  <div className="alert-content">
                    <p className="alert-text"><strong>All Systems Clear:</strong> Medicine stocks adequate and staff fully allocated.</p>
                    <span className="alert-time">Live status</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Checklist Panel */}
          <div className="panel-card glass-container">
            <div className="panel-header">
              <h3 className="panel-title">Daily Action Checklist</h3>
              <span className="text-caption">
                {checkLoading ? "..." : `${checklistDoneCount} of ${tasks.length} done`}
              </span>
            </div>
            <div className="panel-body">
              <div className="checklist-list">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`checklist-item ${task.completed ? "checklist-item-done" : ""}`}
                    onClick={() => toggleItem(task.id)}
                  >
                    <div className="checkbox-box flex-center">
                      {task.completed && <CheckSquare size={16} className="checkbox-icon" />}
                    </div>
                    <span className="checklist-text">{task.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </section>

      </div>

      <style jsx>{`
        .dashboard-layout {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-space-6);
        }

        /* Hero Card */
        .briefing-hero {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-space-8);
          background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(224,242,254,0.4) 100%) !important;
          border: 1px solid rgba(13, 148, 136, 0.25) !important;
          position: relative;
          overflow: hidden;
        }

        .hero-content {
          max-width: 70%;
          display: flex;
          flex-direction: column;
          gap: var(--spacing-space-2);
          z-index: 10;
        }

        .badge-ai-sparkle {
          display: inline-flex;
          align-items: center;
          gap: var(--spacing-space-1);
          color: var(--color-clinical-teal);
          font-weight: 600;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .sparkle-icon {
          color: var(--color-clinical-teal);
        }

        .hero-title {
          font-size: 1.5rem;
          font-weight: 700;
          letter-spacing: -0.015em;
        }

        .hero-description {
          color: var(--color-on-surface-variant);
          line-height: 1.6;
        }

        .hero-action-row {
          margin-top: var(--spacing-space-2);
        }

        .btn-ai-action {
          display: inline-flex;
          align-items: center;
          gap: var(--spacing-space-2);
          background-color: var(--color-clinical-teal);
          color: var(--color-on-primary);
          padding: var(--spacing-space-2) var(--spacing-space-4);
          border-radius: var(--rounded-default);
          font-size: 0.875rem;
          font-weight: 600;
          box-shadow: 0 4px 10px rgba(13, 148, 136, 0.2);
        }

        .btn-ai-action:hover {
          background-color: #0b7a70;
          transform: translateY(-1px);
        }

        .briefing-action-success {
          display: inline-flex;
          align-items: center;
          gap: var(--spacing-space-2);
          color: var(--color-clinical-teal);
          font-size: 0.875rem;
          font-weight: 500;
          background: rgba(13, 148, 136, 0.05);
          padding: var(--spacing-space-2) var(--spacing-space-4);
          border-radius: var(--rounded-default);
        }

        .hero-illustration {
          width: 120px;
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-svg {
          width: 100%;
          height: 100%;
          opacity: 0.85;
        }

        /* Stats grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--spacing-gutter);
        }

        .stat-card {
          padding: var(--spacing-space-4);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 160px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
        }

        .stat-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-space-2);
          color: var(--color-outline);
        }

        .stat-icon-box {
          width: 32px;
          height: 32px;
          border-radius: var(--rounded-default);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .status-err { background: rgba(239, 68, 68, 0.1); color: var(--color-status-error); }
        .status-info { background: rgba(0, 81, 213, 0.1); color: var(--color-secondary); }
        .status-ok { background: rgba(16, 185, 129, 0.1); color: var(--color-status-success); }
        .status-warn { background: rgba(245, 158, 11, 0.1); color: var(--color-status-warning); }

        .stat-body {
          margin-top: var(--spacing-space-2);
          margin-bottom: var(--spacing-space-2);
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-primary);
        }

        .stat-sub {
          font-size: 0.8rem;
          color: var(--color-on-surface-variant);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .stat-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--color-secondary);
          border-top: 1px solid var(--color-border-subtle);
          padding-top: var(--spacing-space-2);
          cursor: pointer;
        }

        .stat-footer:hover {
          color: var(--color-primary);
        }

        /* Panel section */
        .panels-section {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--spacing-gutter);
        }

        .panel-card {
          padding: var(--spacing-space-6);
          min-height: 280px;
          display: flex;
          flex-direction: column;
        }

        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--color-border-subtle);
          padding-bottom: var(--spacing-space-3);
          margin-bottom: var(--spacing-space-4);
        }

        .panel-title {
          font-size: 1.125rem;
          font-weight: 700;
        }

        .badge-alert-count {
          font-size: 0.75rem;
          background: rgba(239, 68, 68, 0.1);
          color: var(--color-status-error);
          font-weight: 600;
          padding: 2px 8px;
          border-radius: var(--rounded-full);
        }

        .panel-body {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-space-4);
          flex: 1;
        }

        /* Alerts timeline */
        .alert-item {
          display: flex;
          gap: var(--spacing-space-3);
          padding: var(--spacing-space-2) 0;
          position: relative;
        }

        .alert-item:not(:last-child)::after {
          content: "";
          position: absolute;
          left: 5px;
          top: 20px;
          bottom: -15px;
          width: 2px;
          background-color: var(--color-border-subtle);
        }

        .alert-dot {
          width: 12px;
          height: 12px;
          border-radius: var(--rounded-full);
          margin-top: 5px;
          z-index: 2;
        }

        .alert-danger .alert-dot { background-color: var(--color-status-error); box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15); }
        .alert-warning .alert-dot { background-color: var(--color-status-warning); box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15); }
        .alert-success .alert-dot { background-color: var(--color-status-success); box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15); }

        .alert-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .alert-text {
          font-size: 0.875rem;
          line-height: 1.4;
          color: var(--color-on-surface);
        }

        .alert-time {
          font-size: 0.75rem;
          color: var(--color-outline);
        }

        /* Checklist */
        .checklist-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-space-2);
        }

        .checklist-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-space-3);
          padding: var(--spacing-space-2) var(--spacing-space-3);
          border-radius: var(--rounded-default);
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .checklist-item:hover {
          background-color: var(--color-surface-container-low);
        }

        .checkbox-box {
          width: 20px;
          height: 20px;
          border: 2px solid var(--color-outline-variant);
          border-radius: 4px;
          transition: all 0.2s ease;
          background: #ffffff;
        }

        .checklist-item-done .checkbox-box {
          background-color: var(--color-clinical-teal);
          border-color: var(--color-clinical-teal);
          color: #ffffff;
        }

        .checkbox-icon {
          color: #ffffff;
        }

        .checklist-text {
          font-size: 0.875rem;
          color: var(--color-on-surface);
          font-weight: 500;
        }

        .checklist-item-done .checklist-text {
          text-decoration: line-through;
          color: var(--color-outline);
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .panels-section {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .briefing-hero {
            flex-direction: column-reverse;
            align-items: flex-start;
            padding: var(--spacing-space-6);
            gap: var(--spacing-space-4);
          }

          .hero-content {
            max-width: 100%;
          }

          .hero-illustration {
            display: none;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </AppShell>
  );
}
