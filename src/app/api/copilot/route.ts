import { NextRequest } from 'next/server';
import { GeminiService } from '@/services/GeminiService';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get('x-gemini-api-key') || process.env.GEMINI_API_KEY;

    const { action, payload } = await request.json();

    if (!action) {
      return Response.json(
        { success: false, error: 'Missing required field: action' },
        { status: 400 }
      );
    }

    if (action === 'test') {
      const testKey = payload?.apiKey || apiKey;
      if (!testKey) {
        return Response.json(
          { success: false, error: 'Gemini API Key is not configured.' },
          { status: 400 }
        );
      }
      try {
        const testResult = await GeminiService.testConnection(testKey);
        return Response.json({ success: true, ...testResult });
      } catch (err: any) {
        return Response.json(
          { success: false, error: err.message || 'Connection test failed.' },
          { status: 400 }
        );
      }
    }

    // Check key for operational actions
    if (!apiKey) {
      return Response.json(
        { success: false, error: 'Gemini API Key is not configured. Please enter one in Settings.' },
        { status: 401 }
      );
    }

    let result;
    switch (action) {
      case 'briefing':
        const { medicines, doctors, footfall } = payload || {};
        
        // Fetch patient logs registered in the last 7 days from Firestore
        const recentPatients: any[] = [];
        try {
          const cutoffDate = new Date();
          cutoffDate.setDate(cutoffDate.getDate() - 7);
          const q = query(
            collection(db, 'patients'),
            where('registeredAt', '>=', Timestamp.fromDate(cutoffDate))
          );
          const snap = await getDocs(q);
          snap.forEach((doc) => {
            const data = doc.data();
            recentPatients.push({
              age: data.age,
              gender: data.gender,
              department: data.department,
              symptoms: data.symptoms
            });
          });
        } catch (e) {
          console.error("Failed to query patients in briefing API:", e);
        }

        result = await GeminiService.generateCombinedData(
          apiKey, 
          medicines || [], 
          doctors || [], 
          footfall || {},
          recentPatients.length > 0 ? recentPatients : undefined
        );
        break;

      case 'reorder':
        const { medicine, footfallHistory } = payload || {};
        result = await GeminiService.generateReorderPrediction(apiKey, medicine, footfallHistory || []);
        break;

      case 'attendance':
        const { absentDoctors } = payload || {};
        result = await GeminiService.generateStaffingImpact(apiKey, absentDoctors || []);
        break;

      case 'checklist':
        const { context } = payload || {};
        result = await GeminiService.generateDailyChecklist(apiKey, context || {});
        break;

      default:
        return Response.json(
          { success: false, error: `Invalid action: ${action}` },
          { status: 400 }
        );
    }

    return Response.json({ success: true, data: result });
  } catch (err: any) {
    console.error('API Error in /api/copilot:', err);
    return Response.json(
      { success: false, error: err.message || 'An internal error occurred.' },
      { status: 500 }
    );
  }
}
