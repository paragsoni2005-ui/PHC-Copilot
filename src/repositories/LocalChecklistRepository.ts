import { IChecklistRepository, ChecklistItem } from './IChecklistRepository';

const STORAGE_KEY = 'phc_checklist';

const seedChecklist: ChecklistItem[] = [
  { id: '1', text: 'Verify morning medicine stock registers', completed: true, priority: 'medium', category: 'General' },
  { id: '2', text: 'Reallocate staff for predicted Pediatric footfall surge', completed: false, priority: 'high', category: 'Staffing' },
  { id: '3', text: 'Review Doctor attendance and confirm leave schedules', completed: false, priority: 'high', category: 'Attendance' },
  { id: '4', text: 'Approve ORS urgent restock order', completed: false, priority: 'high', category: 'Inventory' },
];

export class LocalChecklistRepository implements IChecklistRepository {
  private isClient(): boolean {
    return typeof window !== 'undefined';
  }

  async getItems(): Promise<ChecklistItem[]> {
    if (!this.isClient()) return seedChecklist;
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedChecklist));
      return seedChecklist;
    }
    try {
      return JSON.parse(data) as ChecklistItem[];
    } catch {
      return seedChecklist;
    }
  }

  async toggleItem(id: string, completed: boolean): Promise<void> {
    const list = await this.getItems();
    const index = list.findIndex((item) => item.id === id);
    if (index !== -1) {
      list[index].completed = completed;
      await this.saveItems(list);
    }
  }

  async saveItems(items: ChecklistItem[]): Promise<void> {
    if (!this.isClient()) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  listen(callback: (data: ChecklistItem[]) => void): () => void {
    this.getItems().then(callback);
    return () => {};
  }
}
