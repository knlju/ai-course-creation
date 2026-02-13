# UI/UX Design Style Guide for Coding Agents

## 2. Layout System

### 2.1 Spacing and Rhythm

- Use an **8px spacing system** (4/8/12/16/24/32/40/48…).
- Default container padding:
  - Mobile: **16px**
  - Tablet/Desktop: **24px**
- Use consistent vertical spacing:
  - Between related elements: **8–12px**
  - Between sections: **24–40px**

### 2.2 Grid and Alignment

- Prefer a **12-column grid** for desktop layouts, collapsing naturally on smaller screens.
- Align content edges; avoid “almost aligned” layouts.
- Keep max content width readable:
  - Typical content max width: **640–760px**
  - Dense dashboards can be wider, but keep text blocks narrow.

### 2.3 Responsive Behavior

- Mobile-first layout.
- Recommended breakpoints:
  - **≤640px** (mobile)
  - **641–1024px** (tablet/small desktop)
  - **≥1025px** (desktop)
- Avoid horizontal scrolling except for data tables; offer wrapping or stacking.

### 2.4 Information Architecture

- Use clear page structure:
  - Title → summary/help → primary actions → content
- Group related settings and actions into sections.
- Prefer progressive disclosure for advanced options.

### 2.5 Visual Hierarchy

- One obvious primary action per view.
- Headings reflect nesting depth (H1 once per page; H2 per section).
- Use whitespace to separate concepts.

## 3. Color System

### 3.1 Tokenized Color Approach

Define colors as tokens instead of hardcoding:

- `bg.default`, `bg.subtle`
- `text.primary`, `text.muted`
- `border.default`
- `action.primary`, `action.secondary`
- `status.success`, `status.warning`, `status.error`, `status.info`

### 3.2 Core Palette Guidance

- Default to neutral backgrounds and high-legibility text.
- Use one strong accent for primary actions and key highlights.
- Avoid saturated colors for large surfaces.

### 3.3 States and Semantics

- Keep status semantics consistent for success, warning, error, and info.
- State colors must work for hover, active, disabled, and focus.

### 3.4 Gradients and Effects

- Prefer flat color; use gradients sparingly.
- Shadows should be subtle and consistent.

## 4. Typography

- Keep one primary font family with system fallbacks.
- Recommended defaults:
  - H1: 28–32px
  - H2: 20–24px
  - H3: 16–18px
  - Body: 14–16px
  - Caption: 12–13px
- Body line-height: 1.4–1.6; headings: 1.2–1.3.

## 5. Components

- Button variants: primary, secondary, tertiary, destructive.
- Mobile touch targets should be at least 44px height.
- Inputs require visible labels and clear error resolution.
- Use cards for grouped content with 16–24px padding.
- Define loading, empty, and error states for data views.

## 6. Interaction Design

- Show loading indicators for actions taking over 300ms.
- Ensure hover, focus, active, and disabled states for interactivity.
- Use subtle transitions (150–250ms).
- Prefer error prevention over rejection.
- Define empty/loading/error states for every view.

## 8. Content & UX Writing

- Use plain language and concise action labels.
- Keep help text brief and prevention-focused.
- Error messages should include the problem and a fix.
- Keep terminology and tone consistent across the app.
