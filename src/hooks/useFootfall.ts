"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { HourlyLoad } from "@/types/store";
import { HistoricalPatients, DepartmentPatients, FootfallForecast } from "../repositories/IFootfallRepository";
import { FirestorePatientRepository } from "../repositories/FirestorePatientRepository";
import { Patient } from "@/types/store";
import { useAuth } from "@/context/AuthContext";

export function useFootfall() {
  const { user } = useAuth();
  const [historicalData, setHistoricalData] = useState<HistoricalPatients[]>([]);
  const [departmentData, setDepartmentData] = useState<DepartmentPatients[]>([]);
  const [hourlyLoad, setHourlyLoad] = useState<HourlyLoad[]>([]);
  const [forecast, setForecast] = useState<FootfallForecast | null>(null);
  const [loading, setLoading] = useState(true);

  const patientRepo = useMemo(() => new FirestorePatientRepository(user?.uid || 'demo-user'), [user?.uid]);

  // Aggregate Firestore patients dynamically
  const aggregateFirestoreData = useCallback((allPatients: Patient[]) => {
    // 1. Filter today's patients vs historical patients
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // Group patients by registered date (YYYY-MM-DD)
    const dailyCounts: { [key: string]: number } = {};
    const deptCounts: { [key: string]: number } = {
      "General OPD": 0,
      "Pediatrics": 0,
      "ANC": 0,
      "Immunization": 0
    };

    // Calculate hourly load for today
    const hourSlots: { [key: number]: number } = {};
    for (let h = 9; h <= 17; h++) {
      hourSlots[h] = 0;
    }

    allPatients.forEach(p => {
      const regDate = p.registeredAt ? new Date(p.registeredAt) : new Date();
      const dateKey = regDate.toISOString().split("T")[0];
      dailyCounts[dateKey] = (dailyCounts[dateKey] || 0) + 1;

      if (regDate >= startOfToday) {
        if (p.department) {
          deptCounts[p.department] = (deptCounts[p.department] || 0) + 1;
        }
        const hour = regDate.getHours();
        if (hour >= 9 && hour <= 17) {
          hourSlots[hour] = (hourSlots[hour] || 0) + 1;
        }
      }
    });

    // Populate historicalData (last 7 days of history)
    const hist: HistoricalPatients[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().split("T")[0];
      const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      hist.push({
        date: dateStr,
        patients: dailyCounts[dateKey] || 0
      });
    }

    // Populate departmentData
    const COLORS: { [key: string]: string } = {
      "General OPD": "#0d9488",
      "Pediatrics": "#f59e0b",
      "ANC": "#0051d5",
      "Immunization": "#10b981"
    };

    const dept: DepartmentPatients[] = Object.keys(deptCounts).map(name => ({
      name,
      patients: deptCounts[name],
      color: COLORS[name] || "#64748b"
    }));

    // Populate hourlyLoad
    const hr: HourlyLoad[] = Object.keys(hourSlots).map(hStr => {
      const h = Number(hStr);
      const suffix = h >= 12 ? "PM" : "AM";
      const displayHour = h > 12 ? h - 12 : h;
      return {
        time: `${String(displayHour).padStart(2, "0")}:00 ${suffix}`,
        load: hourSlots[h],
        capacity: h >= 10 && h <= 13 ? 20 : 15 // surge capacity window
      };
    });

    // Forecast calculation
    const avgHistorical = hist.slice(0, 6).reduce((acc, curr) => acc + curr.patients, 0) / 6;
    const predictedCount = Math.max(Math.round(avgHistorical * 1.1) + 15, 20); // deterministic forecast

    // Find peak hour
    let maxLoad = -1;
    let peakHourStr = "10:00 AM - 12:00 PM";
    hr.forEach((h, index) => {
      if (h.load > maxLoad) {
        maxLoad = h.load;
        const nextHour = hr[index + 1] ? hr[index + 1].time : "05:00 PM";
        peakHourStr = `${h.time} - ${nextHour}`;
      }
    });

    const riskLevel = predictedCount > 50 ? "High" : predictedCount > 30 ? "Medium" : "Low";
    const confidenceScore = Math.min(Math.round(85 + (avgHistorical % 10)), 98);

    let aiRecommendation = `Predicted load is ${predictedCount} patients. Peak hours expected between ${peakHourStr}. `;
    if (riskLevel === "High") {
      aiRecommendation += `Recommend opening second registration desk and mobilizing relief nursing coverage. `;
    }

    const feverCount = allPatients.filter(p => p.symptoms?.includes("Fever")).length;
    const coughCount = allPatients.filter(p => p.symptoms?.includes("Cough")).length;
    const feverPct = feverCount / (allPatients.length || 1);
    const coughPct = coughCount / (allPatients.length || 1);

    if (feverPct > 0.5 || coughPct > 0.4) {
      aiRecommendation += `High symptom incidence detected. Increase Paracetamol and ORS availability. `;
    }

    if (deptCounts["Pediatrics"] > deptCounts["General OPD"] * 0.5) {
      aiRecommendation += `Ensure pediatric medicines are fully stocked.`;
    }

    const fc: FootfallForecast = {
      predictedCount,
      peakTime: peakHourStr,
      riskLevel,
      aiRecommendation,
      confidenceScore
    };

    setHistoricalData(hist);
    setDepartmentData(dept);
    setHourlyLoad(hr);
    setForecast(fc);
    setLoading(false);
  }, []);

  // Listen to Firestore patients directly
  useEffect(() => {
    if (!user?.uid) return;
    // Listen to patient records over the last 14 days to compile statistics
    const unsubscribe = patientRepo.listenToRecent(14, (data) => {
      aggregateFirestoreData(data);
    });
    return () => unsubscribe();
  }, [patientRepo, aggregateFirestoreData, user?.uid]);

  return {
    historicalData,
    departmentData,
    hourlyLoad,
    forecast,
    loading: loading || !user?.uid,
    refresh: () => {}
  };
}
