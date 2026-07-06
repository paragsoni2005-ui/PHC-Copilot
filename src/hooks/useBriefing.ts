import { useState, useEffect, useCallback } from 'react';
import { LocalBriefingRepository } from '../repositories/LocalBriefingRepository';

const repo = new LocalBriefingRepository();

export function useBriefing() {
  const [briefing, setBriefing] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchBriefing = useCallback(async (forceRegenerate = false) => {
    if (forceRegenerate) {
      setIsGenerating(true);
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const data = await repo.getLatestBriefing();
      setBriefing(data);
      setIsGenerating(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await repo.getLatestBriefing();
      setBriefing(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch simulates loading
    const timer = setTimeout(() => {
      fetchBriefing();
    }, 1500);
    return () => clearTimeout(timer);
  }, [fetchBriefing]);

  const generateBriefing = useCallback(async () => {
    await fetchBriefing(true);
  }, [fetchBriefing]);

  return {
    briefing,
    loading,
    isGenerating,
    generateBriefing,
  };
}
