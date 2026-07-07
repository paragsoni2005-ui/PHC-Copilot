export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

export interface IChecklistRepository {
  getItems(): Promise<ChecklistItem[]>;
  toggleItem(id: string, completed: boolean): Promise<void>;
  saveItems(items: ChecklistItem[]): Promise<void>;
  listen(callback: (data: ChecklistItem[]) => void): () => void;
}
