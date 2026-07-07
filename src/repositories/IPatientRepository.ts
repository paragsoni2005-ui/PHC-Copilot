import { Patient } from "@/types/store";

export interface IPatientRepository {
  getAll(): Promise<Patient[]>;
  getTodayPatients(): Promise<Patient[]>;
  getById(id: string): Promise<Patient | null>;
  create(patient: Omit<Patient, "patientId" | "registeredAt">): Promise<Patient>;
  update(id: string, updates: Partial<Patient>): Promise<Patient>;
  delete(id: string): Promise<boolean>;
  listenToToday(callback: (patients: Patient[]) => void): () => void;
  listenToRecent(days: number, callback: (patients: Patient[]) => void): () => void;
}
