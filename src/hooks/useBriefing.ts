import { useState, useEffect, useCallback, useMemo } from 'react';
import { FirestoreBriefingRepository } from '../repositories/FirestoreBriefingRepository';
import { FirestoreMedicineRepository } from '../repositories/FirestoreMedicineRepository';
import { FirestoreDoctorRepository } from '../repositories/FirestoreDoctorRepository';
import { FirestoreFootfallRepository } from '../repositories/FirestoreFootfallRepository';
import { useAuth } from '@/context/AuthContext';

const defaultReasoning = {
  inventory: "ORS consumption models are based on the past 14 days of summer diarrheal logs. Stock reorder levels were breached on July 3.",
  surge: "The 25% pediatric surge forecast correlates with regional temperature spikes and local school viral reports.",
  roster: "Roster reallocations prioritize maintaining minimum pediatric and gynecological specialist coverage thresholds."
};

interface BriefingData {
  text: string;
  confidence: number;
  reasoning: {
    inventory: string;
    surge: string;
    roster: string;
  };
  fallbackActive: boolean;
}

export function useBriefing() {
  const { user } = useAuth();
  const [briefing, setBriefing] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number>(94);
  const [reasoning, setReasoning] = useState(defaultReasoning);
  const [fallbackActive, setFallbackActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const repo = useMemo(() => user?.uid ? new FirestoreBriefingRepository(user.uid) : null, [user]);
  const medRepo = useMemo(() => user?.uid ? new FirestoreMedicineRepository(user.uid) : null, [user]);
  const docRepo = useMemo(() => user?.uid ? new FirestoreDoctorRepository(user.uid) : null, [user]);
  const footRepo = useMemo(() => user?.uid ? new FirestoreFootfallRepository(user.uid) : null, [user]);

  const parseAndSetData = useCallback((rawData: string | null) => {
    if (!rawData) {
      setBriefing(null);
      setConfidence(94);
      setReasoning(defaultReasoning);
      setFallbackActive(false);
      return;
    }

    if (rawData.trim().startsWith('{')) {
      try {
        const parsed = JSON.parse(rawData) as BriefingData;
        setBriefing(parsed.text);
        setConfidence(parsed.confidence);
        setReasoning(parsed.reasoning);
        setFallbackActive(parsed.fallbackActive);
        return;
      } catch {
        // Fall through to plain text if JSON parse fails
      }
    }

    setBriefing(rawData);
    setConfidence(94);
    setReasoning(defaultReasoning);
    setFallbackActive(false);
  }, []);

  // Listen for real-time briefing updates
  useEffect(() => {
    if (!repo || !user?.uid) return;
    const unsubscribe = repo.listen((data) => {
      parseAndSetData(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [repo, parseAndSetData, user?.uid]);

  const generateBriefing = useCallback(async () => {
    if (!repo || !medRepo || !docRepo || !footRepo || !user?.uid) return;
    setLoading(true);
    setIsGenerating(true);
    try {
      // Gather current states from Firestore
      const medicines = await medRepo.getAll();
      const doctors = await docRepo.getAll();
      const forecast = await footRepo.getForecast();
      const hourlyLoad = await footRepo.getHourlyLoad();

      const response = await fetch('/api/copilot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'briefing',
          payload: {
            medicines,
            doctors,
            footfall: { forecast, hourlyLoad },
          },
        }),
      });

      const data = await response.json();
      if (data.success && data.data) {
        const combined = data.data;
        const rawBriefing = combined.briefing;
        const rawChecklist = combined.checklist;
        
        const formattedText = 
          `${rawBriefing.intro}\n\n` +
          `📦 Inventory & Supply Chains\n${rawBriefing.inventorySummary}\n\n` +
          `👥 Roster & Department Cover\n${rawBriefing.rosterSummary}\n\n` +
          `📈 Patient Analytics & Surge Risk\n${rawBriefing.surgeSummary}`;

        const serializedData: BriefingData = {
          text: formattedText,
          confidence: rawBriefing.confidenceScore,
          reasoning: {
            inventory: rawBriefing.inventoryReasoning,
            surge: rawBriefing.surgeReasoning,
            roster: rawBriefing.rosterReasoning,
          },
          fallbackActive: false,
        };

        const serializedString = JSON.stringify(serializedData);
        await repo.saveBriefing(serializedString);
        parseAndSetData(serializedString);

        // Merge and save checklist tasks from the combined response
        try {
          const { ChecklistGenerationService } = await import('../services/ChecklistGenerationService');
          const todayStr = new Date().toISOString().split('T')[0];
          if (rawChecklist && Array.isArray(rawChecklist.tasks)) {
            await ChecklistGenerationService.mergeAndSaveTasks(rawChecklist.tasks, todayStr, 'gemini', user.uid);
          } else {
            await ChecklistGenerationService.generateDailyChecklist(todayStr, user.uid);
          }
        } catch (errChecklist) {
          console.error("Failed to generate checklist alongside briefing:", errChecklist);
        }

        setIsGenerating(false);
        setLoading(false);
        return;
      } else {
        console.warn('Backend returned failure, falling back to simulator', data.error);
      }

      // Simulator Fallback
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const defaultData = await repo.getLatestBriefing();

      const serializedData: BriefingData = {
        text: defaultData || '',
        confidence: 94,
        reasoning: defaultReasoning,
        fallbackActive: true,
      };

      const serializedString = JSON.stringify(serializedData);
      await repo.saveBriefing(serializedString);
      parseAndSetData(serializedString);

      // Generate checklist dynamically alongside briefing
      try {
        const { ChecklistGenerationService } = await import('../services/ChecklistGenerationService');
        const todayStr = new Date().toISOString().split('T')[0];
        await ChecklistGenerationService.generateDailyChecklist(todayStr, user.uid);
      } catch (errChecklist) {
        console.error("Failed to generate checklist alongside briefing:", errChecklist);
      }
    } catch (e) {
      console.error(e);
      // Fallback on network/fetch errors
      const defaultData = await repo.getLatestBriefing();
      const serializedData: BriefingData = {
        text: defaultData || '',
        confidence: 94,
        reasoning: defaultReasoning,
        fallbackActive: true,
      };
      const serializedString = JSON.stringify(serializedData);
      parseAndSetData(serializedString);
    } finally {
      setIsGenerating(false);
      setLoading(false);
    }
  }, [repo, medRepo, docRepo, footRepo, parseAndSetData, user]);

  return {
    briefing,
    confidence,
    reasoning,
    fallbackActive,
    loading: loading || !user?.uid,
    isGenerating,
    generateBriefing,
  };
}
