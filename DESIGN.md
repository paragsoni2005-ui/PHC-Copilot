---
name: Clinical Intelligence System
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#45474c'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#75777d'
  outline-variant: '#c5c6cd'
  surface-tint: '#545f73'
  primary: '#091426'
  on-primary: '#ffffff'
  primary-container: '#1e293b'
  on-primary-container: '#8590a6'
  inverse-primary: '#bcc7de'
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#001624'
  on-tertiary: '#ffffff'
  tertiary-container: '#002c42'
  on-tertiary-container: '#0099d9'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e3fb'
  primary-fixed-dim: '#bcc7de'
  on-primary-fixed: '#111c2d'
  on-primary-fixed-variant: '#3c475a'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#c9e6ff'
  tertiary-fixed-dim: '#89ceff'
  on-tertiary-fixed: '#001e2f'
  on-tertiary-fixed-variant: '#004c6e'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
  clinical-teal: '#0d9488'
  ai-glow: '#e0f2fe'
  status-success: '#10b981'
  status-error: '#ef4444'
  status-warning: '#f59e0b'
  border-subtle: '#e2e8f0'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.25'
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: '1.3'
  body-base:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.01em
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.05em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  space-1: 4px
  space-2: 8px
  space-4: 16px
  space-6: 24px
  space-8: 32px
  space-12: 48px
  margin-page: 24px
  gutter: 16px
  sidebar-width: 280px
---

## Brand & Style

The design system is engineered for the high-stakes environment of healthcare, where clarity, precision, and trust are paramount. The personality is **Clinical, Intelligent, and Attentive**. It avoids the sterility of legacy medical software in favor of a modern, "SaaS-forward" aesthetic that positions AI as a supportive partner rather than a replacement for practitioner expertise.

The design style is a blend of **Modern Minimalism** and **Functional Glassmorphism**. It utilizes:
- **High-density information mapping** without visual clutter.
- **Translucent layering** to maintain context during AI interactions.
- **Generous whitespace** to reduce cognitive load during long clinical shifts.
- **Subtle glowing accents** that signify "active" AI reasoning and data-rich suggestions.

## Colors

The palette is anchored by **Deep Slate (Primary)** to provide a sense of authority and groundedness. **Healthcare Blue (Secondary)** is reserved for primary actions and brand presence, while **Soft Teal/Cyan (Tertiary)** is used exclusively as an "AI Accent" to highlight machine-generated insights and Copilot suggestions.

- **Backgrounds:** Utilize an off-white/light gray base (`#f8fafc`) to minimize eye strain and differentiate from pure white surface containers.
- **AI Accents:** Use the Tertiary color and `ai-glow` for elements where the AI is actively assisting or providing a suggestion.
- **Functional Colors:** Success, Error, and Warning states follow standard clinical conventions but are tuned for high accessibility.

## Typography

This design system leverages **Inter** for its exceptional legibility and neutral, professional character. The hierarchy is designed to handle dense medical data while maintaining a clear path for the eye.

- **Headlines:** Use tighter letter spacing and bold weights to anchor page sections.
- **Body Copy:** Maintains a generous 1.5 line height to ensure patient history and AI responses are easily scannable.
- **Labels:** Small caps or medium weights are used for data labels to differentiate them from the data values they describe.
- **Mobile Adaptivity:** Headlines scale down on mobile to prevent awkward wrapping, while body sizes remain constant for legibility.

## Layout & Spacing

The design system employs a **Fixed Sidebar / Fluid Content** layout model based on an 8px rhythmic grid. 

- **Layout Structure:** A persistent 280px sidebar on desktop houses navigation and system status. The main content area uses a fluid 12-column grid for dashboard widgets.
- **Spacing Philosophy:** Use `space-4` (16px) for internal component padding and `space-6` (24px) for margins between unrelated containers.
- **Breakpoints:**
  - **Desktop (1024px+):** Full 12-column layout with fixed sidebar.
  - **Tablet (768px - 1023px):** Sidebar collapses to an icon-only rail or hides behind a burger menu; content scales to a 6-column grid.
  - **Mobile (<767px):** Single-column stacked layout; margins reduce to 16px.

## Elevation & Depth

Visual hierarchy is established through **Tonal Layering** and **Ambient Shadows**.

- **Surfaces:** The application uses three primary levels:
  1. **Level 0 (Base):** `#f8fafc` background.
  2. **Level 1 (Cards/Containers):** Pure white `#ffffff` with a subtle 1px border (`#e2e8f0`).
  3. **Level 2 (Active/AI):** Cards with a soft tertiary-tinted shadow and a faint glow (`#e0f2fe`) to indicate AI-driven content.
- **Shadows:** Use extra-diffused, low-opacity shadows. 
  - *Default:* `0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)`
  - *AI Focused:* `0 10px 15px -3px rgba(14, 165, 233, 0.1)`
- **Interactions:** Hover states should not increase shadow depth significantly but rather subtly shift the border color or background tint.

## Shapes

The shape language is **Rounded**, conveying friendliness and modern accessibility while maintaining professional discipline.

- **Standard Elements:** Buttons, inputs, and small widgets use a 0.5rem (8px) radius.
- **Containers:** Dashboard cards and modals use a 1rem (16px) radius to create clear visual separation between the layout and the content.
- **Indicators:** Avatars, status dots, and tags with specific numerical counts use "pill" (full) rounding.

## Components

### Buttons & Inputs
- **Primary Action:** Solid Slate (`#1e293b`) with white text.
- **AI Action:** Solid Teal (`#0d9488`) with white text, or white background with a Teal border and soft glow.
- **Input Fields:** 1px solid border (`#e2e8f0`) with a 0.5rem radius. Focus states use a 2px secondary blue ring.

### Command Bar
The central navigation and AI interaction point. A "floating" style bar, center-aligned at the top or bottom of the viewport, with a high elevation shadow and a glassmorphic background (blur: 12px, opacity: 80%).

### AI Suggestion Cards
Cards containing AI-generated insights must be visually distinct. Use a 1px border in the Tertiary color and a soft background tint of `ai-glow`. Include a small "sparkle" or "AI" icon in the top right to denote origin.

### Data Visualizations
Charts should use a "clean-data" approach: no grid lines, clear legends using the Primary Slate for text, and a palette of Secondary and Tertiary blues/teals for data series. 

### Chips & Tags
Used for patient status or medical categories. Low-contrast backgrounds with high-contrast text. For example, "Pending" uses a soft amber background with a dark amber text. All tags are fully rounded.