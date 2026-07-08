import { Medicine } from '@/types/store';
import { IMedicineRepository } from './IMedicineRepository';
import { db } from '../lib/firebase';
import { FirestoreSeeder } from '../services/FirestoreSeeder';
import { 
  collection, 
  getDocs, 
  getDoc,
  doc, 
  setDoc,
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';

export class FirestoreMedicineRepository implements IMedicineRepository {
  constructor(private userId: string) {}

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
    await FirestoreSeeder.seedIfEmpty(db, this.userId);
    const snap = await getDocs(collection(db, 'users', this.userId, 'medicines'));
    const list: Medicine[] = [];
    snap.forEach((doc) => {
      const data = doc.data() as Omit<Medicine, 'id'>;
      list.push(this.calculateComputedFields({ ...data, id: doc.id }));
    });
    return list;
  }

  async getById(id: string): Promise<Medicine | null> {
    const docSnap = await getDoc(doc(db, 'users', this.userId, 'medicines', id));
    if (!docSnap.exists()) return null;
    const data = docSnap.data() as Omit<Medicine, 'id'>;
    return this.calculateComputedFields({ ...data, id: docSnap.id });
  }

  async create(medicine: Omit<Medicine, 'id' | 'daysRemaining' | 'riskLevel'>): Promise<Medicine> {
    const id = `med-${Date.now()}`;
    const newMedRaw = { ...medicine, id };
    const newMed = this.calculateComputedFields(newMedRaw);
    await setDoc(doc(db, 'users', this.userId, 'medicines', id), newMed);
    return newMed;
  }

  async update(id: string, updates: Partial<Medicine>): Promise<Medicine> {
    const docRef = doc(db, 'users', this.userId, 'medicines', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw new Error(`Medicine with id ${id} not found`);
    }
    const current = docSnap.data() as Medicine;
    const updatedRaw = {
      ...current,
      ...updates,
    };
    const updated = this.calculateComputedFields(updatedRaw);
    await setDoc(docRef, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const docRef = doc(db, 'users', this.userId, 'medicines', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return false;
    await deleteDoc(docRef);
    return true;
  }

  listen(callback: (data: Medicine[]) => void): () => void {
    let unsub: (() => void) | null = null;
    let active = true;

    const setup = async () => {
      await FirestoreSeeder.seedIfEmpty(db, this.userId);
      if (!active) return;
      unsub = onSnapshot(collection(db, 'users', this.userId, 'medicines'), (snap) => {
        const list: Medicine[] = [];
        snap.forEach((doc) => {
          const data = doc.data() as Omit<Medicine, 'id'>;
          list.push(this.calculateComputedFields({ ...data, id: doc.id }));
        });
        callback(list);
      });
    };

    setup();

    return () => {
      active = false;
      if (unsub) unsub();
    };
  }
}
