import { useState, useEffect, useCallback } from 'react';
import { LocalBriefingRepository } from '../repositories/LocalBriefingRepository';
import { FirestoreBriefingRepository } from '../repositories/FirestoreBriefingRepository';
import { LocalMedicineRepository } from '../repositories/LocalMedicineRepository';
import { FirestoreMedicineRepository } from '../repositories/FirestoreMedicineRepository';
import { LocalDoctorRepository } from '../repositories/LocalDoctorRepository';
import { FirestoreDoctorRepository } from '../repositories/FirestoreDoctorRepository';
import { LocalFootfallRepository } from '../repositories/LocalFootfallRepository';
import { FirestoreFootfallRepository } from '../repositories/FirestoreFootfallRepository';
import { LocalSettingsRepository } from '../repositories/LocalSettingsRepository';
import { IBriefingRepository } from '../repositories/IBriefingRepository';

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
  const [briefing, setBriefing] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number>(94);
  const [reasoning, setReasoning] = useState(defaultReasoning);
  const [fallbackActive, setFallbackActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const [repo, setRepo] = useState<IBriefingRepository | null>(null);
  const [medRepo, setMedRepo] = useState<any>(null);
  const [docRepo, setDocRepo] = useState<any>(null);
  const [footRepo, setFootRepo] = useState<any>(null);

  // Initialize repositories based on settings
  useEffect(() => {
    const initRepos = async () => {
      const settingsRepo = new LocalSettingsRepository();
      const settings = await settingsRepo.getSettings();
      if (settings.mode === 'live') {
        setRepo(new FirestoreBriefingRepository());
        setMedRepo(new FirestoreMedicineRepository());
        setDocRepo(new FirestoreDoctorRepository());
        setFootRepo(new FirestoreFootfallRepository());
      } else {
        setRepo(new LocalBriefingRepository());
        setMedRepo(new LocalMedicineRepository());
        setDocRepo(new LocalDoctorRepository());
        setFootRepo(new LocalFootfallRepository());
      }
    };
    initRepos();
  }, []);

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
    if (!repo) return;
    setLoading(true);
    const unsubscribe = repo.listen((data) => {
      parseAndSetData(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [repo, parseAndSetData]);

  const generateBriefing = useCallback(async () => {
    if (!repo || !medRepo || !docRepo || !footRepo) return;
    setLoading(true);
    setIsGenerating(true);
    const settingsRepo = new LocalSettingsRepository();
    try {
      const settings = await settingsRepo.getSettings();

      if (settings.mode === 'live') {
        // Gather current states from Firestore
        const medicines = await medRepo.getAll();
        const doctors = await docRepo.getAll();
        const forecast = await footRepo.getForecast();
        const hourlyLoad = await footRepo.getHourlyLoad();

        const response = await fetch('/api/copilot', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-gemini-api-key': settings.apiKey,
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
          const rawBriefing = data.data;
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
          setIsGenerating(false);
          setLoading(false);
          return;
        } else {
          console.warn('Backend returned failure, falling back to simulator', data.error);
        }
      }

      // Simulator Fallback
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const defaultData = await repo.getLatestBriefing();
      const settingsLocal = await settingsRepo.getSettings();

      const serializedData: BriefingData = {
        text: defaultData || '',
        confidence: 94,
        reasoning: defaultReasoning,
        fallbackActive: settingsLocal.mode === 'live',
      };

      const serializedString = JSON.stringify(serializedData);
      await repo.saveBriefing(serializedString);
      parseAndSetData(serializedString);
    } catch (e) {
      console.error(e);
      // Fallback on network/fetch errors
      const defaultData = await repo.getLatestBriefing();
      const settingsLocal = await settingsRepo.getSettings();
      const serializedData: BriefingData = {
        text: defaultData || '',
        confidence: 94,
        reasoning: defaultReasoning,
        fallbackActive: settingsLocal.mode === 'live',
      };
      const serializedString = JSON.stringify(serializedData);
      parseAndSetData(serializedString);
    } finally {
      setIsGenerating(false);
      setLoading(false);
    }
  }, [repo, medRepo, docRepo, footRepo, parseAndSetData]);

  return {
    briefing,
    confidence,
    reasoning,
    fallbackActive,
    loading,
    isGenerating,
    generateBriefing,
  };
}
