"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Patient } from "@/types/store";
import { FirestorePatientRepository } from "@/repositories/FirestorePatientRepository";

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Client-side filtering/searching states
  const [searchQuery, setSearchQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [visitTypeFilter, setVisitTypeFilter] = useState("all");

  const repo = useMemo(() => new FirestorePatientRepository(), []);

  // Listen to today's patient updates in real-time
  useEffect(() => {
    setLoading(true);
    const unsubscribe = repo.listenToToday((data) => {
      setPatients(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [repo]);

  // Register patient method
  const registerPatient = useCallback(async (patientData: Omit<Patient, "patientId" | "registeredAt" | "createdBy" | "status">) => {
    setError(null);
    try {
      await repo.create({
        ...patientData,
        createdBy: "receptionist",
        status: "waiting"
      });
    } catch (err: any) {
      setError(err.message || "Failed to register patient");
      throw err;
    }
  }, [repo]);

  // Client-side filtering + search logic
  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      // 1. Search Query (ID, Name, Symptoms)
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesId = patient.patientId.toLowerCase().includes(query);
        const matchesName = patient.name?.toLowerCase().includes(query) || false;
        const matchesSymptoms = patient.symptoms.toLowerCase().includes(query);
        if (!matchesId && !matchesName && !matchesSymptoms) {
          return false;
        }
      }

      // 2. Gender Filter
      if (genderFilter !== "all" && patient.gender.toLowerCase() !== genderFilter.toLowerCase()) {
        return false;
      }

      // 3. Department Filter
      if (departmentFilter !== "all" && patient.department.toLowerCase() !== departmentFilter.toLowerCase()) {
        return false;
      }

      // 4. Visit Type Filter
      if (visitTypeFilter !== "all" && patient.visitType.toLowerCase() !== visitTypeFilter.toLowerCase()) {
        return false;
      }

      return true;
    });
  }, [patients, searchQuery, genderFilter, departmentFilter, visitTypeFilter]);

  return {
    patients,
    filteredPatients,
    loading,
    error,
    registerPatient,
    searchQuery,
    setSearchQuery,
    genderFilter,
    setGenderFilter,
    departmentFilter,
    setDepartmentFilter,
    visitTypeFilter,
    setVisitTypeFilter
  };
}
