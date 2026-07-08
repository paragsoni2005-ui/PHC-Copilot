import { ChecklistItem, IChecklistRepository } from './IChecklistRepository';
import { db } from '../lib/firebase';
import { FirestoreSeeder } from '../services/FirestoreSeeder';
import { 
  collection, 
  getDocs, 
  getDoc,
  doc, 
  setDoc,
  writeBatch,
  onSnapshot 
} from 'firebase/firestore';

function getTodayString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export class FirestoreChecklistRepository implements IChecklistRepository {
  constructor(private userId: string) {}

  async getItems(date?: string): Promise<ChecklistItem[]> {
    await FirestoreSeeder.seedIfEmpty(db, this.userId);
    const dStr = date || getTodayString();
    const colRef = collection(db, 'users', this.userId, 'dailyBriefings', dStr, 'checklist');
    const snap = await getDocs(colRef);
    const list: ChecklistItem[] = [];
    snap.forEach((doc) => {
      list.push({ ...(doc.data() as ChecklistItem), id: doc.id });
    });
    return list.sort((a, b) => a.id.localeCompare(b.id));
  }

  async toggleItem(id: string, completed: boolean, date?: string): Promise<void> {
    const dStr = date || getTodayString();
    const docRef = doc(db, 'users', this.userId, 'dailyBriefings', dStr, 'checklist', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as ChecklistItem;
      await setDoc(docRef, { 
        ...data, 
        completed,
        completedAt: completed ? new Date().toISOString() : null
      });
    }
  }

  async saveItems(items: ChecklistItem[], date?: string): Promise<void> {
    const dStr = date || getTodayString();
    const batch = writeBatch(db);
    items.forEach((item) => {
      const itemRef = doc(db, 'users', this.userId, 'dailyBriefings', dStr, 'checklist', item.id);
      batch.set(itemRef, item);
    });
    await batch.commit();
  }

  listen(callback: (data: ChecklistItem[]) => void, date?: string): () => void {
    let unsub: (() => void) | null = null;
    let active = true;

    const setup = async () => {
      await FirestoreSeeder.seedIfEmpty(db, this.userId);
      if (!active) return;
      const dStr = date || getTodayString();
      const colRef = collection(db, 'users', this.userId, 'dailyBriefings', dStr, 'checklist');
      unsub = onSnapshot(colRef, (snap) => {
        const list: ChecklistItem[] = [];
        snap.forEach((doc) => {
          list.push({ ...(doc.data() as ChecklistItem), id: doc.id });
        });
        callback(list.sort((a, b) => a.id.localeCompare(b.id)));
      });
    };

    setup();

    return () => {
      active = false;
      if (unsub) unsub();
    };
  }
}
