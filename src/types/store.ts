export interface Medicine {
  id: string;
  name: string;
  dosageForm: string; // e.g. "Tablet", "Syrup", "Injection", "Vial"
  stock: number; // Current stock count (e.g. number of tablets/bottles)
  dailyUsage: number; // Average consumed per day
  reorderLevel: number; // Threshold under which we should reorder
  daysRemaining: number; // Computed: stock / dailyUsage
  riskLevel: 'critical' | 'warning' | 'safe'; // Calculated based on daysRemaining
  lastReorderDate: string; // Date string: "YYYY-MM-DD"
}

export interface Doctor {
  id: string;
  name: string;
  department: string; // e.g. "Pediatrics", "General OPD", "Gynecology", "Dental"
  status: 'present' | 'absent' | 'on_leave';
  contact: string; // Phone number
  specialty: string; // e.g. "Child Specialist", "MD Medicine", "OB-GYN"
  shift: 'morning' | 'afternoon' | 'evening';
}

export interface FootfallRecord {
  id: string; // e.g. date string or auto-id
  date: string; // "YYYY-MM-DD"
  patientCount: number; // Total OPD patient count for the day
  departments: {
    [key: string]: number; // e.g. "Pediatrics": 45, "General": 80
  };
  peakHour: string; // e.g. "10:00 AM - 12:00 PM"
}

export interface HourlyLoad {
  time: string; // e.g. "09:00", "10:00", etc.
  load: number; // Number of patients checked in during this hour
  capacity: number; // Max capacity threshold
}
