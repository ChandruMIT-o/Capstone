# UI Design Style Descriptor

This document defines the UI/UX design specification and visual design system derived from the reference aesthetic ([reference_for_ui_aesthetics.png](file:///d:/DEV/Personal/Capstone/context/reference_for_ui_aesthetics.png)) and color palette ([color_palette.png](file:///d:/DEV/Personal/Capstone/context/color_palette.png)).

---

## 1. Visual Philosophy & Design Identity

- **Theme Style**: Modern Dark Mode Studio / Sleek Digital Workspace ("Velvet Dark").
- **Aesthetic Tone**: Ultra-clean, high-density, tactile, and immersive. Uses dark slate backdrop layering paired with vibrant neon micro-accents (electric mint, lime, lavender, sky blue).
- **Core Design Principles**:
  1. **Layered Surface Depth**: Structure surfaces via subtle background tone steps (`#000203` $\rightarrow$ `#181A1C` $\rightarrow$ `#242529`) rather than heavy drop shadows.
  2. **Soft Organic Curves**: Use generous border radii (`12px` – `24px` for containers, full pill `9999px` for badges, tags, and action buttons).
  3. **High-Contrast Focal Points**: Keep interface chrome ultra-dark and matte, drawing eye focus to media viewports, active toggle pills, and vibrant CTA buttons.
  4. **Pill-Centric Micro-UI**: Interactive elements, filter tags, keyframe chips, and format selectors utilize rounded pill geometry with clear active/inactive visual states.

---

## 2. Color Palette System

The color system is divided into dark structural surfaces, high-contrast foreground text, and high-energy neon accents.

```
┌────────────────────────────────────────────────────────────────────────┐
│ Dark Surfaces                                                          │
├─────────────┬─────────────┬─────────────┬─────────────┬────────────────┤
│ #000203     │ #181A1C     │ #242529     │ #373B3E     │ #FAFCFE        │
│ Deep Canvas │ Primary Surface │ Elevated Sub │ Border/Muted│ High Text      │
└─────────────┴─────────────┴─────────────┴─────────────┴────────────────┘
┌────────────────────────────────────────────────────────────────────────┐
│ Vibrant Accents & Highlights                                           │
├─────────────┬─────────────┬─────────────┬─────────────┬────────────────┤
│ #53FFA9     │ #D3FF69     │ #9A99FE     │ #97C8EC     │                │
│ Neon Mint   │ Lime Green  │ Lavender    │ Sky Blue    │                │
└─────────────┴─────────────┴─────────────┴─────────────┴────────────────┘
```

### 2.1 Structural & Surface Tokens

| Token Name | Hex Code | RGB | Usage / Semantics |
| :--- | :--- | :--- | :--- |
| `--color-bg-base` | `#000203` | `rgb(0, 2, 3)` | Main application workspace canvas, outer window frame background. |
| `--color-surface-primary` | `#181A1C` | `rgb(24, 26, 28)` | Primary container cards, sidebar navigation background, bottom panel shell. |
| `--color-surface-elevated` | `#242529` | `rgb(36, 37, 41)` | Input fields, active card states, button containers, toolbars. |
| `--color-border-subtle` | `#373B3E` | `rgb(55, 59, 62)` | Dividers, subtle container borders, hover outlines, inactive track outlines. |
| `--color-text-primary` | `#FAFCFE` | `rgb(250, 252, 254)` | High-contrast body text, primary headers, active icons. |
| `--color-text-muted` | `#8A8F98` | `rgb(138, 143, 152)` | Subtitles, disabled states, unselected navigation item labels, timestamps. |

### 2.2 Accent & Interactive Tokens

| Token Name | Hex Code | RGB | Usage / Semantics |
| :--- | :--- | :--- | :--- |
| `--color-accent-mint` | `#53FFA9` | `rgb(83, 255, 169)` | Primary CTA, confirmation buttons, selected checkmarks, active scrubber handle. |
| `--color-accent-lime` | `#D3FF69` | `rgb(211, 255, 105)` | Highlighting, secondary status indicators, featured badges, active filter chips. |
| `--color-accent-lavender` | `#9A99FE` | `rgb(154, 153, 254)` | Tag badges, active pill selection rings, special category indicators. |
| `--color-accent-sky` | `#97C8EC` | `rgb(151, 200, 236)` | Secondary action buttons (e.g. Export CTA pill), interactive control buttons. |

---

## 3. Typography & Hierarchy

- **Font Family**: Modern, highly legible geometric sans-serif (e.g., `Inter`, `Plus Jakarta Sans`, or `Outfit`).
- **Font Scale & Weight Matrix**:

| Style Level | Size | Weight | Line Height | Color Token |
| :--- | :--- | :--- | :--- | :--- |
| **Header 1 / Page Title** | `20px - 22px` | `600` (SemiBold) | `1.3` | `--color-text-primary` |
| **Section Title** | `14px - 15px` | `600` (SemiBold) | `1.4` | `--color-text-primary` |
| **Body Text** | `13px - 14px` | `400` (Regular) | `1.5` | `--color-text-primary` |
| **Control Label / Button**| `12px - 13px` | `500` (Medium) | `1.2` | `--color-text-primary` |
| **Caption / Meta / Time** | `11px - 12px` | `400` (Regular) | `1.2` | `--color-text-muted` |

---

## 4. Geometry & Radius System

- **Corner Radii**:
  - `var(--radius-pill)` (`9999px`): Used for pills, tags, action buttons, format selectors, and check indicators.
  - `var(--radius-sm)` (`8px` – `10px`): Used for tool icons, sub-buttons, waveform tracks.
  - `var(--radius-md)` (`12px` – `16px`): Used for inner container boxes, search inputs, style selection rows.
  - `var(--radius-lg)` (`20px` – `24px`): Used for main media preview viewport, major sidebars, and panel cards.

---

## 5. UI Component Specs

### 5.1 Sidebar & Navigation Bar
- **Background**: `--color-bg-base` (`#000203`) or `--color-surface-primary` (`#181A1C`).
- **Icons**: Monochrome text muted (`#8A8F98`), transitioning to `--color-text-primary` (`#FAFCFE`) on hover/active state.
- **Active Navigation Indicator**: Subtle round hover glow or background pill in `--color-surface-elevated`.

### 5.2 Form Controls & Inputs
- **Search & Text Inputs**: Background `--color-surface-elevated` (`#242529`), radius `16px` or full pill (`9999px`), border `1px solid transparent` or `1px solid #373B3E`.
- **Segmented Radio / Toggle Groups**: Pill container (`#242529`) with active pill insert (`#181A1C` or `--color-accent-sky` / `#FAFCFE` text with cyan checkmark icon).

### 5.3 Media Preview Stage
- **Viewport Canvas**: Deep dark center frame with soft outer rounded corners (`20px - 24px`).
- **Border Treatment**: Thin contrast border (`1px solid #373B3E`) or subtle dark drop-shadow to separate media content from dark chrome background.

### 5.4 Floating Chips & Pill Badges
- **Tag Structure**: Rounded pill shape with dark background (`#242529`) and light border (`#373B3E`), or filled accent badge (e.g. mint `#53FFA9` text with soft glow).

### 5.5 Timeline & Scrubber (Bottom Panel)
- **Panel Surface**: `--color-surface-primary` (`#181A1C`).
- **Timeline Tracks**: Surface `--color-surface-elevated` (`#242529`) with subtle wave outline.
- **Scrubber Needle**: Vertical line in cyan `--color-accent-mint` (`#53FFA9`) topped with diamond or pill keyframe handle.

---

## 6. Ready-to-Use CSS Variables & Utilities

```css
:root {
  /* Surface & Base Tones */
  --color-bg-base: #000203;
  --color-surface-primary: #181A1C;
  --color-surface-elevated: #242529;
  --color-border-subtle: #373B3E;

  /* Text & Foreground */
  --color-text-primary: #FAFCFE;
  --color-text-muted: #8A8F98;

  /* Accent & Energy Colors */
  --color-accent-mint: #53FFA9;
  --color-accent-lime: #D3FF69;
  --color-accent-lavender: #9A99FE;
  --color-accent-sky: #97C8EC;

  /* Radius Tokens */
  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 22px;
  --radius-pill: 9999px;

  /* Font Family */
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Base Body Style */
body {
  background-color: var(--color-bg-base);
  color: var(--color-text-primary);
  font-family: var(--font-family);
}

/* Card Surface Class */
.ui-card {
  background-color: var(--color-surface-primary);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-lg);
}

/* Elevated Container / Input */
.ui-surface-elevated {
  background-color: var(--color-surface-elevated);
  border-radius: var(--radius-md);
}

/* Pill Button Primary */
.btn-pill-primary {
  background-color: var(--color-accent-sky);
  color: #000203;
  border-radius: var(--radius-pill);
  font-weight: 600;
  padding: 8px 18px;
  border: none;
}

/* Active Check / Mint Accent */
.accent-mint-text {
  color: var(--color-accent-mint);
}
```
