import { useState, useEffect, useCallback } from 'react';
import { HourlyLoad } from '@/types/store';
import { LocalFootfallRepository } from '../repositories/LocalFootfallRepository';
import { FirestoreFootfallRepository } from '../repositories/FirestoreFootfallRepository';
import { LocalSettingsRepository } from '../repositories/LocalSettingsRepository';
import { HistoricalPatients, DepartmentPatients, FootfallForecast, IFootfallRepository } from '../repositories/IFootfallRepository';

export function useFootfall() {
  const [historicalData, setHistoricalData] = useState<HistoricalPatients[]>([]);
  const [departmentData, setDepartmentData] = useState<DepartmentPatients[]>([]);
  const [hourlyLoad, setHourlyLoad] = useState<HourlyLoad[]>([]);
  const [forecast, setForecast] = useState<FootfallForecast | null>(null);
  const [loading, setLoading] = useState(true);
  const [repo, setRepo] = useState<IFootfallRepository | null>(null);

  // Initialize repository based on active configurations
  useEffect(() => {
    const initRepo = async () => {
      const settingsRepo = new LocalSettingsRepository();
      const settings = await settingsRepo.getSettings();
      if (settings.mode === 'live') {
        setRepo(new FirestoreFootfallRepository());
      } else {
        setRepo(new LocalFootfallRepository());
      }
    };
    initRepo();
  }, []);

  const fetchFootfall = useCallback(async () => {
    if (!repo) return;
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
  }, [repo]);

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
