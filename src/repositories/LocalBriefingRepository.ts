import { IBriefingRepository } from './IBriefingRepository';

const STORAGE_KEY = 'phc_briefing';

const defaultBriefingText = 
  "Good Morning, Doctor. Here is your synthesized operations briefing for Sunday, July 5, 2026.\n\n" +
  "📦 Inventory & Supply Chains\n" +
  "We project a stockout of ORS Sachets and Albendazole 400mg within the next 48 hours. Active usage registers 50 sachets daily, while stock is down to 120. A replenishment request must be approved today to avoid critical shortages by Tuesday.\n\n" +
  "👥 Roster & Department Cover\n" +
  "Roster coverage is at 67% today. Dr. Ramesh Nair is ABSENT for the evening General OPD shift, posing an operational risk. We recommend reallocating Dr. Anita Desai (Gynecology, Afternoon) or inviting Dr. Rajesh Sharma to cover the gap.\n\n" +
  "📈 Patient Analytics & Surge Risk\n" +
  "A 25% pediatric patient surge is predicted between 10:00 AM and 1:00 PM due to seasonal viral patterns. Open an additional registration desk during these hours to prevent OPD queues exceeding 30 minutes.";

export class LocalBriefingRepository implements IBriefingRepository {
  private isClient(): boolean {
    return typeof window !== 'undefined';
  }

  async getLatestBriefing(): Promise<string | null> {
    if (!this.isClient()) return defaultBriefingText;
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, defaultBriefingText);
      return defaultBriefingText;
    }
    return data;
  }

  async saveBriefing(briefing: string): Promise<void> {
    if (!this.isClient()) return;
    localStorage.setItem(STORAGE_KEY, briefing);
  }

  async clearBriefing(): Promise<void> {
    if (!this.isClient()) return;
    localStorage.removeItem(STORAGE_KEY);
  }

  listen(callback: (data: string | null) => void): () => void {
    this.getLatestBriefing().then(callback);
    return () => {};
  }
}
