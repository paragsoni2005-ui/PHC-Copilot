import { useState, useEffect, useCallback } from 'react';
import { LocalBriefingRepository } from '../repositories/LocalBriefingRepository';
import { LocalMedicineRepository } from '../repositories/LocalMedicineRepository';
import { LocalDoctorRepository } from '../repositories/LocalDoctorRepository';
import { LocalFootfallRepository } from '../repositories/LocalFootfallRepository';
import { LocalSettingsRepository } from '../repositories/LocalSettingsRepository';

const repo = new LocalBriefingRepository();
const medicineRepo = new LocalMedicineRepository();
const doctorRepo = new LocalDoctorRepository();
const footfallRepo = new LocalFootfallRepository();
const settingsRepo = new LocalSettingsRepository();

const defaultReasoning = {
  inventory: "ORS consumption models are based on the past 14 days of summer diarrheal logs. Stock reorder levels were breached on July 3.",
  surge: "The 25% pediatric surge forecast correlates with regional temperature spikes and local school virus reports.",
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

  const fetchBriefing = useCallback(async (forceRegenerate = false) => {
    setLoading(true);
    if (forceRegenerate) {
      setIsGenerating(true);
    }
    try {
      if (forceRegenerate) {
        const settings = await settingsRepo.getSettings();
        if (settings.mode === 'live') {
          // Gather current states
          const medicines = await medicineRepo.getAll();
          const doctors = await doctorRepo.getAll();
          const forecast = await footfallRepo.getForecast();
          const hourlyLoad = await footfallRepo.getHourlyLoad();

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
            // Format the full briefing text string from structured response
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
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const defaultData = await repo.getLatestBriefing();
        const settingsLocal = await settingsRepo.getSettings();

        // Create serialized structure with fallbackActive: true if live mode failed
        const serializedData: BriefingData = {
          text: defaultData || '',
          confidence: 94,
          reasoning: defaultReasoning,
          fallbackActive: settingsLocal.mode === 'live', // Active warning if key/network failed in Live mode
        };

        const serializedString = JSON.stringify(serializedData);
        await repo.saveBriefing(serializedString);
        parseAndSetData(serializedString);
        setIsGenerating(false);
        setLoading(false);
        return;
      }

      const data = await repo.getLatestBriefing();
      parseAndSetData(data);
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
  }, [parseAndSetData]);

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
    confidence,
    reasoning,
    fallbackActive,
    loading,
    isGenerating,
    generateBriefing,
  };
}
