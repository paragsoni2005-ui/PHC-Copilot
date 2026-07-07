import { Doctor } from '@/types/store';
import { IDoctorRepository } from './IDoctorRepository';
import { mockDoctors } from '../mocks/doctors';

const STORAGE_KEY = 'phc_doctors';

export class LocalDoctorRepository implements IDoctorRepository {
  private isClient(): boolean {
    return typeof window !== 'undefined';
  }

  async getAll(): Promise<Doctor[]> {
    if (!this.isClient()) return mockDoctors;
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockDoctors));
      return mockDoctors;
    }
    try {
      return JSON.parse(data) as Doctor[];
    } catch {
      return mockDoctors;
    }
  }

  async updateStatus(id: string, status: Doctor['status']): Promise<Doctor> {
    const list = await this.getAll();
    const index = list.findIndex((d) => d.id === id);
    if (index === -1) {
      throw new Error(`Doctor with id ${id} not found`);
    }
    list[index].status = status;
    if (this.isClient()) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }
    return list[index];
  }

  listen(callback: (data: Doctor[]) => void): () => void {
    this.getAll().then(callback);
    return () => {};
  }
}
