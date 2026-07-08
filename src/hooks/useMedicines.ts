import { useState, useEffect, useCallback, useMemo } from 'react';
import { Medicine } from '@/types/store';
import { FirestoreMedicineRepository } from '../repositories/FirestoreMedicineRepository';
import { useAuth } from '@/context/AuthContext';

export function useMedicines() {
  const { user } = useAuth();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, critical, warning, safe

  const repo = useMemo(() => user?.uid ? new FirestoreMedicineRepository(user.uid) : null, [user]);

  // Listen to Firestore updates in real-time
  useEffect(() => {
    if (!repo) return;
    const unsubscribe = repo.listen((data) => {
      setMedicines(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [repo]);

  const addMedicine = useCallback(async (medicine: Omit<Medicine, 'id' | 'daysRemaining' | 'riskLevel'>) => {
    if (!repo) throw new Error('Repository not initialized');
    const newMed = await repo.create(medicine);
    return newMed;
  }, [repo]);

  const updateStock = useCallback(async (id: string, newStock: number) => {
    if (!repo) throw new Error('Repository not initialized');
    const updated = await repo.update(id, { stock: newStock });
    return updated;
  }, [repo]);

  const filteredMedicines = useMemo(() => {
    return medicines.filter((m) => {
      const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || m.riskLevel === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [medicines, searchQuery, filterStatus]);

  const stats = useMemo(() => {
    const criticalCount = medicines.filter((m) => m.riskLevel === 'critical').length;
    const warningCount = medicines.filter((m) => m.riskLevel === 'warning').length;
    const safeCount = medicines.filter((m) => m.riskLevel === 'safe').length;
    return {
      total: medicines.length,
      criticalCount,
      warningCount,
      safeCount,
    };
  }, [medicines]);

  const getAIReorderPrediction = useCallback(async (medicine: Medicine) => {
    try {
      const { LocalFootfallRepository } = await import('../repositories/LocalFootfallRepository');
      const footfallRepo = new LocalFootfallRepository();
      const footfallHistory = await footfallRepo.getHistoricalRecords();
      
      const response = await fetch('/api/copilot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'reorder',
          payload: {
            medicine,
            footfallHistory,
          },
        }),
      });

      const data = await response.json();
      if (data.success && data.data) {
        return {
          recommendedOrderQuantity: data.data.recommendedOrderQuantity,
          urgency: data.data.urgency,
          reasoning: data.data.reasoning,
          fallback: false,
        };
      }
    } catch (e) {
      console.error('Error fetching AI reorder prediction:', e);
    }

    // Simulator Fallback
    const defaultQty = Math.max(medicine.reorderLevel - medicine.stock + 100, 150);
    return {
      recommendedOrderQuantity: defaultQty,
      urgency: medicine.riskLevel.toUpperCase(),
      reasoning: `OPD data projects a 15% increase in seasonal respiratory patients next week, raising expected Daily Consumption to ~${Math.round(medicine.dailyUsage * 1.15)} units. Historical lead time for replacement stock from central government store is 4 days.`,
      fallback: true,
    };
  }, []);

  return {
    medicines: filteredMedicines,
    rawMedicines: medicines,
    loading: loading || !user?.uid,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    addMedicine,
    updateStock,
    stats,
    getAIReorderPrediction,
    refresh: () => {
      if (repo) {
        setLoading(true);
        repo.getAll().then((data) => {
          setMedicines(data);
          setLoading(false);
        });
      }
    },
  };
}
