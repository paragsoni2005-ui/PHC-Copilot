"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { HourlyLoad } from "@/types/store";
import { LocalFootfallRepository } from "../repositories/LocalFootfallRepository";
import { LocalSettingsRepository } from "../repositories/LocalSettingsRepository";
import { HistoricalPatients, DepartmentPatients, FootfallForecast, IFootfallRepository } from "../repositories/IFootfallRepository";
import { FirestorePatientRepository } from "../repositories/FirestorePatientRepository";
import { Patient } from "@/types/store";

export function useFootfall() {
  const [historicalData, setHistoricalData] = useState<HistoricalPatients[]>([]);
  const [departmentData, setDepartmentData] = useState<DepartmentPatients[]>([]);
  const [hourlyLoad, setHourlyLoad] = useState<HourlyLoad[]>([]);
  const [forecast, setForecast] = useState<FootfallForecast | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"local" | "live">("local");

  const localRepo = useMemo(() => new LocalFootfallRepository(), []);
  const patientRepo = useMemo(() => new FirestorePatientRepository(), []);

  useEffect(() => {
    const checkMode = async () => {
      const settingsRepo = new LocalSettingsRepository();
      const settings = await settingsRepo.getSettings();
      setMode(settings.mode === "live" ? "live" : "local");
    };
    checkMode();
  }, []);

  // Fetch local data (when in local simulator mode)
  const fetchLocalFootfall = useCallback(async () => {
    setLoading(true);
    try {
      const hist = await localRepo.getHistoricalRecords();
      const dept = await localRepo.getDepartmentBreakdown();
      const hr = await localRepo.getHourlyLoad();
      const fc = await localRepo.getForecast();
      setHistoricalData(hist);
      setDepartmentData(dept);
      setHourlyLoad(hr);
      setForecast(fc);
    } catch (e) {
      console.error("Error loading local footfall simulator data:", e);
    } finally {
      setLoading(false);
    }
  }, [localRepo]);

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

    // Initialize daily counts for last 7 days to make sure we show them even if 0
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      dailyCounts[dateStr] = 0;
    }

    // Hourly loads for today (09:00 to 16:00)
    const hourlyCounts: { [key: string]: number } = {
      "09:00": 0, "10:00": 0, "11:00": 0, "12:00": 0,
      "13:00": 0, "14:00": 0, "15:00": 0, "16:00": 0
    };

    allPatients.forEach((patient) => {
      const regDate = new Date(patient.registeredAt);
      
      // Aggregate historical daily counts
      const dateStr = regDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (dateStr in dailyCounts) {
        dailyCounts[dateStr]++;
      } else {
        // Fallback for dates beyond 7 days
        dailyCounts[dateStr] = 1;
      }

      // Aggregate department breakdown (all-time/historical)
      const dept = patient.department;
      if (dept in deptCounts) {
        deptCounts[dept]++;
      } else {
        deptCounts[dept] = 1;
      }

      // Aggregate today's hourly load
      if (regDate >= startOfToday) {
        const hour = regDate.getHours();
        const hourStr = `${String(hour).padStart(2, "0")}:00`;
        if (hourStr in hourlyCounts) {
          hourlyCounts[hourStr]++;
        }
      }
    });

    // Format historical data
    const hist: HistoricalPatients[] = Object.keys(dailyCounts).map((date) => ({
      date,
      patients: dailyCounts[date]
    }));

    // Format department data
    const deptColors: { [key: string]: string } = {
      "General OPD": "var(--color-primary)",
      "Pediatrics": "var(--color-clinical-teal)",
      "ANC": "#ec4899",
      "Immunization": "#8b5cf6"
    };

    const dept: DepartmentPatients[] = Object.keys(deptCounts).map((name) => ({
      name,
      patients: deptCounts[name],
      color: deptColors[name] || "var(--color-secondary)"
    }));

    // Format hourly load
    const hr: HourlyLoad[] = Object.keys(hourlyCounts).map((time) => ({
      time,
      load: hourlyCounts[time],
      capacity: 15 // Standard threshold capacity
    }));

    // Calculate a dynamic forecast
    const totalPatientsPastWeek = allPatients.length;
    const avgDailyPatients = Math.round(totalPatientsPastWeek / 8) || 12;
    
    // Add small random fluctuation for forecast realism
    const predictedCount = avgDailyPatients + Math.floor((Math.sin(Date.now() / 100000) * 3));
    
    // Peak time detection
    let peakHour = "10:00 AM - 12:00 PM";
    let maxLoad = 0;
    Object.keys(hourlyCounts).forEach((h) => {
      if (hourlyCounts[h] > maxLoad) {
        maxLoad = hourlyCounts[h];
        const hrNum = parseInt(h.split(":")[0]);
        const startAmPm = hrNum >= 12 ? (hrNum === 12 ? "12:00 PM" : `${hrNum - 12}:00 PM`) : `${hrNum}:00 AM`;
        const endAmPm = (hrNum + 1) >= 12 ? ((hrNum + 1) === 12 ? "12:00 PM" : `${hrNum + 1 - 12}:00 PM`) : `${hrNum + 1}:00 AM`;
        peakHour = `${startAmPm} - ${endAmPm}`;
      }
    });

    const riskLevel = predictedCount > 25 ? "High" : predictedCount > 12 ? "Medium" : "Low";
    
    // Construct recommendation reasoning
    let aiRecommendation = `We project ${predictedCount} patients tomorrow. General OPD load remains stable.`;
    if (deptCounts["Pediatrics"] > deptCounts["General OPD"] * 0.6) {
      aiRecommendation = `Pediatric caseload spikes detected. Expect surges tomorrow around ${peakHour}. Ensure pediatric rosters are fully covered.`;
    } else if (riskLevel === "High") {
      aiRecommendation = `High patient surge predicted tomorrow. Open second intake desk at ${peakHour} to keep patient wait times under 15 minutes.`;
    }

    const fc: FootfallForecast = {
      predictedCount,
      peakTime: peakHour,
      riskLevel,
      aiRecommendation
    };

    setHistoricalData(hist);
    setDepartmentData(dept);
    setHourlyLoad(hr);
    setForecast(fc);
    setLoading(false);
  }, []);

  // Listen to Firestore patients if mode is live
  useEffect(() => {
    if (mode === "local") {
      fetchLocalFootfall();
    } else {
      setLoading(true);
      // Listen to patient records over the last 14 days to compile statistics
      const unsubscribe = patientRepo.listenToRecent(14, (data) => {
        aggregateFirestoreData(data);
      });
      return () => unsubscribe();
    }
  }, [mode, fetchLocalFootfall, patientRepo, aggregateFirestoreData]);

  return {
    historicalData,
    departmentData,
    hourlyLoad,
    forecast,
    loading,
    refresh: mode === "local" ? fetchLocalFootfall : () => {}
  };
}
