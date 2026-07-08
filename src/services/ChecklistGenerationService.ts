import { ChecklistItem } from '../repositories/IChecklistRepository';
import { FirestoreMedicineRepository } from '../repositories/FirestoreMedicineRepository';
import { FirestoreDoctorRepository } from '../repositories/FirestoreDoctorRepository';
import { FirestorePatientRepository } from '../repositories/FirestorePatientRepository';
import { FirestoreChecklistRepository } from '../repositories/FirestoreChecklistRepository';
import { db } from '../lib/firebase';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { Medicine } from '@/types/store';

// Helper for local rules logic
function generateRuleBasedChecklist(context: any, medicines: Medicine[]): ChecklistItem[] {
  const tasks: ChecklistItem[] = [];
  const nowStr = new Date().toISOString();

  // 1. Staff Attendance Gap Rule
  if (context.attendance.absentDoctors > 0) {
    tasks.push({
      id: `rule-att-${Date.now()}`,
      intentId: 'attendance-gap',
      title: 'Resolve Doctor Shift Attendance Gap',
      text: 'Resolve Doctor Shift Attendance Gap',
      description: `Roster coverage is at ${context.attendance.coverage}%. Reallocate backup staff to cover ${context.attendance.absentDoctors} shift gap(s).`,
      completed: false,
      priority: 'high',
      category: 'Staffing',
      reason: 'Staffing coverage dropped due to doctor absence.',
      estimatedImpact: 'Minimize patient wait times and prevent OPD service delays.',
      generatedBy: 'rule-engine',
      generatedAt: nowStr
    });
  }

  // 2. Patient Surge Desk Rule
  if (context.todayPatientsCount > 30) {
    tasks.push({
      id: `rule-surge-${Date.now()}`,
      intentId: 'surge-desk',
      title: 'Mobilize Additional Triage Desk',
      text: 'Mobilize Additional Triage Desk',
      description: `OPD patient volume is at ${context.todayPatientsCount}. Suggest opening an extra triage desk to prevent congestion.`,
      completed: false,
      priority: 'medium',
      category: 'Patient Flow',
      reason: 'Active patient counts exceed safe waiting thresholds.',
      estimatedImpact: 'Keep OPD queue times below 25 minutes.',
      generatedBy: 'rule-engine',
      generatedAt: nowStr
    });
  }

  // 3. Medicine Stockout Rule
  medicines.forEach(m => {
    if (m.daysRemaining < 3) {
      tasks.push({
        id: `rule-stockout-${m.name}-${Date.now()}`,
        intentId: `inventory-${m.name}`,
        title: `Reorder Critical Stockout: ${m.name}`,
        text: `Reorder Critical Stockout: ${m.name}`,
        description: `${m.name} stock has less than 3 days remaining. Submit a priority supply request.`,
        completed: false,
        priority: 'high',
        category: 'Inventory',
        reason: `${m.name} current stock is ${m.stock} units with active daily consumption.`,
        estimatedImpact: 'Prevent interruption in patient treatment plans.',
        generatedBy: 'rule-engine',
        generatedAt: nowStr
      });
    } else if (m.daysRemaining < 7) {
      tasks.push({
        id: `rule-warning-${m.name}-${Date.now()}`,
        intentId: `inventory-${m.name}`,
        title: `Prepare Replenishment for ${m.name}`,
        text: `Prepare Replenishment for ${m.name}`,
        description: `${m.name} has only ${m.daysRemaining} days of stock left. Add to daily purchase sheet.`,
        completed: false,
        priority: 'medium',
        category: 'Inventory',
        reason: `${m.name} is running below standard reorder buffer.`,
        estimatedImpact: 'Maintain a safe 30-day inventory level.',
        generatedBy: 'rule-engine',
        generatedAt: nowStr
      });
    }
  });

  // 4. Outbreak Rules (Fever and Diarrhea)
  if (context.patientTrends.todayFeverCount >= 10 && context.patientTrends.feverPctToday > context.patientTrends.feverPctRecent) {
    tasks.push({
      id: `rule-fever-${Date.now()}`,
      intentId: 'outbreak-fever',
      title: 'Activate Seasonal Fever Outbreak Response',
      text: 'Activate Seasonal Fever Outbreak Response',
      description: `Fever symptoms are rising: ${context.patientTrends.feverPctToday}% today vs ${context.patientTrends.feverPctRecent}% average. Check antipyretic reserves.`,
      completed: false,
      priority: 'high',
      category: 'Public Health',
      reason: `Fever cases today reached ${context.patientTrends.todayFeverCount} patients.`,
      estimatedImpact: 'Identify seasonal fever surges early and prepare treatment protocols.',
      generatedBy: 'rule-engine',
      generatedAt: nowStr
    });
  }

  if (context.patientTrends.todayDiarrheaCount >= 10 && context.patientTrends.diarrheaPctToday > context.patientTrends.diarrheaPctRecent) {
    tasks.push({
      id: `rule-diarrhea-${Date.now()}`,
      intentId: 'outbreak-diarrhea',
      title: 'Diarrheal Symptoms Alert Response',
      text: 'Diarrheal Symptoms Alert Response',
      description: `Diarrhea cases are rising: ${context.patientTrends.diarrheaPctToday}% today vs ${context.patientTrends.diarrheaPctRecent}% average. Prepare extra ORS reserves.`,
      completed: false,
      priority: 'high',
      category: 'Public Health',
      reason: `Diarrhea cases today reached ${context.patientTrends.todayDiarrheaCount} patients.`,
      estimatedImpact: 'Prevent dehydration cases and coordinate community sanitization advisory.',
      generatedBy: 'rule-engine',
      generatedAt: nowStr
    });
  }

  // Sort: High -> Medium -> Low
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  return tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}

export class ChecklistGenerationService {
  static async generateDailyChecklist(dateStr: string, userId: string): Promise<{ tasks: ChecklistItem[]; source: 'gemini' | 'rule-engine' }> {
    // 1. Fetch medicines
    const medRepo = new FirestoreMedicineRepository(userId);
    const medicines = await medRepo.getAll();

    // 2. Fetch doctors
    const docRepo = new FirestoreDoctorRepository(userId);
    const doctors = await docRepo.getAll();

    // 3. Fetch patients today
    let todayPatients: any[] = [];
    const recentPatients: any[] = [];

    const patientRepo = new FirestorePatientRepository(userId);
    todayPatients = await patientRepo.getTodayPatients();
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 7);
    cutoffDate.setHours(0, 0, 0, 0);

    try {
      const q = query(
        collection(db, 'users', userId, 'patients'),
        where('registeredAt', '>=', Timestamp.fromDate(cutoffDate))
      );
      const snap = await getDocs(q);
      snap.forEach((doc) => {
        recentPatients.push({ ...doc.data(), patientId: doc.id });
      });
    } catch (e) {
      console.error("Failed to query recent patients in checklist gen:", e);
    }

    // Calculations
    const todayTotal = todayPatients.length;
    const recentTotal = recentPatients.length;

    const presentDocsCount = doctors.filter(d => d.status === 'present').length;
    const absentDocsCount = doctors.filter(d => d.status === 'absent').length;
    const totalDocsCount = doctors.length || 1;
    const docCoverage = (presentDocsCount / totalDocsCount) * 100;

    const todayFever = todayPatients.filter(p => 
      p.symptoms?.toLowerCase().includes('fever') || 
      p.symptoms?.toLowerCase().includes('body pain')
    ).length;
    const todayFeverPct = todayTotal > 0 ? todayFever / todayTotal : 0;

    const recentFever = recentPatients.filter(p => 
      p.symptoms?.toLowerCase().includes('fever') || 
      p.symptoms?.toLowerCase().includes('body pain')
    ).length;
    const recentFeverPct = recentTotal > 0 ? recentFever / recentTotal : 0;

    const todayDiarrhea = todayPatients.filter(p => 
      p.symptoms?.toLowerCase().includes('diarrhea') || 
      p.symptoms?.toLowerCase().includes('loose motion')
    ).length;
    const todayDiarrheaPct = todayTotal > 0 ? todayDiarrhea / todayTotal : 0;

    const recentDiarrhea = recentPatients.filter(p => 
      p.symptoms?.toLowerCase().includes('diarrhea') || 
      p.symptoms?.toLowerCase().includes('loose motion')
    ).length;
    const recentDiarrheaPct = recentTotal > 0 ? recentDiarrhea / recentTotal : 0;

    const lowStockMeds = medicines.filter(m => m.stock <= m.reorderLevel || m.daysRemaining < 5);

    // Build context payload
    const context = {
      todayPatientsCount: todayTotal,
      attendance: {
        coverage: Math.round(docCoverage),
        absentDoctors: absentDocsCount,
      },
      inventory: {
        lowStock: lowStockMeds.map(m => m.name),
      },
      patientTrends: {
        todayCount: todayTotal,
        recentCount: recentTotal,
        todayFeverCount: todayFever,
        todayDiarrheaCount: todayDiarrhea,
        feverPctToday: Math.round(todayFeverPct * 100),
        feverPctRecent: Math.round(recentFeverPct * 100),
        diarrheaPctToday: Math.round(todayDiarrheaPct * 100),
        diarrheaPctRecent: Math.round(recentDiarrheaPct * 100)
      }
    };

    let generatedTasks: ChecklistItem[] = [];
    let source: 'gemini' | 'rule-engine' = 'rule-engine';

    // 4. Try Gemini Structured Output
    try {
      const response = await fetch('/api/copilot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'checklist',
          payload: { context }
        })
      });

      const data = await response.json();
      if (data.success && data.data && Array.isArray(data.data.tasks)) {
        generatedTasks = data.data.tasks.map((t: any, index: number) => ({
          id: `ai-${Date.now()}-${index}`,
          intentId: t.intentId,
          text: t.title,
          title: t.title,
          description: t.description,
          completed: false,
          priority: t.priority.toLowerCase() as 'high' | 'medium' | 'low',
          category: t.category,
          reason: t.reason,
          estimatedImpact: t.estimatedImpact,
          generatedBy: 'gemini',
          generatedAt: new Date().toISOString()
        }));
        source = 'gemini';
      } else {
        console.warn("Checklist API returned invalid data, falling back to local engine");
      }
    } catch (e) {
      console.error("Failed to fetch checklist from Gemini:", e);
    }

    // 5. Fallback to Local Rule Engine
    if (generatedTasks.length === 0) {
      generatedTasks = generateRuleBasedChecklist(context, medicines);
      source = 'rule-engine';
    }

    // 6. Merge State with Existing Checklist Tasks in Firestore
    const checklistRepo = new FirestoreChecklistRepository(userId);
    const existingTasks = await checklistRepo.getItems(dateStr);

    const finalTasks = generatedTasks.map(newTask => {
      const existing = existingTasks.find(et => et.intentId === newTask.intentId);
      if (existing) {
        return {
          ...newTask,
          id: existing.id,
          completed: existing.completed,
          completedAt: existing.completedAt || null
        };
      }
      return newTask;
    });

    // 7. Save merged tasks
    await checklistRepo.saveItems(finalTasks, dateStr);

    return { tasks: finalTasks, source };
  }

  static async mergeAndSaveTasks(rawTasks: any[], dateStr: string, source: 'gemini' | 'rule-engine', userId: string): Promise<{ tasks: ChecklistItem[]; source: 'gemini' | 'rule-engine' }> {
    const formattedTasks: ChecklistItem[] = rawTasks.map((t: any, index: number) => ({
      id: t.id || `ai-${Date.now()}-${index}`,
      intentId: t.intentId,
      text: t.title,
      title: t.title,
      description: t.description,
      completed: t.completed || false,
      priority: t.priority.toLowerCase() as 'high' | 'medium' | 'low',
      category: t.category,
      reason: t.reason,
      estimatedImpact: t.estimatedImpact,
      generatedBy: source,
      generatedAt: t.generatedAt || new Date().toISOString()
    }));

    const checklistRepo = new FirestoreChecklistRepository(userId);
    const existingTasks = await checklistRepo.getItems(dateStr);

    const finalTasks = formattedTasks.map(newTask => {
      const existing = existingTasks.find(et => et.intentId === newTask.intentId);
      if (existing) {
        return {
          ...newTask,
          id: existing.id,
          completed: existing.completed,
          completedAt: existing.completedAt || null
        };
      }
      return newTask;
    });

    await checklistRepo.saveItems(finalTasks, dateStr);
    return { tasks: finalTasks, source };
  }
}
