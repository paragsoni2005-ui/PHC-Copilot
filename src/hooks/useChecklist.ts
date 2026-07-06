import { useState, useEffect, useCallback } from 'react';
import { LocalChecklistRepository } from '../repositories/LocalChecklistRepository';
import { ChecklistItem } from '../repositories/IChecklistRepository';

const repo = new LocalChecklistRepository();

export function useChecklist() {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const data = await repo.getItems();
      setItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const toggleItem = useCallback(async (id: string) => {
    const item = items.find((t) => t.id === id);
    if (!item) return;
    const completed = !item.completed;
    
    // Optimistic UI update
    setItems((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed } : t))
    );
    
    try {
      await repo.toggleItem(id, completed);
    } catch (e) {
      console.error(e);
      // Rollback on failure
      setItems((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !completed } : t))
      );
    }
  }, [items]);

  return {
    items,
    loading,
    toggleItem,
    refresh: fetchItems,
  };
}
