---
phase: 01-project-setup-core-app-shell
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - package.json
  - tsconfig.json
  - next.config.config.js
  - src/app/globals.css
  - src/app/layout.tsx
  - src/app/page.tsx
autonomous: true
requirements:
  - ONBD-03
  - SETT-01
must_haves:
  truths:
    - Next.js workspace is initialized with App Router, TypeScript, and Vanilla CSS.
    - globals.css contains the mapped Material 3 color palette and typography variables.
  artifacts:
    - package.json
    - tsconfig.json
    - src/app/globals.css
    - src/app/layout.tsx
  key_links:
    - globals.css is imported in layout.tsx
---

<objective>
Initialize the Next.js App Router workspace with TypeScript and configure the global stylesheet with CSS Variables containing the Stitch Design System visual tokens.

Purpose: Build the foundation for all styling and navigation.
Output: Initialized workspace and global variables stylesheet.
</objective>

<execution_context>
@~/.gemini/antigravity/get-shit-done/workflows/execute-plan.md
@~/.gemini/antigravity/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/01-project-setup-core-app-shell/01-CONTEXT.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Initialize Next.js workspace</name>
  <files>package.json, tsconfig.json, src/app/layout.tsx, src/app/page.tsx</files>
  <read_first>package.json</read_first>
  <action>
    Initialize a new Next.js project in the current directory using npx create-next-app.
    Configure it with:
    - TypeScript: Yes
    - ESLint: Yes
    - Tailwind CSS: No (Vanilla CSS)
    - src/ directory: Yes
    - App Router: Yes
    - Import alias: @/*
    Adjust next.config.ts / next.config.js to allow running locally. Set up standard default layout.tsx and clean page.tsx.
  </action>
  <verify>
    <automated>node -e "require('fs').existsSync('package.json') && process.exit(0) || process.exit(1)"</automated>
  </verify>
  <done>Next.js directory structure exists, package.json lists Next.js dependency, and the app builds successfully.</done>
</task>

<task type="auto">
  <name>Task 2: Configure global design system variables</name>
  <files>src/app/globals.css</files>
  <read_first>DESIGN.md, src/app/globals.css</read_first>
  <action>
    Create or edit src/app/globals.css and define the visual tokens from DESIGN.md inside the :root selector:
    - Define Colors: --color-surface, --color-surface-dim, --color-primary (#091426), --color-secondary (#0051d5), --color-tertiary (#001624), --color-clinical-teal (#0d9488), --color-ai-glow (#e0f2fe), --color-status-success, --color-status-warning, --color-status-error, etc.
    - Define rounded variables: --rounded-sm, --rounded-md, --rounded-lg, --rounded-xl.
    - Define spacing variables: --spacing-space-1, --spacing-space-2, --spacing-space-4, --spacing-space-6, etc.
    Define base browser resets (box-sizing, body margin/padding, custom Inter font configuration).
    Ensure globals.css is imported in src/app/layout.tsx.
  </action>
  <verify>
    <automated>node -e "const content = require('fs').readFileSync('src/app/globals.css', 'utf8'); process.exit(content.includes('--color-clinical-teal') ? 0 : 1)"</automated>
  </verify>
  <done>globals.css exports all DESIGN.md visual token variables and base reset rules.</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| Client browser | Styling and settings are stored locally in client space |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-01-01 | Information Disclosure | Local Storage | mitigate | API keys stored in state/localStorage must be scoped strictly to the client memory, without server logging. |
</threat_model>

<verification>
Run `npm run build` to verify the workspace compiles with no TypeScript or styling compilation errors.
</verification>

<success_criteria>
- Next.js workspace initialized and builds successfully.
- Globals.css contains all required design system variables.
</success_criteria>

<output>
After completion, create `.planning/phases/01-project-setup-core-app-shell/01-01-SUMMARY.md`
</output>
