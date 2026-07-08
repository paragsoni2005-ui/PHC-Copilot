import { ISettingsRepository, SystemSettings } from './ISettingsRepository';

const STORAGE_KEY = 'phc_settings';

export class LocalSettingsRepository implements ISettingsRepository {
  private isClient(): boolean {
    return typeof window !== 'undefined';
  }

  async getSettings(): Promise<SystemSettings> {
    const defaultSettings: SystemSettings = {
      mode: 'live',
      apiKey: '',
    };
    if (!this.isClient()) return defaultSettings;
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSettings));
      return defaultSettings;
    }
    try {
      const parsed = JSON.parse(data) as SystemSettings;
      return {
        ...parsed,
        mode: 'live'
      };
    } catch {
      return defaultSettings;
    }
  }

  async saveSettings(settings: SystemSettings): Promise<void> {
    if (!this.isClient()) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...settings, mode: 'live' }));
  }
}
