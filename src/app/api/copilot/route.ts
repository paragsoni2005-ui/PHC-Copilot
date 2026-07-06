import { NextRequest } from 'next/server';
import { GeminiService } from '@/services/GeminiService';

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
        result = await GeminiService.generateBriefing(apiKey, medicines || [], doctors || [], footfall || {});
        break;

      case 'reorder':
        const { medicine, footfallHistory } = payload || {};
        result = await GeminiService.generateReorderPrediction(apiKey, medicine, footfallHistory || []);
        break;

      case 'attendance':
        const { absentDoctors } = payload || {};
        result = await GeminiService.generateStaffingImpact(apiKey, absentDoctors || []);
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
