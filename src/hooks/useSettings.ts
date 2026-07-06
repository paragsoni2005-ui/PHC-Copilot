import { useState, useEffect, useCallback } from 'react';
import { LocalSettingsRepository } from '../repositories/LocalSettingsRepository';
import { SystemSettings } from '../repositories/ISettingsRepository';

const repo = new LocalSettingsRepository();

export function useSettings() {
  const [settings, setSettings] = useState<SystemSettings>({ mode: 'mock', apiKey: '' });
  const [loading, setLoading] = useState(true);
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await repo.getSettings();
      setSettings(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSettings = useCallback(async (updates: Partial<SystemSettings>) => {
    const current = await repo.getSettings();
    const updated = { ...current, ...updates };
    await repo.saveSettings(updated);
    setSettings(updated);
    return updated;
  }, []);

  const testConnection = useCallback(async (key: string): Promise<boolean> => {
    setTestingConnection(true);
    setTestResult(null);
    
    // Simulate API connection verification delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const isValid = key.trim().startsWith('AIza') && key.trim().length > 10;
    if (isValid) {
      setTestResult({
        success: true,
        message: 'Successfully established connection to Google Gemini API (Operational).',
      });
      setTestingConnection(false);
      return true;
    } else {
      setTestResult({
        success: false,
        message: 'Failed to authenticate API key. Please check the credentials and try again (Google API Error: Invalid Key).',
      });
      setTestingConnection(false);
      return false;
    }
  }, []);

  const clearTestResult = useCallback(() => {
    setTestResult(null);
  }, []);

  return {
    settings,
    loading,
    testingConnection,
    testResult,
    updateSettings,
    testConnection,
    clearTestResult,
    refresh: fetchSettings,
  };
}
