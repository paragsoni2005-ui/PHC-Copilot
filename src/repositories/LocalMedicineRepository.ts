import { Medicine } from '@/types/store';
import { IMedicineRepository } from './IMedicineRepository';
import { mockMedicines } from '../mocks/medicines';

const STORAGE_KEY = 'phc_medicines';

export class LocalMedicineRepository implements IMedicineRepository {
  private isClient(): boolean {
    return typeof window !== 'undefined';
  }

  private calculateComputedFields(med: Omit<Medicine, 'daysRemaining' | 'riskLevel'>): Medicine {
    const daysRemaining = med.dailyUsage > 0 ? Number((med.stock / med.dailyUsage).toFixed(1)) : 999;
    let riskLevel: Medicine['riskLevel'] = 'safe';
    if (daysRemaining < 3) {
      riskLevel = 'critical';
    } else if (daysRemaining <= 7) {
      riskLevel = 'warning';
    }
    return {
      ...med,
      daysRemaining,
      riskLevel,
    };
  }

  async getAll(): Promise<Medicine[]> {
    if (!this.isClient()) return mockMedicines;
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      // Seed initial data
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockMedicines));
      return mockMedicines;
    }
    try {
      const parsed = JSON.parse(data) as Medicine[];
      // Always recalculate to ensure correctness
      return parsed.map((m) => this.calculateComputedFields(m));
    } catch {
      return mockMedicines;
    }
  }

  async getById(id: string): Promise<Medicine | null> {
    const list = await this.getAll();
    return list.find((m) => m.id === id) || null;
  }

  async create(medicine: Omit<Medicine, 'id' | 'daysRemaining' | 'riskLevel'>): Promise<Medicine> {
    const list = await this.getAll();
    const newMed: Medicine = this.calculateComputedFields({
      ...medicine,
      id: `med-${Date.now()}`,
    });
    list.push(newMed);
    if (this.isClient()) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }
    return newMed;
  }

  async update(id: string, updates: Partial<Medicine>): Promise<Medicine> {
    const list = await this.getAll();
    const index = list.findIndex((m) => m.id === id);
    if (index === -1) {
      throw new Error(`Medicine with id ${id} not found`);
    }
    const current = list[index];
    const updatedRaw = {
      ...current,
      ...updates,
    };
    // Re-calculate computed fields based on updated values
    const updated = this.calculateComputedFields(updatedRaw);
    list[index] = updated;
    if (this.isClient()) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const list = await this.getAll();
    const filtered = list.filter((m) => m.id !== id);
    if (filtered.length === list.length) return false;
    if (this.isClient()) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    }
    return true;
  }

  listen(callback: (data: Medicine[]) => void): () => void {
    this.getAll().then(callback);
    return () => {};
  }
}
