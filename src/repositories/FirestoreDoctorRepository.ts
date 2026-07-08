import { Doctor } from '@/types/store';
import { IDoctorRepository } from './IDoctorRepository';
import { db } from '../lib/firebase';
import { FirestoreSeeder } from '../services/FirestoreSeeder';
import { 
  collection, 
  getDocs, 
  getDoc,
  doc, 
  setDoc,
  onSnapshot 
} from 'firebase/firestore';

export class FirestoreDoctorRepository implements IDoctorRepository {
  constructor(private userId: string) {}

  async getAll(): Promise<Doctor[]> {
    await FirestoreSeeder.seedIfEmpty(db, this.userId);
    const snap = await getDocs(collection(db, 'users', this.userId, 'doctors'));
    const list: Doctor[] = [];
    snap.forEach((doc) => {
      list.push({ ...(doc.data() as Doctor), id: doc.id });
    });
    return list;
  }

  async updateStatus(id: string, status: Doctor['status']): Promise<Doctor> {
    const docRef = doc(db, 'users', this.userId, 'doctors', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw new Error(`Doctor with id ${id} not found`);
    }
    const current = docSnap.data() as Doctor;
    const updated = {
      ...current,
      status,
    };
    await setDoc(docRef, updated);
    return updated;
  }

  listen(callback: (data: Doctor[]) => void): () => void {
    let unsub: (() => void) | null = null;
    let active = true;

    const setup = async () => {
      await FirestoreSeeder.seedIfEmpty(db, this.userId);
      if (!active) return;
      unsub = onSnapshot(collection(db, 'users', this.userId, 'doctors'), (snap) => {
        const list: Doctor[] = [];
        snap.forEach((doc) => {
          list.push({ ...(doc.data() as Doctor), id: doc.id });
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
