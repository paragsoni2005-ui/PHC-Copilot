# AI-SPEC — Phase 4: Google Gemini API Integration

> AI design contract generated for Phase 4. Consumed by `gsd-planner` and developers.
> Locks framework selection, implementation guidance, and evaluation strategy before planning begins.

---

## 1. System Classification

**System Type:** Content Generation & Extraction

**Description:**
The system processes daily operational data of a Primary Health Centre (PHC)—including active medicine stocks, doctor attendance lists, and historical/predicted patient footfall—and queries Gemini 2.5 Flash to generate real-time briefings, medicine reorder reasoning, and roster staffing coverage recommendations.

**Critical Failure Modes:**
1. **API Key Leakage:** Client-side network requests exposing the Gemini API key.
2. **JSON Schema Parsing Failures:** Malformed JSON responses from Gemini breaking the client-side parsing logic.
3. **UI Crash on Offline/Rate-Limiting:** App pages crashing when Gemini API is unreachable or rate-limited.
4. **Illogical Recommendations:** AI suggesting reorders for well-stocked items or proposing staffing coverages for present doctors.

---

## 1b. Domain Context

**Industry Vertical:** Healthcare Operations (Clinic Management)

**User Population:** Primary Health Centre (PHC) Doctors, Pharmacists, and Clinic Administrators.

**Stakes Level:** Medium (Decision support tool — AI recommendations require human approval/validation before taking action).

**Output Consequence:** Direct impact on medicine supply chains (reorder requests) and doctor roster coverages (staffing shifts).

### What Domain Experts Evaluate Against
- **Inventory Shortage Risk:** Does the reorder reasoning accurately account for current stock, daily usage rates, and seasonal surges?
- **Roster Cover Feasibility:** Are doctor reallocation suggestions logical? (e.g. general OPD covered by general practitioners, avoiding leaving critical departments like Pediatrics completely empty).
- **Patient Surge Alignment:** Are recommendations to open nurse desks or extend triage hours well-aligned with peak hours?

### Known Failure Modes in This Domain
- **Generic Hallucinations:** AI advising reorders for non-existent medicines or citing imaginary regulatory rules.
- **Out of Context Recommendations:** Suggesting a doctor cover shifts when they are logged as absent or on leave.

---

## 2. Framework Decision

**Selected Framework:** Native Fetch (REST API) calling Google Gemini API

**Version:** API v1beta (`gemini-2.5-flash`)

**Rationale:**
Since the backend runs in Next.js Server-side Route Handlers, using native `fetch` to make REST requests directly to the Google Gemini endpoint avoids adding large external NPM packages (like `@google/generative-ai`) and keeps the app lightweight, fast-loading, and easy to maintain.

**Alternatives Considered:**

| Framework | Ruled Out Because |
|-----------|------------------|
| `@google/generative-ai` SDK | Adds unnecessary npm package size; native REST API matches all requirements |
| LangChain.js / Vercel AI SDK | Overkill for a simple proxy endpoint; increases complexity |

**Vendor Lock-In Accepted:** Yes (REST API requires Google Gemini API key and JSON body schema).

---

## 3. Framework Quick Reference

### Installation
No external libraries are required. Native `fetch` is built into Node.js (v18+) and Next.js.

### Endpoint URL
```
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={API_KEY}
```

### Entry Point Pattern (Server-Side)
```typescript
const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    }),
  }
);

const result = await response.json();
const jsonText = result.candidates[0].content.parts[0].text;
const data = JSON.parse(jsonText);
```

### Common Pitfalls
1. **Invalid API Key Schema:** Forgetting that Gemini REST requests require the key as a URL query parameter (`?key=...`), not as a Bearer token in headers.
2. **Missing Mime Type:** Not specifying `"responseMimeType": "application/json"`, causing the model to return markdown-fenced code blocks instead of raw JSON.
3. **Missing Fields:** Not defining the `required` array in the JSON schema, resulting in the model omitting fields.

---

## 4. Implementation Guidance

**Model Configuration:**
- **Model:** `gemini-2.5-flash`
- **Temperature:** `0.2` (Low temperature to ensure deterministic and factual operational recommendations)
- **Max Output Tokens:** `1024`

**Core Pattern:**
Next.js POST API Route Handler `/api/copilot/route.ts` acting as a secure proxy.
1. Reads `x-gemini-api-key` header for client-configured key. Falls back to `process.env.GEMINI_API_KEY`.
2. Validates `action` body parameter.
3. Delegates request payload to `GeminiService.ts` to format prompt and query Gemini API.
4. Returns JSON response to client.

---

## 4b. AI Systems Best Practices

### Structured Outputs with Schema
Schemas are defined in standard OpenAPI 3.0 format to enforce structured output. Example schema for reorder:
```json
{
  "type": "OBJECT",
  "properties": {
    "recommendedOrderQuantity": { "type": "INTEGER" },
    "urgency": { "type": "STRING", "enum": ["CRITICAL", "HIGH", "MEDIUM", "LOW"] },
    "reasoning": { "type": "STRING" }
  },
  "required": ["recommendedOrderQuantity", "urgency", "reasoning"]
}
```

### Async-First Design
All API Route Handler functions are async/await. Client hooks handle loading states reactively using React's state hooks, rendering spinning icons and loading shimmers while the API request is pending.

---

## 5. Evaluation Strategy

### Dimensions

| Dimension | Rubric (Pass/Fail or 1-5) | Measurement Approach | Priority |
|-----------|--------------------------|---------------------|----------|
| Schema Conformance | Pass/Fail: returned JSON matches expected keys and types | Code (JSON parse validation) | Critical |
| Roster Logic | Pass/Fail: recommendations never include absent doctors | Unit testing / human verification | High |
| Reorder Logic | Pass/Fail: reorder recommended quantity is greater than 0 | Unit testing | High |

### Eval Tooling
- **Primary Tool:** Unit tests checking schema conformance.
- **Production Monitoring:** Arize Phoenix (default tracing standard).

---

## 6. Guardrails

### Online (Real-Time)
- If the model returns invalid JSON (e.g. fails parsing), backend catches the exception and returns a fallback mock response with a `fallback: true` flag.

---

## 7. Production Monitoring

**Tracing Tool:** Arize Phoenix / console logger.

**Key Metrics to Track:**
- Latency (target < 3 seconds)
- API error rate (target 0%)
- JSON parsing failure rate (target 0%)

---

## Checklist

- [x] System type classified
- [x] Critical failure modes identified (≥ 3)
- [x] Domain context researched (healthcare vertical, stakes, expert criteria, failure modes)
- [x] Regulatory/compliance context identified
- [x] Domain expert roles defined for evaluation involvement
- [x] Framework selected with rationale documented
- [x] Alternatives considered and ruled out
- [x] Framework quick reference written (install, imports, pattern, pitfalls)
- [x] AI-SPEC.md validated (non-empty structures)
- [x] Committed if commit_docs enabled
- [x] Next step surfaced to user
