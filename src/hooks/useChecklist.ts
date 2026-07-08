import { useState, useEffect, useCallback, useMemo } from 'react';
import { FirestoreChecklistRepository } from '../repositories/FirestoreChecklistRepository';
import { ChecklistItem } from '../repositories/IChecklistRepository';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

function getTodayString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function useChecklist(dateStr?: string) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<'gemini' | 'rule-engine' | null>(null);

  const targetDate = dateStr || getTodayString();

  const repo = useMemo(() => user?.uid ? new FirestoreChecklistRepository(user.uid) : null, [user]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!repo || !user?.uid) return;
    const unsubscribe = repo.listen((data) => {
      setItems(data);
      const detectedSource = data.length > 0 ? data[0].generatedBy : null;
      setSource(detectedSource);
      setLoading(false);
    }, targetDate);
    return () => unsubscribe();
  }, [repo, targetDate, user?.uid]);

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
      await repo.toggleItem(id, completed, targetDate);
      showToast(completed ? `Completed task: ${item.title}` : `Reopened task: ${item.title}`, "info");
    } catch (e) {
      console.error(e);
    }
  }, [items, repo, targetDate, showToast]);

  const generateChecklist = useCallback(async () => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const { ChecklistGenerationService } = await import('../services/ChecklistGenerationService');
      const result = await ChecklistGenerationService.generateDailyChecklist(targetDate, user.uid);
      setItems(result.tasks);
      setSource(result.source);
    } catch (e) {
      console.error("Failed to generate checklist:", e);
    } finally {
      setLoading(false);
    }
  }, [targetDate, user]);

  // Trigger automatic generation on mount if the checklist is completely empty
  useEffect(() => {
    if (!loading && items.length === 0 && user?.uid) {
      Promise.resolve().then(() => generateChecklist());
    }
  }, [loading, items.length, generateChecklist, user?.uid]);

  return {
    items,
    loading: loading || !user?.uid,
    source,
    toggleItem,
    generateChecklist,
    refresh: () => {
      if (repo) {
        setLoading(true);
        repo.getItems(targetDate).then((data) => {
          setItems(data);
          const detectedSource = data.length > 0 ? data[0].generatedBy : null;
          setSource(detectedSource);
          setLoading(false);
        });
      }
    },
  };
}
