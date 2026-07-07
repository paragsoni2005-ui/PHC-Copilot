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

export class FirestoreChecklistRepository implements IChecklistRepository {
  async getItems(): Promise<ChecklistItem[]> {
    await FirestoreSeeder.seedIfEmpty(db);
    const snap = await getDocs(collection(db, 'checklist'));
    const list: ChecklistItem[] = [];
    snap.forEach((doc) => {
      list.push({ ...(doc.data() as ChecklistItem), id: doc.id });
    });
    return list.sort((a, b) => a.id.localeCompare(b.id));
  }

  async toggleItem(id: string, completed: boolean): Promise<void> {
    const docRef = doc(db, 'checklist', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as ChecklistItem;
      await setDoc(docRef, { ...data, completed });
    }
  }

  async saveItems(items: ChecklistItem[]): Promise<void> {
    const batch = writeBatch(db);
    items.forEach((item) => {
      const itemRef = doc(db, 'checklist', item.id);
      batch.set(itemRef, item);
    });
    await batch.commit();
  }

  listen(callback: (data: ChecklistItem[]) => void): () => void {
    let unsub: (() => void) | null = null;
    let active = true;

    const setup = async () => {
      await FirestoreSeeder.seedIfEmpty(db);
      if (!active) return;
      unsub = onSnapshot(collection(db, 'checklist'), (snap) => {
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
