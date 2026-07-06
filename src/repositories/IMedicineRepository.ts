import { Medicine } from '@/types/store';

export interface IMedicineRepository {
  getAll(): Promise<Medicine[]>;
  getById(id: string): Promise<Medicine | null>;
  create(medicine: Omit<Medicine, 'id' | 'daysRemaining' | 'riskLevel'>): Promise<Medicine>;
  update(id: string, updates: Partial<Medicine>): Promise<Medicine>;
  delete(id: string): Promise<boolean>;
}
