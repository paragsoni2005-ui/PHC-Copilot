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

    // Calculate a deterministic, data-driven forecast
    const patientsByDate: Record<string, number> = {};
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDow = tomorrow.getDay(); // 0 = Sunday, 1 = Monday, etc.

    const uniqueDowDates = new Set<string>();
    let dowTotal = 0;

    allPatients.forEach(p => {
      const regDate = new Date(p.registeredAt);
      const dateStr = regDate.toISOString().split('T')[0];
      patientsByDate[dateStr] = (patientsByDate[dateStr] || 0) + 1;
      
      if (regDate.getDay() === tomorrowDow) {
        uniqueDowDates.add(dateStr);
        dowTotal++;
      }
    });

    // Extract last 7 days history
    const last7DaysCounts: number[] = [];
    let last7DaysTotal = 0;
    for (let i = 1; i <= 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = patientsByDate[dateStr] || 0;
      last7DaysCounts.push(count);
      last7DaysTotal += count;
    }
    last7DaysCounts.reverse(); // Now ordered: oldest to newest (Day -7 to Day -1)

    // 1. 7-day Historical Average (45%)
    const baseAvg = last7DaysTotal / 7;

    // 2. Recent Trend (last 3 days) (25%)
    const dayMinus3 = last7DaysCounts[4];
    const dayMinus2 = last7DaysCounts[5];
    const dayMinus1 = last7DaysCounts[6];

    let growth1 = dayMinus3 > 0 ? (dayMinus2 - dayMinus3) / dayMinus3 : 0;
    let growth2 = dayMinus2 > 0 ? (dayMinus1 - dayMinus2) / dayMinus2 : 0;
    growth1 = Math.max(-0.5, Math.min(0.5, growth1));
    growth2 = Math.max(-0.5, Math.min(0.5, growth2));
    const avgGrowth = (growth1 + growth2) / 2;
    const trendValue = baseAvg * (1 + avgGrowth);

    // 3. Day-of-week adjustment (15%)
    const dowAvg = uniqueDowDates.size > 0 ? dowTotal / uniqueDowDates.size : baseAvg;

    // 4. Seasonal/event adjustment (Base for now) (5%)
    const seasonalValue = baseAvg;

    // 5. Safety adjustment (Buffer) (10%)
    const safetyValue = baseAvg * 1.1;

    // Final deterministic formula
    const predictedFloat = (baseAvg * 0.45) + (trendValue * 0.25) + (dowAvg * 0.15) + (seasonalValue * 0.05) + (safetyValue * 0.10);
    const predictedCount = Math.round(predictedFloat);

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

    // Operational Risk (Clinic capacity: 40 patients/day)
    const clinicCapacity = 40;
    const utilization = predictedCount / clinicCapacity;
    
    let riskLevel = "Low";
    if (utilization >= 1.38) {
      riskLevel = "Critical";
    } else if (utilization >= 1.05) {
      riskLevel = "High";
    } else if (utilization >= 0.80) {
      riskLevel = "Medium";
    }

    // Forecast Confidence
    let confidenceScore = 0;
    const daysWithData = last7DaysCounts.filter(c => c > 0).length;
    if (daysWithData === 7) confidenceScore += 25;
    else confidenceScore += Math.round((daysWithData / 7) * 25);

    if (allPatients.length >= 100) confidenceScore += 25;
    else confidenceScore += Math.round((allPatients.length / 100) * 25);

    if (Math.abs(avgGrowth) <= 0.15) confidenceScore += 20;
    else if (Math.abs(avgGrowth) <= 0.30) confidenceScore += 10;
    else confidenceScore += 5;

    if (uniqueDowDates.size > 0) confidenceScore += 15;

    const todayCount = Object.values(hourlyCounts).reduce((a, b) => a + b, 0);
    if (todayCount > 0) confidenceScore += 15;

    confidenceScore = Math.min(100, confidenceScore);

    // AI Recommendation
    let aiRecommendation = `We project ${predictedCount} patients tomorrow. `;
    if (riskLevel === "High" || riskLevel === "Critical") {
      aiRecommendation += `Deploy an additional registration desk between ${peakHour}. `;
    } else if (riskLevel === "Low") {
      aiRecommendation += `Current staffing is sufficient. No operational changes required. `;
    } else {
       aiRecommendation += `Moderate load expected. Monitor queue times during peak hours. `;
    }

    // Symptom Alerts
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
      peakTime: peakHour,
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
