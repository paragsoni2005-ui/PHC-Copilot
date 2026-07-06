import { useState, useEffect, useCallback, useMemo } from 'react';
import { Medicine } from '@/types/store';
import { LocalMedicineRepository } from '../repositories/LocalMedicineRepository';

const repo = new LocalMedicineRepository();

export function useMedicines() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, critical, warning, safe

  const fetchMedicines = useCallback(async () => {
    setLoading(true);
    try {
      const data = await repo.getAll();
      setMedicines(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedicines();
  }, [fetchMedicines]);

  const addMedicine = useCallback(async (medicine: Omit<Medicine, 'id' | 'daysRemaining' | 'riskLevel'>) => {
    const newMed = await repo.create(medicine);
    setMedicines((prev) => [...prev, newMed]);
    return newMed;
  }, []);

  const updateStock = useCallback(async (id: string, newStock: number) => {
    const updated = await repo.update(id, { stock: newStock });
    setMedicines((prev) => prev.map((m) => (m.id === id ? updated : m)));
    return updated;
  }, []);

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

  return {
    medicines: filteredMedicines,
    rawMedicines: medicines,
    loading,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    addMedicine,
    updateStock,
    stats,
    refresh: fetchMedicines,
  };
}
