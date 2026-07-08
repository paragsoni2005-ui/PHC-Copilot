import { IFootfallRepository, HistoricalPatients, DepartmentPatients, FootfallForecast } from './IFootfallRepository';
import { HourlyLoad } from '@/types/store';
import { db } from '../lib/firebase';
import { FirestoreSeeder } from '../services/FirestoreSeeder';
import { getDoc, doc } from 'firebase/firestore';

export class FirestoreFootfallRepository implements IFootfallRepository {
  constructor(private userId: string) {}

  private async getDataDoc(): Promise<any> {
    await FirestoreSeeder.seedIfEmpty(db, this.userId);
    const docSnap = await getDoc(doc(db, 'users', this.userId, 'footfall', 'data'));
    if (!docSnap.exists()) {
      throw new Error('Footfall document not found');
    }
    return docSnap.data();
  }

  async getHistoricalRecords(): Promise<HistoricalPatients[]> {
    const data = await this.getDataDoc();
    return data.history || [];
  }

  async getDepartmentBreakdown(): Promise<DepartmentPatients[]> {
    const data = await this.getDataDoc();
    return data.departments || [];
  }

  async getHourlyLoad(): Promise<HourlyLoad[]> {
    const data = await this.getDataDoc();
    return data.hourly || [];
  }

  async getForecast(): Promise<FootfallForecast> {
    const data = await this.getDataDoc();
    return data.forecast;
  }
}
