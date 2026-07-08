import { IChecklistRepository, ChecklistItem } from './IChecklistRepository';

const STORAGE_KEY = 'phc_checklist';

function getTodayString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export class LocalChecklistRepository implements IChecklistRepository {
  private isClient(): boolean {
    return typeof window !== 'undefined';
  }

  private getKey(date?: string): string {
    return `${STORAGE_KEY}_${date || getTodayString()}`;
  }

  async getItems(date?: string): Promise<ChecklistItem[]> {
    if (!this.isClient()) return [];
    const key = this.getKey(date);
    const data = localStorage.getItem(key);
    if (!data) {
      return [];
    }
    try {
      return JSON.parse(data) as ChecklistItem[];
    } catch {
      return [];
    }
  }

  async toggleItem(id: string, completed: boolean, date?: string): Promise<void> {
    const list = await this.getItems(date);
    const index = list.findIndex((item) => item.id === id);
    if (index !== -1) {
      list[index].completed = completed;
      list[index].completedAt = completed ? new Date().toISOString() : null;
      await this.saveItems(list, date);
    }
  }

  async saveItems(items: ChecklistItem[], date?: string): Promise<void> {
    if (!this.isClient()) return;
    const key = this.getKey(date);
    localStorage.setItem(key, JSON.stringify(items));
  }

  listen(callback: (data: ChecklistItem[]) => void, date?: string): () => void {
    this.getItems(date).then(callback);
    // Simple mock storage listener
    if (this.isClient()) {
      const handler = (e: StorageEvent) => {
        const key = this.getKey(date);
        if (e.key === key) {
          this.getItems(date).then(callback);
        }
      };
      window.addEventListener('storage', handler);
      return () => window.removeEventListener('storage', handler);
    }
    return () => {};
  }
}
