export class GeminiService {
  private static async queryGemini(apiKey: string, prompt: string, schema: any): Promise<any> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: schema,
          temperature: 0.2,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API call failed: Status ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('Gemini API returned no candidates');
    }

    const text = data.candidates[0].content.parts[0].text;
    try {
      return JSON.parse(text);
    } catch {
      throw new Error('Failed to parse Gemini response as JSON');
    }
  }

  static async generateBriefing(apiKey: string, medicines: any[], doctors: any[], footfall: any, recentPatients?: any[]): Promise<any> {
    const prompt = `
You are an expert Chief Medical Officer and Clinic Operations Analyst.
Analyze the following operational data for a Primary Health Centre (PHC) and generate a synthesized daily briefing.

DATA:
- Current Date/Time: ${new Date().toLocaleDateString()}
- Medicines Inventory: ${JSON.stringify(medicines)}
- Doctor Attendance Roster: ${JSON.stringify(doctors)}
- Patient Footfall predictions/data: ${JSON.stringify(footfall)}
${recentPatients ? `- Recent Patient Symptoms & Intake logs (Last 7 days): ${JSON.stringify(recentPatients)}` : ""}

INSTRUCTIONS:
1. Provide a concise introductory summary greeting.
2. In the Inventory section, identify critical stockouts (< 3 days remaining) or warning items (3-7 days remaining). Explain daily usage rates and specify when stock will run out.
3. In the Roster section, evaluate staffing coverage. Identify absent/on leave doctors and recommend coverage/reallocation.
4. In the Patient Surge section, detail predicted patient counts, workload risk levels (e.g. peak hours), and recommend desk/desk triage adjustments. If there are recent patient logs, analyze common symptoms and highlight potential seasonal surges or disease trends.
5. Provide a confidence score (0-100) indicating alignment with historical patterns.
6. Provide distinct reasoning points for your predictions.

Tone: Professional, urgent yet reassuring, concise, medical/operational.
`;

    const schema = {
      type: "OBJECT",
      properties: {
        intro: { type: "STRING", description: "Good morning/day operational greeting summarizing date and overall clinic state" },
        inventorySummary: { type: "STRING", description: "Detailed summary of critical shortages, daily usage, and replenishment requirements" },
        rosterSummary: { type: "STRING", description: "Analysis of doctor presence/absenteeism and department cover reallocations" },
        surgeSummary: { type: "STRING", description: "Patient footfall surge predictions, busy hours, and desk/desk triage staffing suggestions" },
        confidenceScore: { type: "INTEGER", description: "Confidence score percentage (0-100) based on data consistency" },
        inventoryReasoning: { type: "STRING", description: "Detailed reasoning/rationale behind the inventory warnings and reorder urgencies" },
        surgeReasoning: { type: "STRING", description: "Detailed reasoning/rationale behind patient surge forecasts" },
        rosterReasoning: { type: "STRING", description: "Detailed reasoning/rationale behind doctor coverage recommendations" }
      },
      required: [
        "intro",
        "inventorySummary",
        "rosterSummary",
        "surgeSummary",
        "confidenceScore",
        "inventoryReasoning",
        "surgeReasoning",
        "rosterReasoning"
      ]
    };

    return this.queryGemini(apiKey, prompt, schema);
  }

  static async generateCombinedData(apiKey: string, medicines: any[], doctors: any[], footfall: any, recentPatients?: any[]): Promise<any> {
    const prompt = `
You are an expert Chief Medical Officer and Clinic Operations Analyst for a Primary Health Centre (PHC).
Analyze the following operational data and generate BOTH a synthesized daily briefing and a structured checklist of daily action items.

DATA:
- Current Date/Time: ${new Date().toLocaleDateString()}
- Medicines Inventory: ${JSON.stringify(medicines)}
- Doctor Attendance Roster: ${JSON.stringify(doctors)}
- Patient Footfall predictions/data: ${JSON.stringify(footfall)}
${recentPatients ? `- Recent Patient Symptoms & Intake logs (Last 7 days): ${JSON.stringify(recentPatients)}` : ""}

INSTRUCTIONS FOR DAILY BRIEFING:
1. Provide a concise introductory summary greeting.
2. In the Inventory section, identify critical stockouts (< 3 days remaining) or warning items (3-7 days remaining). Explain daily usage rates and specify when stock will run out.
3. In the Roster section, evaluate staffing coverage. Identify absent/on leave doctors and recommend coverage/reallocation.
4. In the Patient Surge section, detail predicted patient counts, workload risk levels (e.g. peak hours), and recommend desk/desk triage adjustments. If there are recent patient logs, analyze common symptoms and highlight potential seasonal surges or disease trends.
5. Provide a confidence score (0-100) indicating alignment with historical patterns.
6. Provide distinct reasoning points for your predictions.

INSTRUCTIONS FOR DAILY ACTION CHECKLIST:
1. Generate specific, actionable operational tasks for the clinic based on the data.
2. The checklist must NOT contain generic pre-seeded items. Generate tasks dynamically based on the current context.
3. Every task must have a stable unique intentId (e.g., surge-desk, inventory-Paracetamol, attendance-gap, outbreak-diarrhea, outbreak-fever) that remains the same for the same issue regardless of slight text changes.
4. For each task, provide a clear title, description, category (e.g. Patient Flow, Inventory, Staffing, Administration, Clinical Operations, Public Health, Infrastructure), priority (High, Medium, Low), the specific data-driven reason why it was generated, and the estimated impact.
5. Sort tasks by priority: High first, then Medium, then Low.

No markdown. No plain text. No explanations outside the JSON response.
`;

    const schema = {
      type: "OBJECT",
      properties: {
        briefing: {
          type: "OBJECT",
          properties: {
            intro: { type: "STRING", description: "Good morning/day operational greeting summarizing date and overall clinic state" },
            inventorySummary: { type: "STRING", description: "Detailed summary of critical shortages, daily usage, and replenishment requirements" },
            rosterSummary: { type: "STRING", description: "Analysis of doctor presence/absenteeism and department cover reallocations" },
            surgeSummary: { type: "STRING", description: "Patient footfall surge predictions, busy hours, and desk/desk triage staffing suggestions" },
            confidenceScore: { type: "INTEGER", description: "Confidence score percentage (0-100) based on data consistency" },
            inventoryReasoning: { type: "STRING", description: "Detailed reasoning/rationale behind the inventory warnings and reorder urgencies" },
            surgeReasoning: { type: "STRING", description: "Detailed reasoning/rationale behind patient surge forecasts" },
            rosterReasoning: { type: "STRING", description: "Detailed reasoning/rationale behind doctor coverage recommendations" }
          },
          required: [
            "intro",
            "inventorySummary",
            "rosterSummary",
            "surgeSummary",
            "confidenceScore",
            "inventoryReasoning",
            "surgeReasoning",
            "rosterReasoning"
          ]
        },
        checklist: {
          type: "OBJECT",
          properties: {
            tasks: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  title: { type: "STRING", description: "Clear action task title" },
                  description: { type: "STRING", description: "Short description of what needs to be done" },
                  priority: { type: "STRING", enum: ["High", "Medium", "Low"], description: "Priority level of the task" },
                  category: { type: "STRING", enum: ["Patient Flow", "Inventory", "Staffing", "Administration", "Clinical Operations", "Public Health", "Infrastructure"], description: "Category of operation" },
                  reason: { type: "STRING", description: "Reason why this task is generated based on operational data" },
                  estimatedImpact: { type: "STRING", description: "Estimated positive outcome or time saved by completing the task" },
                  intentId: { type: "STRING", description: "A stable unique ID representing the intent (e.g., surge-desk, inventory-[MedicineName], attendance-gap, outbreak-diarrhea, outbreak-fever)" }
                },
                required: ["title", "description", "priority", "category", "reason", "estimatedImpact", "intentId"]
              }
            }
          },
          required: ["tasks"]
        }
      },
      required: ["briefing", "checklist"]
    };

    return this.queryGemini(apiKey, prompt, schema);
  }

  static async generateReorderPrediction(apiKey: string, medicine: any, footfallHistory: any[]): Promise<any> {
    const prompt = `
Analyze the inventory and usage metrics for this medicine to recommend a purchase order.

MEDICINE DETAILS:
- Name: ${medicine.name}
- Current Stock: ${medicine.stock}
- Daily Usage: ${medicine.dailyUsage}
- Days Remaining: ${medicine.daysRemaining}
- Reorder Level: ${medicine.reorderLevel}
- Dosage Form: ${medicine.dosageForm}

PATIENT FOOTFALL DATA:
- Footfall History/Trends: ${JSON.stringify(footfallHistory)}

INSTRUCTIONS:
1. Determine the recommended reorder quantity (greater than 0).
2. Determine reorder urgency: CRITICAL (supply < 3 days), HIGH (3-7 days), MEDIUM (7-14 days), or LOW (14+ days).
3. Provide predictive reasoning explaining how daily consumption rates, safety stock buffers, and patient surges justify this reorder.

Tone: Precise, professional, operational.
`;

    const schema = {
      type: "OBJECT",
      properties: {
        recommendedOrderQuantity: { type: "INTEGER", description: "The recommended number of units to order" },
        urgency: { type: "STRING", description: "Urgency level of the reorder", enum: ["CRITICAL", "HIGH", "MEDIUM", "LOW"] },
        reasoning: { type: "STRING", description: "2-3 sentences explaining why this order size and urgency was recommended based on safety buffers, daily consumption, and surge risks" }
      },
      required: ["recommendedOrderQuantity", "urgency", "reasoning"]
    };

    return this.queryGemini(apiKey, prompt, schema);
  }

  static async generateStaffingImpact(apiKey: string, absentDoctors: any[]): Promise<any> {
    const prompt = `
Analyze the operational impact of the following absent or on-leave doctors at the clinic.

ABSENT DOCTORS:
${JSON.stringify(absentDoctors)}

INSTRUCTIONS:
1. Estimate the waiting time increase in minutes (e.g. 15, 30, 45, etc.) as a number.
2. List the primary risk areas (departments, shifts) affected by these absences.
3. Provide concrete department coverage recommendations (e.g. reallocating other doctors, extending shifts, triaging cases) for each absent doctor.

Tone: Operational, safety-focused, actionable.
`;

    const schema = {
      type: "OBJECT",
      properties: {
        waitTimeIncrease: { type: "INTEGER", description: "Estimated increase in patient wait time in minutes" },
        riskAreas: { type: "STRING", description: "Primary risk departments and shifts affected (comma-separated list)" },
        recommendations: {
          type: "ARRAY",
          items: { type: "STRING" },
          description: "List of actionable coverage recommendations (one bullet per absent doctor/department)"
        }
      },
      required: ["waitTimeIncrease", "riskAreas", "recommendations"]
    };

    return this.queryGemini(apiKey, prompt, schema);
  }

  static async testConnection(apiKey: string): Promise<any> {
    const prompt = "Return success: true and message: 'Connection Succeeded' to verify configuration.";
    const schema = {
      type: "OBJECT",
      properties: {
        success: { type: "BOOLEAN" },
        message: { type: "STRING" }
      },
      required: ["success", "message"]
    };

    return this.queryGemini(apiKey, prompt, schema);
  }

  static async generateDailyChecklist(apiKey: string, context: any): Promise<any> {
    const prompt = `
You are an expert Operations Assistant for a rural Primary Health Centre (PHC).
Analyze the following operational context and return a structured checklist of daily action items.

OPERATIONAL CONTEXT:
${JSON.stringify(context, null, 2)}

INSTRUCTIONS:
1. Generate specific, actionable operational tasks for the clinic based on the data.
2. The checklist must NOT contain generic pre-seeded items. Generate tasks dynamically based on the current context.
3. Every task must have a stable unique intentId (e.g., surge-desk, inventory-Paracetamol, attendance-gap, outbreak-diarrhea, outbreak-fever) that remains the same for the same issue regardless of slight text changes.
4. For each task, provide a clear title, description, category (e.g. Patient Flow, Inventory, Staffing, Administration, Clinical Operations, Public Health, Infrastructure), priority (High, Medium, Low), the specific data-driven reason why it was generated, and the estimated impact.
5. Sort tasks by priority: High first, then Medium, then Low.

No markdown. No plain text. No explanations outside the JSON response.
`;

    const schema = {
      type: "OBJECT",
      properties: {
        tasks: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              title: { type: "STRING", description: "Clear action task title" },
              description: { type: "STRING", description: "Short description of what needs to be done" },
              priority: { type: "STRING", enum: ["High", "Medium", "Low"], description: "Priority level of the task" },
              category: { type: "STRING", enum: ["Patient Flow", "Inventory", "Staffing", "Administration", "Clinical Operations", "Public Health", "Infrastructure"], description: "Category of operation" },
              reason: { type: "STRING", description: "Reason why this task is generated based on operational data" },
              estimatedImpact: { type: "STRING", description: "Estimated positive outcome or time saved by completing the task" },
              intentId: { type: "STRING", description: "A stable unique ID representing the intent (e.g., surge-desk, inventory-[MedicineName], attendance-gap, outbreak-diarrhea, outbreak-fever)" }
            },
            required: ["title", "description", "priority", "category", "reason", "estimatedImpact", "intentId"]
          }
        }
      },
      required: ["tasks"]
    };

    return this.queryGemini(apiKey, prompt, schema);
  }
}
