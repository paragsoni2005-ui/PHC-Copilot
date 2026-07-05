import { FootfallRecord, HourlyLoad } from "@/types/store";

// Historical 7-day total OPD patient counts (FOOT-01 Line Chart)
export const mockFootfallHistory: { date: string; patients: number }[] = [
  { date: "Mon", patients: 110 },
  { date: "Tue", patients: 135 },
  { date: "Wed", patients: 120 },
  { date: "Thu", patients: 145 },
  { date: "Fri", patients: 130 },
  { date: "Sat", patients: 95 },
  { date: "Sun", patients: 40 },
];

// Weekly patient counts by department breakdown (FOOT-01 Bar Chart)
export const mockDepartmentBreakdown = [
  { name: "General OPD", patients: 380, color: "var(--color-primary)" },
  { name: "Pediatrics", patients: 210, color: "var(--color-clinical-teal)" },
  { name: "Gynecology", patients: 150, color: "var(--color-success)" },
  { name: "Dental", patients: 60, color: "var(--color-warning)" },
];

// Daily hourly patient workload distribution (FOOT-02 Area Chart)
export const mockHourlyLoad: HourlyLoad[] = [
  { time: "09:00 AM", load: 15, capacity: 40 },
  { time: "10:00 AM", load: 38, capacity: 40 }, // Peak
  { time: "11:00 AM", load: 45, capacity: 40 }, // Over capacity
  { time: "12:00 PM", load: 42, capacity: 40 }, // Over capacity
  { time: "01:00 PM", load: 20, capacity: 40 },
  { time: "02:00 PM", load: 12, capacity: 40 },
  { time: "03:00 PM", load: 18, capacity: 40 },
  { time: "04:00 PM", load: 25, capacity: 40 },
];

// Forecast metrics (FOOT-03 Prediction Card)
export const mockFootfallForecast = {
  predictedCount: 168,
  peakTime: "10:30 AM - 12:30 PM",
  riskLevel: "high", // high, moderate, low
  aiRecommendation: "A 25% pediatric patient surge is anticipated. Suggest reallocating 1 nurse from General OPD to Pediatrics during peak hours (10:00 AM - 01:00 PM) to minimize wait times.",
};
