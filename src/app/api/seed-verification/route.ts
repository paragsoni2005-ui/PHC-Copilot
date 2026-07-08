import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  deleteDoc, 
  writeBatch, 
  Timestamp 
} from 'firebase/firestore';

export async function GET() {
  try {
    console.log("Starting verification seeding...");

    // 1. Delete all current patients in Firestore
    const patientCol = collection(db, "patients");
    const existingSnap = await getDocs(patientCol);
    
    // Batch delete to be fast and safe
    const deleteBatch = writeBatch(db);
    existingSnap.forEach((docSnap) => {
      deleteBatch.delete(docSnap.ref);
    });
    await deleteBatch.commit();
    console.log(`Deleted ${existingSnap.size} existing patient records.`);

    // 2. Generate patient records to match the methodology
    const list: any[] = [];
    const villages = ["Raipur", "Begampur", "Surajpur", "Kalyanpur", "Rampur", "Mohanpur"];
    const maleNames = ["Ramesh", "Arjun", "Rahul", "Mohan", "Sunil", "Amit", "Rajesh", "Vijay", "Sanjay", "Karan"];
    const femaleNames = ["Sita", "Priya", "Geeta", "Lakshmi", "Kavita", "Anjali", "Pooja", "Rekha", "Neha", "Divya"];

    const depts = ["General OPD", "Pediatrics", "ANC", "Immunization"];
    
    // Distribution targets:
    // General OPD: ~72%
    // Pediatrics: ~15%
    // ANC: ~8%
    // Immunization: ~5%
    // Total symptoms alerts: Fever (>50%), Cough (>40%)
    
    const getDeptForIndex = (idx: number): string => {
      const pct = (idx % 100);
      if (pct < 72) return "General OPD";
      if (pct < 87) return "Pediatrics";
      if (pct < 95) return "ANC";
      return "Immunization";
    };

    const getSymptomsForDept = (dept: string, idx: number): string => {
      // Alternate symptoms to ensure >60% have Fever and Cough
      if (idx % 10 < 6) {
        return "Fever, Cough, Cold";
      }
      if (dept === "ANC") {
        return "Routine checkup, Body Pain";
      }
      if (dept === "Immunization") {
        return "Other: Routine vaccination";
      }
      return "Headache, Body Pain";
    };

    // Helper to generate patients for a date with a set count and hourly distribution
    const generatePatientsForDate = (date: Date, count: number, hourlyDistribution?: Record<number, number>) => {
      for (let p = 0; p < count; p++) {
        const dept = getDeptForIndex(list.length);
        let gender = Math.random() > 0.5 ? "Male" : "Female";
        if (dept === "ANC") gender = "Female";

        const name = gender === "Male"
          ? maleNames[Math.floor(Math.random() * maleNames.length)] + " " + ["Kumar", "Singh", "Sharma", "Yadav"][Math.floor(Math.random() * 4)]
          : femaleNames[Math.floor(Math.random() * femaleNames.length)] + " " + ["Devi", "Kumari", "Sharma", "Yadav"][Math.floor(Math.random() * 4)];

        let age = 15 + Math.floor(Math.random() * 60);
        if (dept === "Pediatrics" || dept === "Immunization") {
          age = 1 + Math.floor(Math.random() * 12);
        }

        const village = villages[Math.floor(Math.random() * villages.length)];
        const phone = Math.random() > 0.3 ? "98765" + String(10000 + Math.floor(Math.random() * 90000)) : "";
        const symptoms = getSymptomsForDept(dept, list.length);
        const visitType = Math.random() > 0.8 ? "follow-up" : "new";

        // Determine registration time
        let hour = 9 + Math.floor(Math.random() * 8); // default 9 AM to 5 PM
        let minute = Math.floor(Math.random() * 60);

        if (hourlyDistribution) {
          // Find the hour for this index based on distribution
          let accum = 0;
          for (const [hStr, hCount] of Object.entries(hourlyDistribution)) {
            const hNum = parseInt(hStr);
            accum += hCount;
            if (p < accum) {
              hour = hNum;
              break;
            }
          }
        }

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
    };

    const today = new Date();
    today.setHours(12, 0, 0, 0);

    // Target counts for last 7 days + today + Thursday 2 weeks ago
    const schedule = [
      { daysAgo: 0, count: 51, hourly: { 9: 4, 10: 12, 11: 18, 12: 9, 13: 5, 14: 2, 15: 1, 16: 0 } }, // Today (Wed Jul 8)
      { daysAgo: 1, count: 49 }, // Yesterday (Tue Jul 7) - Day-1
      { daysAgo: 2, count: 45 }, // Mon Jul 6 - Day-2
      { daysAgo: 3, count: 42 }, // Sun Jul 5 - Day-3
      { daysAgo: 4, count: 45 }, // Sat Jul 4 - Day-4
      { daysAgo: 5, count: 42 }, // Fri Jul 3 - Day-5
      { daysAgo: 6, count: 41 }, // Thu Jul 2 - Day-6
      { daysAgo: 7, count: 38 }, // Wed Jul 1 - Day-7
      { daysAgo: 14, count: 42 } // Thu Jun 25 - 14 days ago (Thursday baseline)
    ];

    schedule.forEach(({ daysAgo, count, hourly }) => {
      const targetDate = new Date();
      targetDate.setDate(today.getDate() - daysAgo);
      generatePatientsForDate(targetDate, count, hourly);
    });

    // Write patients in batches of 40 (Firestore batch limit is 500)
    const batchSize = 40;
    for (let i = 0; i < list.length; i += batchSize) {
      const batch = writeBatch(db);
      const chunk = list.slice(i, i + batchSize);
      chunk.forEach((pat) => {
        const patRef = doc(db, "patients", pat.patientId);
        batch.set(patRef, pat);
      });
      await batch.commit();
    }

    console.log(`Seeded ${list.length} patients successfully.`);

    return NextResponse.json({ 
      success: true, 
      message: `Successfully seeded ${list.length} patients for verification.`,
      targetDistribution: {
        total: list.length,
        todayCount: 51,
        last7DaysCounts: [38, 41, 42, 45, 42, 45, 49], // Wed Jul 1 to Tue Jul 7
        thursdayBaseline: 42
      }
    });

  } catch (error: any) {
    console.error("Seeding failed: ", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Unknown error during seeding"
    }, { status: 500 });
  }
}
