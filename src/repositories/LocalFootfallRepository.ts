import { IFootfallRepository, HistoricalPatients, DepartmentPatients, FootfallForecast } from './IFootfallRepository';
import { HourlyLoad } from '@/types/store';
import { mockFootfallHistory, mockDepartmentBreakdown, mockHourlyLoad, mockFootfallForecast } from '../mocks/footfall';

const KEYS = {
  HISTORY: 'phc_footfall_history',
  DEPARTMENTS: 'phc_footfall_departments',
  HOURLY: 'phc_footfall_hourly',
  FORECAST: 'phc_footfall_forecast',
};

export class LocalFootfallRepository implements IFootfallRepository {
  private isClient(): boolean {
    return typeof window !== 'undefined';
  }

  async getHistoricalRecords(): Promise<HistoricalPatients[]> {
    if (!this.isClient()) return mockFootfallHistory;
    const data = localStorage.getItem(KEYS.HISTORY);
    if (!data) {
      localStorage.setItem(KEYS.HISTORY, JSON.stringify(mockFootfallHistory));
      return mockFootfallHistory;
    }
    try {
      return JSON.parse(data) as HistoricalPatients[];
    } catch {
      return mockFootfallHistory;
    }
  }

  async getDepartmentBreakdown(): Promise<DepartmentPatients[]> {
    if (!this.isClient()) return mockDepartmentBreakdown;
    const data = localStorage.getItem(KEYS.DEPARTMENTS);
    if (!data) {
      localStorage.setItem(KEYS.DEPARTMENTS, JSON.stringify(mockDepartmentBreakdown));
      return mockDepartmentBreakdown;
    }
    try {
      return JSON.parse(data) as DepartmentPatients[];
    } catch {
      return mockDepartmentBreakdown;
    }
  }

  async getHourlyLoad(): Promise<HourlyLoad[]> {
    if (!this.isClient()) return mockHourlyLoad;
    const data = localStorage.getItem(KEYS.HOURLY);
    if (!data) {
      localStorage.setItem(KEYS.HOURLY, JSON.stringify(mockHourlyLoad));
      return mockHourlyLoad;
    }
    try {
      return JSON.parse(data) as HourlyLoad[];
    } catch {
      return mockHourlyLoad;
    }
  }

  async getForecast(): Promise<FootfallForecast> {
    if (!this.isClient()) return mockFootfallForecast;
    const data = localStorage.getItem(KEYS.FORECAST);
    if (!data) {
      localStorage.setItem(KEYS.FORECAST, JSON.stringify(mockFootfallForecast));
      return mockFootfallForecast;
    }
    try {
      return JSON.parse(data) as FootfallForecast;
    } catch {
      return mockFootfallForecast;
    }
  }
}
