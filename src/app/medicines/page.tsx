"use client";

import React, { useState } from "react";
import AppShell from "@/components/AppShell";
import { mockMedicines } from "@/mocks/medicines";
import { Medicine } from "@/types/store";
import { Search, Filter, AlertTriangle, Sparkles, RefreshCw, X, Plus } from "lucide-react";

export default function MedicinesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedMed, setSelectedMed] = useState<Medicine | null>(null);

  // Filter medicines list based on search and status dropdown
  const filteredMedicines = mockMedicines.filter((med) => {
    const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      statusFilter === "all" || med.riskLevel === statusFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <AppShell>
      <div className="medicines-container animate-fade-in">
        {/* Header section with count */}
        <div className="page-header">
          <div className="header-meta">
            <h1 className="page-title">Medicine Inventory</h1>
            <p className="page-subtitle">Monitor stock levels, daily rates, and predictive stockout thresholds.</p>
          </div>
          <button className="btn-primary flex-center gap-2">
            <Plus size={16} />
            <span>Add Medicine</span>
          </button>
        </div>

        {/* Search and Filters Toolbar */}
        <section className="toolbar-section glass-container">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search medicines by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-box">
            <Filter size={16} className="filter-icon" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Statuses</option>
              <option value="critical">🔴 Critical (&lt; 3 days)</option>
              <option value="warning">🟡 Warning (3-7 days)</option>
              <option value="safe">🟢 Safe (&gt; 7 days)</option>
            </select>
          </div>
        </section>

        {/* Medicines Stock Cards Grid */}
        {filteredMedicines.length > 0 ? (
          <section className="medicines-grid">
            {filteredMedicines.map((med) => {
              const days = med.daysRemaining.toFixed(1);
              const statusClass = `status-${med.riskLevel}`;

              return (
                <div key={med.id} className="medicine-card glass-container">
                  <div className="card-top">
                    <div>
                      <h3 className="med-name">{med.name}</h3>
                      <p className="med-dosage">{med.dosageForm}</p>
                    </div>
                    <span className={`status-badge ${statusClass}`}>
                      {med.riskLevel.toUpperCase()}
                    </span>
                  </div>

                  <div className="med-details">
                    <div className="detail-row">
                      <span className="detail-label">Current Stock:</span>
                      <span className="detail-value">{med.stock} units</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Daily Consumption:</span>
                      <span className="detail-value">{med.dailyUsage}/day</span>
                    </div>
                    <div className="detail-row highlight-row">
                      <span className="detail-label">Est. Supply Left:</span>
                      <span className="detail-value font-semibold">{days} Days</span>
                    </div>
                  </div>

                  <div className="card-actions">
                    <button
                      className="btn-card-ai"
                      onClick={() => setSelectedMed(med)}
                    >
                      <Sparkles size={14} />
                      <span>AI Reorder Prediction</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </section>
        ) : (
          <div className="empty-state glass-container flex-center">
            <p className="empty-text">No medicines found matching the criteria.</p>
          </div>
        )}

        {/* AI Prediction Modal */}
        {selectedMed && (
          <div className="modal-overlay flex-center">
            <div className="modal-content glass-container animate-scale-up">
              <div className="modal-header">
                <div className="modal-title-wrapper">
                  <Sparkles size={20} className="text-clinical-teal" />
                  <h2 className="modal-title">AI Reorder Analysis</h2>
                </div>
                <button
                  onClick={() => setSelectedMed(null)}
                  className="btn-modal-close"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="modal-body">
                <h3 className="modal-med-name">{selectedMed.name}</h3>
                <p className="modal-med-dosage">{selectedMed.dosageForm}</p>

                <div className="modal-stats-grid">
                  <div className="m-stat-box">
                    <span className="m-stat-label">Stockout Risk</span>
                    <span className={`m-stat-value risk-${selectedMed.riskLevel}`}>
                      {selectedMed.riskLevel.toUpperCase()}
                    </span>
                  </div>
                  <div className="m-stat-box">
                    <span className="m-stat-label">Days Left</span>
                    <span className="m-stat-value">{selectedMed.daysRemaining.toFixed(1)} Days</span>
                  </div>
                  <div className="m-stat-box">
                    <span className="m-stat-label">Confidence Score</span>
                    <span className="m-stat-value text-clinical-teal">94%</span>
                  </div>
                </div>

                <div className="recommendation-panel">
                  <h4 className="rec-title">AI Recommendation</h4>
                  <p className="rec-text text-body-sm">
                    Reorder **{Math.max(selectedMed.reorderLevel - selectedMed.stock + 100, 150)} units** immediately. Based on daily consumption rates of {selectedMed.dailyUsage} units, a delivery delay exceeding 48 hours will result in a complete stockout. Recommended purchase order date: **Today**.
                  </p>
                </div>

                <div className="reasoning-panel">
                  <h4 className="reasoning-title">Predictive Reasoning</h4>
                  <p className="reasoning-text text-body-sm">
                    OPD data projects a 15% increase in seasonal respiratory patients next week, raising expected Daily Consumption to ~{Math.round(selectedMed.dailyUsage * 1.15)} units. Historical lead time for replacement stock from central government store is 4 days.
                  </p>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn-secondary"
                  onClick={() => setSelectedMed(null)}
                >
                  Close
                </button>
                <button
                  className="btn-primary flex-center gap-2"
                  onClick={() => {
                    alert(`Mock Reorder placed for ${selectedMed.name}`);
                    setSelectedMed(null);
                  }}
                >
                  <span>Approve Reorder Order</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .medicines-container {
          padding: var(--spacing-space-6) var(--spacing-space-8);
          max-width: 1200px;
          margin: 0 auto;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
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

        /* Toolbar Styles */
        .toolbar-section {
          display: flex;
          gap: var(--spacing-space-4);
          padding: var(--spacing-space-4);
          margin-bottom: var(--spacing-space-6);
        }

        .search-box {
          position: relative;
          flex: 1;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: var(--spacing-space-4);
          color: var(--color-outline);
        }

        .search-input {
          width: 100%;
          padding: var(--spacing-space-3) var(--spacing-space-4) var(--spacing-space-3) calc(var(--spacing-space-4) * 2 + 10px);
          border: 1px solid var(--color-border-subtle);
          border-radius: var(--rounded-md);
          background: rgba(255, 255, 255, 0.6);
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.2s;
        }

        .search-input:focus {
          border-color: var(--color-primary);
        }

        .filter-box {
          display: flex;
          align-items: center;
          gap: var(--spacing-space-2);
        }

        .filter-select {
          padding: var(--spacing-space-3) var(--spacing-space-6) var(--spacing-space-3) var(--spacing-space-3);
          border: 1px solid var(--color-border-subtle);
          border-radius: var(--rounded-md);
          background: rgba(255, 255, 255, 0.6);
          font-size: 0.875rem;
          outline: none;
          cursor: pointer;
        }

        /* Grid Cards */
        .medicines-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: var(--spacing-space-4);
        }

        .medicine-card {
          padding: var(--spacing-space-4);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-space-4);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .medicine-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(9, 20, 38, 0.05);
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: var(--spacing-space-2);
        }

        .med-name {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--color-on-surface);
          line-height: 1.3;
        }

        .med-dosage {
          font-size: 0.75rem;
          color: var(--color-outline);
          margin-top: 2px;
        }

        .status-badge {
          font-size: 0.65rem;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: var(--rounded-sm);
          text-transform: uppercase;
        }

        .status-critical {
          background-color: var(--color-error-container);
          color: var(--color-on-error-container);
        }

        .status-warning {
          background-color: var(--color-warning-container);
          color: var(--color-on-warning-container);
        }

        .status-safe {
          background-color: var(--color-success-container);
          color: var(--color-on-success-container);
        }

        .med-details {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-space-2);
          border-top: 1px solid var(--color-border-subtle);
          border-bottom: 1px solid var(--color-border-subtle);
          padding: var(--spacing-space-3) 0;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.8125rem;
        }

        .detail-label {
          color: var(--color-on-surface-variant);
        }

        .detail-value {
          color: var(--color-on-surface);
        }

        .highlight-row {
          padding-top: var(--spacing-space-1);
        }

        .btn-card-ai {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-space-2);
          padding: var(--spacing-space-2);
          background: var(--color-surface-container-highest);
          border: 1px solid var(--color-border-subtle);
          border-radius: var(--rounded-md);
          font-size: 0.8125rem;
          font-weight: 500;
          cursor: pointer;
          color: var(--color-primary);
          transition: all 0.2s;
        }

        .btn-card-ai:hover {
          background: var(--color-primary-container);
          color: var(--color-on-primary-container);
          border-color: transparent;
        }

        .empty-state {
          padding: var(--spacing-space-12);
          text-align: center;
        }

        .empty-text {
          color: var(--color-outline);
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(9, 20, 38, 0.4);
          backdrop-filter: blur(4px);
          z-index: 1000;
        }

        .modal-content {
          width: 90%;
          max-width: 500px;
          background: rgba(255, 255, 255, 0.95);
          border-radius: var(--rounded-lg);
          border: 1px solid var(--color-border-subtle);
          padding: var(--spacing-space-6);
          box-shadow: 0 20px 40px rgba(9, 20, 38, 0.15);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-space-4);
          border-bottom: 1px solid var(--color-border-subtle);
          padding-bottom: var(--spacing-space-3);
        }

        .modal-title-wrapper {
          display: flex;
          align-items: center;
          gap: var(--spacing-space-2);
        }

        .modal-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--color-primary);
        }

        .btn-modal-close {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--color-outline);
          padding: 4px;
          border-radius: var(--rounded-full);
        }

        .btn-modal-close:hover {
          background: var(--color-surface-container);
        }

        .modal-med-name {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-on-surface);
        }

        .modal-med-dosage {
          font-size: 0.8125rem;
          color: var(--color-outline);
          margin-bottom: var(--spacing-space-4);
        }

        .modal-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-space-3);
          margin-bottom: var(--spacing-space-4);
        }

        .m-stat-box {
          background: var(--color-surface-container-low);
          padding: var(--spacing-space-3);
          border-radius: var(--rounded-md);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          border: 1px solid var(--color-border-subtle);
        }

        .m-stat-label {
          font-size: 0.6875rem;
          color: var(--color-on-surface-variant);
          margin-bottom: 4px;
        }

        .m-stat-value {
          font-size: 0.875rem;
          font-weight: 700;
        }

        .risk-critical {
          color: var(--color-error);
        }

        .risk-warning {
          color: var(--color-warning);
        }

        .risk-safe {
          color: var(--color-success);
        }

        .recommendation-panel {
          background-color: var(--color-primary-container);
          color: var(--color-on-primary-container);
          padding: var(--spacing-space-4);
          border-radius: var(--rounded-md);
          margin-bottom: var(--spacing-space-4);
          border-left: 4px solid var(--color-primary);
        }

        .rec-title {
          font-size: 0.8125rem;
          font-weight: 700;
          margin-bottom: var(--spacing-space-1);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .reasoning-panel {
          background-color: var(--color-surface-container-low);
          padding: var(--spacing-space-4);
          border-radius: var(--rounded-md);
          margin-bottom: var(--spacing-space-4);
          border: 1px solid var(--color-border-subtle);
        }

        .reasoning-title {
          font-size: 0.8125rem;
          font-weight: 700;
          margin-bottom: var(--spacing-space-1);
          color: var(--color-on-surface-variant);
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: var(--spacing-space-3);
          border-top: 1px solid var(--color-border-subtle);
          padding-top: var(--spacing-space-4);
        }
      `}</style>
    </AppShell>
  );
}
