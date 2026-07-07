import { IBriefingRepository } from './IBriefingRepository';
import { db } from '../lib/firebase';
import { FirestoreSeeder } from '../services/FirestoreSeeder';
import { 
  getDoc,
  doc, 
  setDoc,
  onSnapshot 
} from 'firebase/firestore';

export class FirestoreBriefingRepository implements IBriefingRepository {
  async getLatestBriefing(): Promise<string | null> {
    await FirestoreSeeder.seedIfEmpty(db);
    const docSnap = await getDoc(doc(db, 'briefing', 'latest'));
    if (!docSnap.exists()) return null;
    return docSnap.data().text || null;
  }

  async saveBriefing(briefing: string): Promise<void> {
    const briefingRef = doc(db, 'briefing', 'latest');
    await setDoc(briefingRef, { text: briefing });
  }

  async clearBriefing(): Promise<void> {
    const briefingRef = doc(db, 'briefing', 'latest');
    await setDoc(briefingRef, { text: null });
  }

  listen(callback: (data: string | null) => void): () => void {
    let unsub: (() => void) | null = null;
    let active = true;

    const setup = async () => {
      await FirestoreSeeder.seedIfEmpty(db);
      if (!active) return;
      unsub = onSnapshot(doc(db, 'briefing', 'latest'), (docSnap) => {
        if (docSnap.exists()) {
          callback(docSnap.data().text || null);
        } else {
          callback(null);
        }
      });
    };

    setup();

    return () => {
      active = false;
      if (unsub) unsub();
    };
  }
}
