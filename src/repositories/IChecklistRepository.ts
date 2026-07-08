export interface ChecklistItem {
  id: string;
  intentId: string;
  text: string; // matches title for backward compatibility
  title: string;
  description: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  category: string;
  reason: string;
  estimatedImpact: string;
  generatedBy: 'gemini' | 'rule-engine';
  generatedAt: string;
  completedAt?: string | null;
}

export interface IChecklistRepository {
  getItems(date?: string): Promise<ChecklistItem[]>;
  toggleItem(id: string, completed: boolean, date?: string): Promise<void>;
  saveItems(items: ChecklistItem[], date?: string): Promise<void>;
  listen(callback: (data: ChecklistItem[]) => void, date?: string): () => void;
}
