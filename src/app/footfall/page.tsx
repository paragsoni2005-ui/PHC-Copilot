"use client";

import React, { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { useFootfall } from "@/hooks/useFootfall";
import {
  TrendingUp,
  Clock,
  AlertTriangle,
  Sparkles,
  BarChart2,
  LineChart as LineIcon,
  Calendar,
  RefreshCw
} from "lucide-react";

// Dynamically import recharts components on client-side
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ReferenceLine,
} from "recharts";

export default function FootfallPage() {
  const [mounted, setMounted] = useState(false);
  const { historicalData, departmentData, hourlyLoad, forecast, loading } = useFootfall();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (loading) {
    return (
      <AppShell>
        <div className="footfall-container animate-fade-in flex-center" style={{ minHeight: '400px', flexDirection: 'column' }}>
          <RefreshCw size={24} className="spin-icon text-clinical-teal" />
          <p style={{ marginTop: '12px', color: 'var(--color-outline)' }}>Loading analytics data...</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="footfall-container animate-fade-in">
        {/* Header Section */}
        <div className="page-header">
          <div className="header-meta">
            <h1 className="page-title">Patient Analytics</h1>
            <p className="page-subtitle">Track patient attendance trends, hourly workloads, and load forecasting.</p>
          </div>
        </div>

        {/* Prediction Hero Panel */}
        {forecast && (
          <section className="forecast-section glass-container glow-pulsing-subtle">
            <div className="forecast-content">
              <div className="badge-ai-sparkle">
                <Sparkles size={16} className="sparkle-icon" />
                <span>Gemini Operational Forecast</span>
              </div>
              <h2 className="forecast-title">OPD Surge Prediction (Tomorrow)</h2>

              <div className="forecast-metrics-row">
                <div className="metric-item">
                  <span className="metric-label">Predicted Patients</span>
                  <span className="metric-value text-primary">{forecast.predictedCount}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Expected Peak</span>
                  <span className="metric-value text-clinical-teal flex-center gap-1">
                    <Clock size={20} />
                    <span>{forecast.peakTime}</span>
                  </span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Operational Risk</span>
                  <span className={`metric-badge risk-${forecast.riskLevel}`}>
                    {forecast.riskLevel.toUpperCase()}
                  </span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Forecast Confidence</span>
                  <span className="metric-value flex-center gap-1">
                    <span>{forecast.confidenceScore ?? 0}%</span>
                  </span>
                </div>
              </div>

              <div className="forecast-recommendation bg-teal-container">
                <span className="rec-icon-box"><AlertTriangle size={16} /></span>
                <p className="rec-text text-body-sm">
                  <strong>AI Action recommendation:</strong> {forecast.aiRecommendation}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Charts Grid */}
        <section className="charts-grid">
          {/* Daily Patient count (Line Chart) */}
          <div className="chart-card glass-container">
            <div className="chart-header">
              <div className="chart-title-box">
                <LineIcon size={18} className="text-primary" />
                <h3 className="chart-title">Daily OPD Patients (Last 7 Days)</h3>
              </div>
            </div>
            <div className="chart-body">
              {mounted ? (
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={historicalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                    <XAxis dataKey="date" stroke="var(--color-outline)" fontSize={11} tickLine={false} />
                    <YAxis stroke="var(--color-outline)" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(255, 255, 255, 0.95)",
                        borderRadius: "8px",
                        border: "1px solid var(--color-border-subtle)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="patients"
                      stroke="var(--color-primary)"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "var(--color-primary)", strokeWidth: 0 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="chart-placeholder flex-center">Loading Chart...</div>
              )}
            </div>
          </div>

          {/* Department breakdown (Bar Chart) */}
          <div className="chart-card glass-container">
            <div className="chart-header">
              <div className="chart-title-box">
                <BarChart2 size={18} className="text-clinical-teal" />
                <h3 className="chart-title">Patient Volumes by Department</h3>
              </div>
            </div>
            <div className="chart-body">
              {mounted ? (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={departmentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                    <XAxis dataKey="name" stroke="var(--color-outline)" fontSize={11} tickLine={false} />
                    <YAxis stroke="var(--color-outline)" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(255, 255, 255, 0.95)",
                        borderRadius: "8px",
                        border: "1px solid var(--color-border-subtle)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      }}
                    />
                    <Bar dataKey="patients" radius={[6, 6, 0, 0]}>
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="chart-placeholder flex-center">Loading Chart...</div>
              )}
            </div>
          </div>

          {/* Peak hour workload area chart (Area Chart) */}
          <div className="chart-card glass-container span-cols-2">
            <div className="chart-header">
              <div className="chart-title-box">
                <Clock size={18} className="text-warning" />
                <h3 className="chart-title">Hourly Workload & Capacity Limits</h3>
              </div>
            </div>
            <div className="chart-body">
              {mounted ? (
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={hourlyLoad} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-clinical-teal)" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="var(--color-clinical-teal)" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                    <XAxis dataKey="time" stroke="var(--color-outline)" fontSize={11} tickLine={false} />
                    <YAxis stroke="var(--color-outline)" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(255, 255, 255, 0.95)",
                        borderRadius: "8px",
                        border: "1px solid var(--color-border-subtle)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      }}
                    />
                    <ReferenceLine y={40} stroke="var(--color-error)" strokeDasharray="5 5" label={{ value: "Max Capacity (40)", fill: "var(--color-error)", position: "top", fontSize: 10 }} />
                    <Area
                      type="monotone"
                      dataKey="load"
                      stroke="var(--color-clinical-teal)"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorLoad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="chart-placeholder flex-center">Loading Chart...</div>
              )}
            </div>
          </div>
        </section>
      </div>

      <style jsx global>{`
        .footfall-container {
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

        /* Forecast Card Panel */
        .forecast-section {
          padding: var(--spacing-space-6);
          margin-bottom: var(--spacing-space-6);
        }

        .forecast-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-on-surface);
          margin-bottom: var(--spacing-space-4);
        }

        .forecast-metrics-row {
          display: flex;
          gap: var(--spacing-space-8);
          margin-bottom: var(--spacing-space-5);
          flex-wrap: wrap;
        }

        .metric-item {
          display: flex;
          flex-direction: column;
          min-width: 180px;
        }

        .metric-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--color-outline);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 6px;
        }

        .metric-value {
          font-size: 2.25rem;
          font-weight: 700;
          line-height: 1;
        }

        .metric-change {
          font-size: 0.75rem;
          font-weight: 600;
          margin-top: 4px;
        }

        .metric-badge {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: var(--rounded-sm);
          text-align: center;
          width: fit-content;
          margin-top: 4px;
        }

        .risk-high {
          background-color: var(--color-error-container);
          color: var(--color-on-error-container);
        }

        .risk-moderate {
          background-color: var(--color-warning-container);
          color: var(--color-on-warning-container);
        }

        .risk-low {
          background-color: var(--color-success-container);
          color: var(--color-on-success-container);
        }

        .forecast-recommendation {
          display: flex;
          align-items: flex-start;
          gap: var(--spacing-space-3);
          padding: var(--spacing-space-4);
          border-radius: var(--rounded-md);
          border-left: 4px solid var(--color-clinical-teal);
        }

        .bg-teal-container {
          background-color: rgba(13, 148, 136, 0.08);
          color: var(--color-primary);
          border: 1px solid rgba(13, 148, 136, 0.15);
          border-left: 4px solid var(--color-clinical-teal);
        }

        .rec-icon-box {
          color: var(--color-clinical-teal);
          margin-top: 2px;
        }

        .rec-text {
          line-height: 1.5;
          color: var(--color-primary);
        }

        /* Charts Section */
        .charts-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--spacing-space-6);
        }

        .chart-card {
          padding: var(--spacing-space-4);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-space-4);
        }

        .span-cols-2 {
          grid-column: span 2;
        }

        .chart-header {
          border-bottom: 1px solid var(--color-border-subtle);
          padding-bottom: var(--spacing-space-3);
        }

        .chart-title-box {
          display: flex;
          align-items: center;
          gap: var(--spacing-space-2);
        }

        .chart-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--color-on-surface);
        }

        .chart-placeholder {
          height: 260px;
          color: var(--color-outline);
          font-size: 0.875rem;
        }

        @media (max-width: 768px) {
          .charts-grid {
            grid-template-columns: 1fr;
          }
          .span-cols-2 {
            grid-column: span 1;
          }
        }
      `}</style>
    </AppShell>
  );
}
