import { ISettingsRepository, SystemSettings } from './ISettingsRepository';

export class LocalSettingsRepository implements ISettingsRepository {
  async getSettings(): Promise<SystemSettings> {
    return {
      mode: 'live',
      apiKey: '',
    };
  }

  async saveSettings(_settings: SystemSettings): Promise<void> {
    // No-op
  }
}
