export interface SystemSettings {
  mode: 'mock' | 'live';
  apiKey: string;
}

export interface ISettingsRepository {
  getSettings(): Promise<SystemSettings>;
  saveSettings(settings: SystemSettings): Promise<void>;
}
