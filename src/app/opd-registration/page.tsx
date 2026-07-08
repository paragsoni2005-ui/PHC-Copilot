"use client";

import React, { useState } from "react";
import ReceptionistShell from "@/components/ReceptionistShell";
import { usePatients } from "@/hooks/usePatients";
import { useAuth } from "@/context/AuthContext";
import { Patient } from "@/types/store";
import { 
  Search, 
  Filter, 
  Plus, 
  ClipboardList, 
  User, 
  ChevronRight, 
  X, 
  Eye, 
  AlertCircle,
  CheckCircle2
} from "lucide-react";

export default function OPDRegistrationPage() {
  const {
    filteredPatients,
    loading,
    error: submitError,
    registerPatient,
    searchQuery,
    setSearchQuery,
    genderFilter,
    setGenderFilter,
    departmentFilter,
    setDepartmentFilter,
    visitTypeFilter,
    setVisitTypeFilter
  } = usePatients();

  const { role } = useAuth();

  // Intake Form state
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [village, setVillage] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("General OPD");
  const [visitType, setVisitType] = useState("new");

  // Symptom Chips
  const symptomOptions = ["Fever", "Cough", "Cold", "Headache", "Body Pain", "Stomach Pain", "Injury", "Other"];
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [otherSymptoms, setOtherSymptoms] = useState("");

  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    // Validation checks
    if (!age || isNaN(Number(age)) || Number(age) <= 0) {
      setFormError("Please enter a valid age.");
      return;
    }
    if (!village.trim()) {
      setFormError("Please enter the patient's village.");
      return;
    }

    // Build symptoms string from chips
    const activeSymptoms = [...selectedSymptoms];
    if (activeSymptoms.includes("Other")) {
      const idx = activeSymptoms.indexOf("Other");
      if (otherSymptoms.trim()) {
        activeSymptoms[idx] = `Other: ${otherSymptoms.trim()}`;
      }
    }

    const symptomsString = activeSymptoms.join(", ");
    if (symptomsString.trim() === "") {
      setFormError("Please select at least one symptom chip.");
      return;
    }

    try {
      await registerPatient({
        name: name.trim() || "Anonymous",
        age: Number(age),
        gender,
        village: village.trim(),
        phone: phone.trim() || undefined,
        department,
        visitType: visitType as "new" | "follow-up",
        symptoms: symptomsString
      });

      setSuccessMessage("Patient registered successfully!");
      
      // Reset intake form fields
      setName("");
      setAge("");
      setGender("Male");
      setVillage("");
      setPhone("");
      setDepartment("General OPD");
      setVisitType("new");
      setSelectedSymptoms([]);
      setOtherSymptoms("");

      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setFormError(err.message || "Failed to register patient. Please check configuration.");
    }
  };

  const getFormattedTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    } catch {
      return "Just now";
    }
  };

  return (
    <ReceptionistShell>
      <div className="opd-layout animate-fade-in">
        <div className="page-header">
          <div className="header-meta">
            <h1 className="page-title">OPD Patient Registration</h1>
            <p className="page-subtitle">Digitize intake data to update footfall forecasts and alert Gemini AI diagnostics in real time.</p>
          </div>
        </div>

        <div className="opd-grid">
          {/* Left Column: Intake Registration Form */}
          <section className="form-column">
            <div className="form-card glass-container glow-teal">
              <div className="card-header-bar flex-center gap-2">
                <ClipboardList size={20} className="text-teal" />
                <h3>Quick Registration Form</h3>
              </div>

              {formError && (
                <div className="alert-box alert-danger flex-center gap-2">
                  <AlertCircle size={16} />
                  <span>{formError}</span>
                </div>
              )}

              {successMessage && (
                <div className="alert-box alert-success flex-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>{successMessage}</span>
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="intake-form">
                <div className="form-row">
                  <div className="input-group">
                    <label>Patient Name (Optional)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Ramesh Kumar" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                    />
                  </div>
                  <div className="input-group shrink">
                    <label>Age (Years) *</label>
                    <input 
                      type="number" 
                      placeholder="Age" 
                      value={age} 
                      onChange={(e) => setAge(e.target.value)} 
                      required 
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="input-group">
                    <label>Gender *</label>
                    <select value={gender} onChange={(e) => setGender(e.target.value)}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Visit Type *</label>
                    <select value={visitType} onChange={(e) => setVisitType(e.target.value)}>
                      <option value="new">New Visit</option>
                      <option value="follow-up">Follow-up</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="input-group">
                    <label>Village *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Raipur" 
                      value={village} 
                      onChange={(e) => setVillage(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="input-group">
                    <label>Phone Number (Optional)</label>
                    <input 
                      type="tel" 
                      placeholder="e.g. 9876543210" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>Department *</label>
                  <select value={department} onChange={(e) => setDepartment(e.target.value)}>
                    <option value="General OPD">General OPD</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="ANC">ANC</option>
                    <option value="Immunization">Immunization</option>
                  </select>
                </div>

                <div className="input-group">
                  <label>Symptoms / Presenting Complaints *</label>
                  <div className="symptoms-chips-container">
                    {symptomOptions.map((symptom) => {
                      const isSelected = selectedSymptoms.includes(symptom);
                      return (
                        <button
                          key={symptom}
                          type="button"
                          className={`symptom-chip ${isSelected ? "active" : ""}`}
                          onClick={() => toggleSymptom(symptom)}
                        >
                          {symptom}
                        </button>
                      );
                    })}
                  </div>
                  
                  {selectedSymptoms.includes("Other") && (
                    <input
                      type="text"
                      className="other-symptoms-input animate-fade-in"
                      placeholder="Specify other symptoms..."
                      value={otherSymptoms}
                      onChange={(e) => setOtherSymptoms(e.target.value)}
                      required
                    />
                  )}
                </div>

                <button type="submit" className="btn-primary-form flex-center gap-2">
                  <Plus size={16} />
                  <span>Register & Sync Patient</span>
                </button>
              </form>
            </div>
          </section>

          {/* Right Column: Registrations List & Table */}
          <section className="list-column flex-column gap-4">
            {/* Search and Filters Toolbar */}
            <div className="toolbar-section glass-container">
              <div className="search-box">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search registrations by ID, Name or Symptoms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="filter-row">
                <div className="filter-item flex-1">
                  <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}>
                    <option value="all">All Departments</option>
                    <option value="General OPD">General OPD</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="ANC">ANC</option>
                    <option value="Immunization">Immunization</option>
                  </select>
                </div>

                <div className="filter-item flex-1">
                  <select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)}>
                    <option value="all">All Genders</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="filter-item flex-1">
                  <select value={visitTypeFilter} onChange={(e) => setVisitTypeFilter(e.target.value)}>
                    <option value="all">All Visit Types</option>
                    <option value="new">New Visit</option>
                    <option value="follow-up">Follow-up</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Patients List Card */}
            <div className="patients-list-card glass-container">
              <div className="card-header-bar flex-between">
                <h3 className="panel-title">Today's Registered Patients</h3>
                <span className="badge-patients-count">{filteredPatients.length} Patients</span>
              </div>

              <div className="table-responsive">
                {loading ? (
                  <div className="table-empty-state flex-center">
                    <div className="spinner-subtle"></div>
                    <p>Syncing OPD records...</p>
                  </div>
                ) : filteredPatients.length > 0 ? (
                  <table className="patients-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Time</th>
                        <th>Patient Info</th>
                        <th>Department</th>
                        <th>Symptoms</th>
                        <th>Type</th>
                        <th style={{ textAlign: "right" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPatients.map((pat) => (
                        <tr key={pat.patientId}>
                          <td className="pat-id-cell">{pat.patientId.split("-")[1] || pat.patientId}</td>
                          <td>{getFormattedTime(pat.registeredAt)}</td>
                          <td>
                            <div className="pat-info-name">{pat.name || "Anonymous"}</div>
                            <div className="pat-info-sub">{pat.age} yrs • {pat.gender}</div>
                          </td>
                          <td>
                            <span className="dept-chip">{pat.department}</span>
                          </td>
                          <td className="symptoms-td" title={pat.symptoms}>
                            {pat.symptoms}
                          </td>
                          <td>
                            <span className={`visit-chip ${pat.visitType}`}>
                              {pat.visitType}
                            </span>
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <button 
                              className="btn-action-view flex-center"
                              onClick={() => setSelectedPatient(pat)}
                              title="View Patient details"
                            >
                              <Eye size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="table-empty-state flex-center">
                    <p>No patient records registered matching search criteria.</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div className="modal-backdrop flex-center" onClick={() => setSelectedPatient(null)}>
          <div className="modal-card glass-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <User size={20} className="text-teal" />
              <h3>Patient Record Card</h3>
              <button className="btn-close-modal flex-center" onClick={() => setSelectedPatient(null)}>
                <X size={18} />
              </button>
            </div>
            
            <div className="patient-card-details">
              <div className="detail-meta-header">
                <div className="detail-meta-id">Registration ID: <code className="pat-id-code">{selectedPatient.patientId}</code></div>
                <div className="detail-meta-time">Registered: {new Date(selectedPatient.registeredAt).toLocaleString()}</div>
              </div>

              <div className="details-grid">
                <div className="detail-field">
                  <span className="detail-title">Full Name</span>
                  <span className="detail-text font-bold">{selectedPatient.name || "Anonymous"}</span>
                </div>
                <div className="detail-field">
                  <span className="detail-title">Age / Gender</span>
                  <span className="detail-text">{selectedPatient.age} Years / {selectedPatient.gender}</span>
                </div>
                <div className="detail-field">
                  <span className="detail-title">Village Address</span>
                  <span className="detail-text">{selectedPatient.village}</span>
                </div>
                <div className="detail-field">
                  <span className="detail-title">Phone Number</span>
                  <span className="detail-text">{selectedPatient.phone || "Not provided"}</span>
                </div>
                <div className="detail-field">
                  <span className="detail-title">Assigned Department</span>
                  <span className="detail-text">{selectedPatient.department}</span>
                </div>
                <div className="detail-field">
                  <span className="detail-title">Visit Sequence</span>
                  <span className="detail-text capitalized">{selectedPatient.visitType} Visit</span>
                </div>
              </div>

              <div className="details-block">
                <span className="detail-title">Presenting Symptoms / Diagnoses</span>
                <p className="detail-block-text">{selectedPatient.symptoms}</p>
              </div>

              <div className="details-block" style={{ borderTop: "1px solid var(--color-border-subtle)", paddingTop: "12px", display: "flex", justifyContent: "space-between" }}>
                <div>
                  <span className="detail-title">Clinic Status</span>
                  <span className="badge-status-waiting">{selectedPatient.status.toUpperCase()}</span>
                </div>
                <div>
                  <span className="detail-title">Registered By</span>
                  <span className="detail-text capitalized">{selectedPatient.createdBy}</span>
                </div>
              </div>

              <div className="modal-actions flex-end" style={{ marginTop: "24px" }}>
                <button className="btn-modal-cancel" onClick={() => setSelectedPatient(null)}>
                  Close Card
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Styled JSX */}
      <style jsx>{`
        .opd-layout {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-space-6);
        }

        .opd-grid {
          display: grid;
          grid-template-columns: 380px 1fr;
          gap: var(--spacing-gutter);
          align-items: start;
        }

        /* Form styling */
        .form-card {
          padding: var(--spacing-space-6);
        }

        .glow-teal {
          border: 1px solid rgba(13, 148, 136, 0.25) !important;
        }

        .card-header-bar {
          margin-bottom: var(--spacing-space-4);
          padding-bottom: var(--spacing-space-2);
          border-bottom: 1px solid var(--color-border-subtle);
          justify-content: flex-start !important;
        }

        .card-header-bar h3 {
          font-size: 1.125rem;
          font-weight: 700;
        }

        .intake-form {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-space-4);
        }

        .form-row {
          display: flex;
          gap: var(--spacing-space-3);
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
        }

        .input-group.shrink {
          flex: 0 0 100px;
        }

        .input-group label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--color-outline);
        }

        .input-group input, 
        .input-group select, 
        .input-group textarea {
          border: 1px solid var(--color-border-subtle);
          border-radius: var(--rounded-md);
          background-color: #ffffff;
          padding: 10px 14px;
          font-size: 0.875rem;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          width: 100%;
          color: var(--color-on-surface);
        }

        .input-group input:focus, 
        .input-group select:focus, 
        .input-group textarea:focus {
          border-color: var(--color-clinical-teal);
          box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.1);
        }

        .symptoms-chips-container {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 4px;
        }

        .symptom-chip {
          padding: 8px 16px;
          border-radius: var(--rounded-full);
          border: 1px solid var(--color-border-subtle);
          background-color: #ffffff;
          color: var(--color-on-surface-variant);
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .symptom-chip:hover {
          border-color: var(--color-clinical-teal);
          color: var(--color-clinical-teal);
          background-color: rgba(13, 148, 136, 0.05);
          transform: translateY(-1px);
        }

        .symptom-chip.active {
          border-color: var(--color-clinical-teal);
          background-color: var(--color-clinical-teal);
          color: white;
          box-shadow: 0 4px 10px rgba(13, 148, 136, 0.25);
        }

        .symptom-chip.active:hover {
          background-color: #0b7a70;
          border-color: #0b7a70;
          transform: translateY(-1px);
        }

        .other-symptoms-input {
          margin-top: 8px;
          border: 1px solid var(--color-border-subtle);
          border-radius: var(--rounded-md);
          padding: 10px 14px;
          font-size: 0.875rem;
          width: 100%;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .other-symptoms-input:focus {
          border-color: var(--color-clinical-teal);
          box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.1);
        }

        .btn-primary-form {
          background-color: var(--color-clinical-teal);
          color: white;
          padding: 14px;
          border-radius: var(--rounded-md);
          font-weight: 600;
          font-size: 0.95rem;
          box-shadow: 0 4px 12px rgba(13, 148, 136, 0.25);
          margin-top: 8px;
          border: none;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn-primary-form:hover {
          background-color: #0b7a70;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(13, 148, 136, 0.35);
        }

        .btn-primary-form:active {
          transform: translateY(0);
        }

        .alert-box {
          padding: 10px 12px;
          border-radius: var(--rounded-default);
          font-size: 0.8rem;
          font-weight: 500;
          margin-bottom: 12px;
        }
        .alert-danger {
          background: var(--color-error-container);
          color: var(--color-on-error-container);
          border: 1px solid rgba(186, 26, 26, 0.15);
        }
        .alert-success {
          background: rgba(16, 185, 129, 0.1);
          color: var(--color-status-success);
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        /* List Column and Toolbar */
        .flex-column { display: flex; flex-direction: column; }
        .gap-4 { gap: 16px; }
        .flex-1 { flex: 1; }

        .toolbar-section {
          padding: var(--spacing-space-5);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-space-4);
        }

        .search-box {
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;
        }

        :global(.search-icon) {
          position: absolute;
          left: 14px;
          color: var(--color-outline);
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          height: 42px;
          padding-left: 42px;
          border: 1px solid var(--color-border-subtle);
          border-radius: var(--rounded-md);
          background: white;
          font-size: 0.875rem;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .search-input:focus {
          border-color: var(--color-clinical-teal);
          box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.1);
        }

        .filter-row {
          display: flex;
          gap: var(--spacing-space-3);
          width: 100%;
        }

        @media (max-width: 768px) {
          .filter-row {
            flex-direction: column;
            gap: var(--spacing-space-2);
          }
        }

        .filter-item select {
          width: 100%;
          height: 40px;
          border: 1px solid var(--color-border-subtle);
          border-radius: var(--rounded-md);
          padding: 0 12px;
          background: white;
          font-size: 0.85rem;
          color: var(--color-on-surface-variant);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          outline: none;
          cursor: pointer;
        }

        .filter-item select:focus {
          border-color: var(--color-clinical-teal);
          box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.1);
        }

        /* Patients List and Table styling */
        .patients-list-card {
          padding: 24px;
          flex: 1;
        }

        .badge-patients-count {
          background: rgba(13, 148, 136, 0.1);
          color: var(--color-clinical-teal);
          font-size: 0.75rem;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: var(--rounded-full);
        }

        .table-responsive {
          margin-top: 16px;
          overflow-x: auto;
          min-height: 240px;
        }

        .patients-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .patients-table th {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-outline);
          padding: 10px 12px;
          border-bottom: 1px solid var(--color-border-subtle);
          font-weight: 600;
        }

        .patients-table tbody tr {
          transition: background-color 0.2s ease;
        }

        .patients-table tbody tr:hover {
          background-color: rgba(13, 148, 136, 0.02);
        }

        .patients-table td {
          padding: 12px;
          font-size: 0.875rem;
          border-bottom: 1px solid var(--color-border-subtle);
          color: var(--color-on-surface);
        }

        .pat-id-cell {
          font-family: monospace;
          color: var(--color-clinical-teal);
          font-weight: 600;
        }

        .pat-info-name {
          font-weight: 600;
          color: var(--color-primary);
        }

        .pat-info-sub {
          font-size: 0.75rem;
          color: var(--color-outline);
        }

        .dept-chip {
          display: inline-block;
          font-size: 0.75rem;
          background: var(--color-surface-container-high);
          color: var(--color-primary);
          padding: 2px 8px;
          border-radius: var(--rounded-sm);
          font-weight: 500;
        }

        .symptoms-td {
          max-width: 180px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 0.8rem;
          color: var(--color-on-surface-variant);
        }

        .visit-chip {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          padding: 2px 6px;
          border-radius: var(--rounded-full);
        }

        .visit-chip.new {
          background: rgba(16, 185, 129, 0.1);
          color: var(--color-status-success);
        }

        .visit-chip.follow-up {
          background: rgba(0, 81, 213, 0.1);
          color: var(--color-secondary);
        }

        .btn-action-view {
          width: 32px;
          height: 32px;
          border-radius: var(--rounded-full);
          border: 1px solid var(--color-border-subtle);
          color: var(--color-outline);
          cursor: pointer;
          background: #ffffff;
          margin-left: auto;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn-action-view:hover {
          color: var(--color-clinical-teal);
          border-color: var(--color-clinical-teal);
          background: rgba(13, 148, 136, 0.05);
          box-shadow: 0 2px 8px rgba(13, 148, 136, 0.15);
          transform: translateY(-1px);
        }

        .table-empty-state {
          flex-direction: column;
          height: 200px;
          color: var(--color-outline);
          font-size: 0.875rem;
          gap: 12px;
        }

        .spinner-subtle {
          width: 24px;
          height: 24px;
          border: 2px solid var(--color-border-subtle);
          border-top-color: var(--color-clinical-teal);
          border-radius: 9999px;
          animation: spin 0.8s linear infinite;
        }

        /* Detail Modal structure */
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(9, 20, 38, 0.4);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          z-index: 1000;
        }

        .modal-card {
          width: 95%;
          max-width: 500px;
          padding: var(--spacing-space-6);
          box-shadow: 0 20px 40px rgba(9, 20, 38, 0.15);
          z-index: 1001;
          background: #ffffff;
        }

        .btn-close-modal {
          margin-left: auto;
          color: var(--color-outline);
          width: 28px;
          height: 28px;
          border-radius: var(--rounded-full);
          border: none;
          background: none;
          cursor: pointer;
        }
        .btn-close-modal:hover {
          background: var(--color-surface-container);
        }

        .patient-card-details {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .detail-meta-header {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 0.75rem;
          color: var(--color-outline);
          background: var(--color-surface-container-low);
          padding: 10px 14px;
          border-radius: var(--rounded-default);
          border: 1px solid var(--color-border-subtle);
        }

        .pat-id-code {
          color: var(--color-clinical-teal);
          font-family: monospace;
          font-weight: 600;
        }

        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-gutter);
        }

        .detail-field {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .detail-title {
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--color-outline);
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .detail-text {
          font-size: 0.9rem;
          color: var(--color-on-surface);
        }

        .font-bold { font-weight: 700; }
        .capitalized { text-transform: capitalize; }

        .details-block {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .detail-block-text {
          font-size: 0.875rem;
          color: var(--color-on-surface-variant);
          background: var(--color-surface-container-low);
          padding: 10px 14px;
          border-radius: var(--rounded-default);
          line-height: 1.5;
        }

        .badge-status-waiting {
          background: rgba(245, 158, 11, 0.1);
          color: var(--color-status-warning);
          font-size: 0.75rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: var(--rounded-sm);
          display: inline-block;
          margin-top: 4px;
        }

        .btn-modal-cancel {
          background: var(--color-surface-container-high);
          color: var(--color-on-surface-variant);
          padding: 8px 16px;
          border-radius: var(--rounded-default);
          font-weight: 600;
          font-size: 0.85rem;
          border: none;
          cursor: pointer;
        }

        /* Responsive OP Layout */
        @media (max-width: 1024px) {
          .opd-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </ReceptionistShell>
  );
}
