export interface IBriefingRepository {
  getLatestBriefing(): Promise<string | null>;
  saveBriefing(briefing: string): Promise<void>;
  clearBriefing(): Promise<void>;
  listen(callback: (data: string | null) => void): () => void;
}
