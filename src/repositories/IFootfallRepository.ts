import { HourlyLoad } from '@/types/store';

export interface FootfallForecast {
  predictedCount: number;
  peakTime: string;
  riskLevel: string;
  aiRecommendation: string;
  confidenceScore?: number;
}

export interface DepartmentPatients {
  name: string;
  patients: number;
  color: string;
}

export interface HistoricalPatients {
  date: string;
  patients: number;
}

export interface IFootfallRepository {
  getHistoricalRecords(): Promise<HistoricalPatients[]>;
  getDepartmentBreakdown(): Promise<DepartmentPatients[]>;
  getHourlyLoad(): Promise<HourlyLoad[]>;
  getForecast(): Promise<FootfallForecast>;
}
