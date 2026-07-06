import { useState, useEffect, useCallback } from 'react';
import { HourlyLoad } from '@/types/store';
import { LocalFootfallRepository } from '../repositories/LocalFootfallRepository';
import { HistoricalPatients, DepartmentPatients, FootfallForecast } from '../repositories/IFootfallRepository';

const repo = new LocalFootfallRepository();

export function useFootfall() {
  const [historicalData, setHistoricalData] = useState<HistoricalPatients[]>([]);
  const [departmentData, setDepartmentData] = useState<DepartmentPatients[]>([]);
  const [hourlyLoad, setHourlyLoad] = useState<HourlyLoad[]>([]);
  const [forecast, setForecast] = useState<FootfallForecast | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchFootfall = useCallback(async () => {
    setLoading(true);
    try {
      const hist = await repo.getHistoricalRecords();
      const dept = await repo.getDepartmentBreakdown();
      const hr = await repo.getHourlyLoad();
      const fc = await repo.getForecast();
      setHistoricalData(hist);
      setDepartmentData(dept);
      setHourlyLoad(hr);
      setForecast(fc);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFootfall();
  }, [fetchFootfall]);

  return {
    historicalData,
    departmentData,
    hourlyLoad,
    forecast,
    loading,
    refresh: fetchFootfall,
  };
}
