import { Patient } from "@/types/store";
import { IPatientRepository } from "./IPatientRepository";
import { db } from "../lib/firebase";
import { FirestoreSeeder } from "../services/FirestoreSeeder";
import { 
  collection, 
  getDocs, 
  getDoc,
  doc, 
  setDoc,
  deleteDoc, 
  onSnapshot,
  query,
  where,
  orderBy,
  Timestamp 
} from "firebase/firestore";

export class FirestorePatientRepository implements IPatientRepository {
  constructor(private userId: string) {}

  private convertTimestamp(data: any): any {
    if (data && data.registeredAt && typeof data.registeredAt.toDate === "function") {
      return {
        ...data,
        registeredAt: data.registeredAt.toDate().toISOString()
      };
    }
    return data;
  }

  async getAll(): Promise<Patient[]> {
    await FirestoreSeeder.seedIfEmpty(db, this.userId);
    const snap = await getDocs(query(collection(db, "users", this.userId, "patients"), orderBy("registeredAt", "desc")));
    const list: Patient[] = [];
    snap.forEach((doc) => {
      const data = doc.data();
      list.push(this.convertTimestamp({ ...data, patientId: doc.id }) as Patient);
    });
    return list;
  }

  async getTodayPatients(): Promise<Patient[]> {
    await FirestoreSeeder.seedIfEmpty(db, this.userId);
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const startTimestamp = Timestamp.fromDate(startOfToday);

    const q = query(
      collection(db, "users", this.userId, "patients"),
      where("registeredAt", ">=", startTimestamp),
      orderBy("registeredAt", "desc")
    );

    const snap = await getDocs(q);
    const list: Patient[] = [];
    snap.forEach((doc) => {
      const data = doc.data();
      list.push(this.convertTimestamp({ ...data, patientId: doc.id }) as Patient);
    });
    return list;
  }

  async getById(id: string): Promise<Patient | null> {
    const docSnap = await getDoc(doc(db, "users", this.userId, "patients", id));
    if (!docSnap.exists()) return null;
    const data = docSnap.data();
    return this.convertTimestamp({ ...data, patientId: docSnap.id }) as Patient;
  }

  async create(patient: Omit<Patient, "patientId" | "registeredAt">): Promise<Patient> {
    const patientId = `pat-${Date.now()}`;
    const registeredAt = Timestamp.now();
    const newPatient = {
      ...patient,
      patientId,
      registeredAt
    };
    await setDoc(doc(db, "users", this.userId, "patients", patientId), newPatient);
    return this.convertTimestamp(newPatient) as Patient;
  }

  async update(id: string, updates: Partial<Patient>): Promise<Patient> {
    const docRef = doc(db, "users", this.userId, "patients", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw new Error(`Patient with id ${id} not found`);
    }
    const current = docSnap.data();
    const updated = {
      ...current,
      ...updates
    };
    await setDoc(docRef, updated);
    return this.convertTimestamp(updated) as Patient;
  }

  async delete(id: string): Promise<boolean> {
    const docRef = doc(db, "users", this.userId, "patients", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return false;
    await deleteDoc(docRef);
    return true;
  }

  listenToToday(callback: (patients: Patient[]) => void): () => void {
    let unsub: (() => void) | null = null;
    let active = true;

    const setup = async () => {
      await FirestoreSeeder.seedIfEmpty(db, this.userId);
      if (!active) return;

      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      const startTimestamp = Timestamp.fromDate(startOfToday);

      const q = query(
        collection(db, "users", this.userId, "patients"),
        where("registeredAt", ">=", startTimestamp),
        orderBy("registeredAt", "desc")
      );

      unsub = onSnapshot(q, (snap) => {
        const list: Patient[] = [];
        snap.forEach((doc) => {
          const data = doc.data();
          list.push(this.convertTimestamp({ ...data, patientId: doc.id }) as Patient);
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

  listenToRecent(days: number, callback: (patients: Patient[]) => void): () => void {
    let unsub: (() => void) | null = null;
    let active = true;

    const setup = async () => {
      await FirestoreSeeder.seedIfEmpty(db, this.userId);
      if (!active) return;

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      cutoffDate.setHours(0, 0, 0, 0);
      const cutoffTimestamp = Timestamp.fromDate(cutoffDate);

      const q = query(
        collection(db, "users", this.userId, "patients"),
        where("registeredAt", ">=", cutoffTimestamp),
        orderBy("registeredAt", "desc")
      );

      unsub = onSnapshot(q, (snap) => {
        const list: Patient[] = [];
        snap.forEach((doc) => {
          const data = doc.data();
          list.push(this.convertTimestamp({ ...data, patientId: doc.id }) as Patient);
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
