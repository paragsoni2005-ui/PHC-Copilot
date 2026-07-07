import { 
  Firestore, 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  writeBatch, 
  serverTimestamp 
} from 'firebase/firestore';
import { mockMedicines } from '../mocks/medicines';
import { mockDoctors } from '../mocks/doctors';
import { 
  mockFootfallHistory, 
  mockDepartmentBreakdown, 
  mockHourlyLoad, 
  mockFootfallForecast 
} from '../mocks/footfall';

const seedChecklist = [
  { id: '1', text: 'Verify morning medicine stock registers', completed: true, priority: 'medium', category: 'General' },
  { id: '2', text: 'Reallocate staff for predicted Pediatric footfall surge', completed: false, priority: 'high', category: 'Staffing' },
  { id: '3', text: 'Review Doctor attendance and confirm leave schedules', completed: false, priority: 'high', category: 'Attendance' },
  { id: '4', text: 'Approve ORS urgent restock order', completed: false, priority: 'high', category: 'Inventory' },
];

const defaultBriefingText = 
  "Good Morning, Doctor. Here is your synthesized operations briefing for Sunday, July 5, 2026.\n\n" +
  "📦 Inventory & Supply Chains\n" +
  "We project a stockout of ORS Sachets and Albendazole 400mg within the next 48 hours. Active usage registers 50 sachets daily, while stock is down to 120. A replenishment request must be approved today to avoid critical shortages by Tuesday.\n\n" +
  "👥 Roster & Department Cover\n" +
  "Roster coverage is at 67% today. Dr. Ramesh Nair is ABSENT for the evening General OPD shift, posing an operational risk. We recommend reallocating Dr. Anita Desai (Gynecology, Afternoon) or inviting Dr. Rajesh Sharma to cover the gap.\n\n" +
  "📈 Patient Analytics & Surge Risk\n" +
  "A 25% pediatric patient surge is predicted between 10:00 AM and 1:00 PM due to seasonal viral patterns. Open an additional registration desk during these hours to prevent OPD queues exceeding 30 minutes.";

export class FirestoreSeeder {
  static async seedIfEmpty(db: Firestore): Promise<void> {
    try {
      const metaRef = doc(db, 'system', 'metadata');
      const metaSnap = await getDoc(metaRef);

      if (metaSnap.exists()) {
        // Already seeded
        return;
      }

      console.log('Firestore is empty. Starting database seeding...');

      // Write metadata document first to guard against other clients seeding concurrently
      await setDoc(metaRef, { 
        seeded: true, 
        seededAt: serverTimestamp() 
      });

      // Seeding Medicines
      const medBatch = writeBatch(db);
      mockMedicines.forEach((med) => {
        const medRef = doc(db, 'medicines', med.id);
        medBatch.set(medRef, med);
      });
      await medBatch.commit();

      // Seeding Doctors
      const docBatch = writeBatch(db);
      mockDoctors.forEach((doctor) => {
        const docRef = doc(db, 'doctors', doctor.id);
        docBatch.set(docRef, doctor);
      });
      await docBatch.commit();

      // Seeding Checklist
      const checklistBatch = writeBatch(db);
      seedChecklist.forEach((item) => {
        const itemRef = doc(db, 'checklist', item.id);
        checklistBatch.set(itemRef, item);
      });
      await checklistBatch.commit();

      // Seeding Briefing
      const briefingRef = doc(db, 'briefing', 'latest');
      await setDoc(briefingRef, { text: defaultBriefingText, updatedAt: serverTimestamp() });

      // Seeding Footfall Data
      const footfallRef = doc(db, 'footfall', 'data');
      await setDoc(footfallRef, {
        history: mockFootfallHistory,
        departments: mockDepartmentBreakdown,
        hourly: mockHourlyLoad,
        forecast: mockFootfallForecast,
        updatedAt: serverTimestamp()
      });

      console.log('Firestore database successfully seeded with operational default records.');
    } catch (error) {
      console.error('Error during Firestore database seeding:', error);
    }
  }
}
