# Third-Party Integrations

## Firebase
* **Version**: ^12.15.0
* **Firestore**: Serves as the primary remote database for the application. The codebase includes specific repository implementations (e.g., `FirestorePatientRepository`, `FirestoreMedicineRepository`) to manage entities like patients, medicines, doctors, and operational checklists.
* **Firebase Auth**: Initialized in the Firebase configuration (`src/lib/firebase.ts`), allowing for potential user authentication and authorization capabilities.

## Google Gemini API
* **Model**: `gemini-2.5-flash`
* **Implementation**: The application connects to the Gemini API directly via REST (`fetch` to `generativelanguage.googleapis.com`) using an API key. The integration is encapsulated in `src/services/GeminiService.ts` and exposed to the frontend via a Next.js API route (`/api/copilot`).
* **Usage**: Gemini is used as the core intelligence engine for the "PHC Copilot" features:
  * **Daily Briefings**: Synthesizes current date, medicines inventory, doctor rosters, patient footfall predictions, and recent patient logs into an actionable operational briefing for the Chief Medical Officer.
  * **Reorder Predictions**: Analyzes medicine inventory, daily usage, and patient footfall history to recommend purchase order quantities and determine reorder urgency.
  * **Staffing Impact Analysis**: Evaluates the impact of absent or on-leave doctors, estimating wait time increases and providing department coverage recommendations.
