import { 
  Firestore, 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  writeBatch, 
  serverTimestamp,
  Timestamp 
} from "firebase/firestore";
import { mockMedicines } from "../mocks/medicines";
import { mockDoctors } from "../mocks/doctors";
import { 
  mockFootfallHistory, 
  mockDepartmentBreakdown, 
  mockHourlyLoad, 
  mockFootfallForecast 
} from "../mocks/footfall";

const seedChecklist = [
  { id: "1", text: "Verify morning medicine stock registers", completed: true, priority: "medium", category: "General" },
  { id: "2", text: "Reallocate staff for predicted Pediatric footfall surge", completed: false, priority: "high", category: "Staffing" },
  { id: "3", text: "Review Doctor attendance and confirm leave schedules", completed: false, priority: "high", category: "Attendance" },
  { id: "4", text: "Approve ORS urgent restock order", completed: false, priority: "high", category: "Inventory" },
];

const defaultBriefingText = 
  "Good Morning, Doctor. Here is your synthesized operations briefing for Sunday, July 5, 2026.\n\n" +
  "📦 Inventory & Supply Chains\n" +
  "We project a stockout of ORS Sachets and Albendazole 400mg within the next 48 hours. Active usage registers 50 sachets daily, while stock is down to 120. A replenishment request must be approved today to avoid critical shortages by Tuesday.\n\n" +
  "👥 Roster & Department Cover\n" +
  "Roster coverage is at 67% today. Dr. Ramesh Nair is ABSENT for the evening General OPD shift, posing an operational risk. We recommend reallocating Dr. Anita Desai (Gynecology, Afternoon) or inviting Dr. Rajesh Sharma to cover the gap.\n\n" +
  "📈 Patient Analytics & Surge Risk\n" +
  "A 25% pediatric patient surge is predicted between 10:00 AM and 1:00 PM due to seasonal viral patterns. Open an additional registration desk during these hours to prevent OPD queues exceeding 30 minutes.";

// Generate 70 realistic patient records over the last 7 days
function generateHistoricalPatients(): any[] {
  const list: any[] = [];
  const villages = ["Raipur", "Begampur", "Surajpur", "Kalyanpur", "Rampur", "Mohanpur"];
  const maleNames = ["Ramesh", "Arjun", "Rahul", "Mohan", "Sunil", "Amit", "Rajesh", "Vijay", "Sanjay", "Karan"];
  const femaleNames = ["Sita", "Priya", "Geeta", "Lakshmi", "Kavita", "Anjali", "Pooja", "Rekha", "Neha", "Divya"];
  
  const symptomsByDept = {
    "General OPD": [
      "High fever with chills and headache",
      "Severe abdominal pain and acid reflux",
      "Back ache, leg stiffness and muscle pain",
      "Chronic cough with sputum and congestion",
      "Dizziness, hypertension and mild chest pressure"
    ],
    "Pediatrics": [
      "Runny nose, sneezing and hacking cough",
      "High fever with nausea and vomiting",
      "Watery stool, stomach cramps and dehydration",
      "Skin rashes on arms and back with itching"
    ],
    "Gynecology": [
      "Routine second-trimester prenatal checkup",
      "Severe lower abdominal cramping",
      "Irregular menstrual cycles with heavy pain",
      "Post-pregnancy checkup and counseling"
    ],
    "Dental": [
      "Severe molar toothache and gum swelling",
      "Bleeding gums, sensitivity to cold/hot",
      "Wisdom tooth eruption pain and stiffness"
    ],
    "Ophthalmology": [
      "Blurry vision and double vision in left eye",
      "Severe eye redness, watering and itching",
      "Foreign object sensation with burning"
    ]
  };

  const departments = Object.keys(symptomsByDept) as Array<keyof typeof symptomsByDept>;

  // Generate patients for each of the last 7 days
  for (let d = 0; d < 8; d++) {
    // Determine date
    const date = new Date();
    date.setDate(date.getDate() - d);
    
    // 8-12 patients per day
    const patientCount = 8 + Math.floor(Math.random() * 5);

    for (let p = 0; p < patientCount; p++) {
      // Pick random department
      const dept = departments[Math.floor(Math.random() * departments.length)];
      
      // Determine gender based on department
      let gender = Math.random() > 0.5 ? "Male" : "Female";
      if (dept === "Gynecology") {
        gender = "Female";
      }

      // Pick name
      const name = gender === "Male" 
        ? maleNames[Math.floor(Math.random() * maleNames.length)] + " " + ["Kumar", "Singh", "Sharma", "Yadav"][Math.floor(Math.random() * 4)]
        : femaleNames[Math.floor(Math.random() * femaleNames.length)] + " " + ["Devi", "Kumari", "Sharma", "Yadav"][Math.floor(Math.random() * 4)];

      // Pick age based on department
      let age = 15 + Math.floor(Math.random() * 60);
      if (dept === "Pediatrics") {
        age = 1 + Math.floor(Math.random() * 12);
      }

      const village = villages[Math.floor(Math.random() * villages.length)];
      const phone = Math.random() > 0.3 ? "98765" + String(10000 + Math.floor(Math.random() * 90000)) : "";
      
      const symptomsList = symptomsByDept[dept];
      const symptoms = symptomsList[Math.floor(Math.random() * symptomsList.length)];
      const visitType = Math.random() > 0.75 ? "follow-up" : "new";

      // Pick time between 9:00 AM and 4:00 PM
      const hour = 9 + Math.floor(Math.random() * 8);
      const minute = Math.floor(Math.random() * 60);
      const regDate = new Date(date);
      regDate.setHours(hour, minute, 0, 0);

      const patientId = `pat-${regDate.getTime()}-${Math.floor(Math.random() * 1000)}`;

      list.push({
        patientId,
        name,
        age,
        gender,
        village,
        phone: phone || null,
        department: dept,
        symptoms,
        visitType,
        registeredAt: Timestamp.fromDate(regDate),
        createdBy: "receptionist",
        status: "waiting"
      });
    }
  }

  return list;
}

export class FirestoreSeeder {
  static async seedIfEmpty(db: Firestore): Promise<void> {
    try {
      const metaRef = doc(db, "system", "metadata");
      const metaSnap = await getDoc(metaRef);

      if (metaSnap.exists()) {
        // Already seeded
        return;
      }

      console.log("Firestore is empty. Starting database seeding...");

      // Write metadata document first to guard against other clients seeding concurrently
      await setDoc(metaRef, { 
        seeded: true, 
        seededAt: serverTimestamp() 
      });

      // Seeding Medicines
      const medBatch = writeBatch(db);
      mockMedicines.forEach((med) => {
        const medRef = doc(db, "medicines", med.id);
        medBatch.set(medRef, med);
      });
      await medBatch.commit();

      // Seeding Doctors
      const docBatch = writeBatch(db);
      mockDoctors.forEach((doctor) => {
        const docRef = doc(db, "doctors", doctor.id);
        docBatch.set(docRef, doctor);
      });
      await docBatch.commit();

      // Seeding Checklist
      const checklistBatch = writeBatch(db);
      seedChecklist.forEach((item) => {
        const itemRef = doc(db, "checklist", item.id);
        checklistBatch.set(itemRef, item);
      });
      await checklistBatch.commit();

      // Seeding Briefing
      const briefingRef = doc(db, "briefing", "latest");
      await setDoc(briefingRef, { text: defaultBriefingText, updatedAt: serverTimestamp() });

      // Seeding Footfall Data (remains as backup/fallback)
      const footfallRef = doc(db, "footfall", "data");
      await setDoc(footfallRef, {
        history: mockFootfallHistory,
        departments: mockDepartmentBreakdown,
        hourly: mockHourlyLoad,
        forecast: mockFootfallForecast,
        updatedAt: serverTimestamp()
      });

      // Seeding patients historical records
      const patients = generateHistoricalPatients();
      // Write in batches of 40 to avoid Firestore batch limits (max 500)
      const batchSize = 40;
      for (let i = 0; i < patients.length; i += batchSize) {
        const batch = writeBatch(db);
        const chunk = patients.slice(i, i + batchSize);
        chunk.forEach((pat) => {
          const patRef = doc(db, "patients", pat.patientId);
          batch.set(patRef, pat);
        });
        await batch.commit();
      }

      console.log(`Firestore database successfully seeded with ${patients.length} patient records and defaults.`);
    } catch (error) {
      console.error("Error during Firestore database seeding:", error);
    }
  }
}
