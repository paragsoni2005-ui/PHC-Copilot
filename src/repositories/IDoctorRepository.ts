import { Doctor } from '@/types/store';

export interface IDoctorRepository {
  getAll(): Promise<Doctor[]>;
  updateStatus(id: string, status: Doctor['status']): Promise<Doctor>;
  listen(callback: (data: Doctor[]) => void): () => void;
}
