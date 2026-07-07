import { useState, useEffect, useCallback } from 'react';
import { LocalChecklistRepository } from '../repositories/LocalChecklistRepository';
import { FirestoreChecklistRepository } from '../repositories/FirestoreChecklistRepository';
import { LocalSettingsRepository } from '../repositories/LocalSettingsRepository';
import { IChecklistRepository, ChecklistItem } from '../repositories/IChecklistRepository';

export function useChecklist() {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [repo, setRepo] = useState<IChecklistRepository | null>(null);

  // Initialize repository based on active configurations
  useEffect(() => {
    const initRepo = async () => {
      const settingsRepo = new LocalSettingsRepository();
      const settings = await settingsRepo.getSettings();
      if (settings.mode === 'live') {
        setRepo(new FirestoreChecklistRepository());
      } else {
        setRepo(new LocalChecklistRepository());
      }
    };
    initRepo();
  }, []);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!repo) return;
    setLoading(true);
    const unsubscribe = repo.listen((data) => {
      setItems(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [repo]);

  const toggleItem = useCallback(async (id: string) => {
    if (!repo) throw new Error('Repository not initialized');
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
      // Rollback on failure (only needed for offline local storage mode or direct writes that failed)
      if (repo instanceof LocalChecklistRepository) {
        setItems((prev) =>
          prev.map((t) => (t.id === id ? { ...t, completed: !completed } : t))
        );
      }
    }
  }, [items, repo]);

  return {
    items,
    loading,
    toggleItem,
    refresh: () => {
      if (repo) {
        setLoading(true);
        repo.getItems().then((data) => {
          setItems(data);
          setLoading(false);
        });
      }
    },
  };
}
