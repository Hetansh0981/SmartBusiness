---
name: Merchant Precision
colors:
  surface: '#f9f9ff'
  surface-dim: '#d3daea'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eefe'
  surface-container-high: '#e2e8f8'
  surface-container-highest: '#dce2f3'
  on-surface: '#151c27'
  on-surface-variant: '#5a4138'
  inverse-surface: '#2a313d'
  inverse-on-surface: '#ebf1ff'
  outline: '#8e7166'
  outline-variant: '#e2bfb2'
  surface-tint: '#a73a00'
  primary: '#a33900'
  on-primary: '#ffffff'
  primary-container: '#cc4900'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb599'
  secondary: '#575e70'
  on-secondary: '#ffffff'
  secondary-container: '#d9dff5'
  on-secondary-container: '#5c6274'
  tertiary: '#006948'
  on-tertiary: '#ffffff'
  tertiary-container: '#00855d'
  on-tertiary-container: '#f5fff7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbce'
  primary-fixed-dim: '#ffb599'
  on-primary-fixed: '#370e00'
  on-primary-fixed-variant: '#7f2b00'
  secondary-fixed: '#dce2f7'
  secondary-fixed-dim: '#c0c6db'
  on-secondary-fixed: '#141b2b'
  on-secondary-fixed-variant: '#404758'
  tertiary-fixed: '#85f8c4'
  tertiary-fixed-dim: '#68dba9'
  on-tertiary-fixed: '#002114'
  on-tertiary-fixed-variant: '#005137'
  background: '#f9f9ff'
  on-background: '#151c27'
  surface-variant: '#dce2f3'
typography:
  display:
    fontFamily: Geist
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Geist
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.025em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.015em
  body-lg:
    fontFamily: Geist
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: -0.005em
  body-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0em
  label-md:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Geist
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.02em
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: -0.01em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

This design system serves high-velocity Indian SMB merchants, retail operators, and modern direct-to-consumer store owners. The visual tone balances enterprise-grade efficiency with regional cultural resonance: utilitarian, deeply trustworthy, and tactfully vibrant.

### Aesthetic Principles
- **Restrained Utility:** Prioritize information density, scannability, and operational speed. Every border, fill, and icon must have utility.
- **Warm Precision:** Avoid cold, purely mechanical grays by utilizing warm-tinted neutrals paired with an energetic Indian saffron orange accent that signifies intent, action, and commercial prosperity.
- **Engineered Restraint:** Borrow structural discipline from Linear and financial clarity from Stripe. Absolutely no glossy glassmorphism, decorative blur layers, or skeuomorphic embellishments.

## Colors

The palette leverages a high-contrast neutral backbone anchored by a purposeful saffron accent and quiet semantic tones.

### Color Architecture
- **Primary Accent (`#EA580C`):** High-intent Indian saffron. Used strictly for core conversions, primary CTAs, active operational statuses, and focused interaction rings.
- **Secondary / Contrast Anchor (`#111827`):** Deep charcoal slate. Grounds structural elements, primary metrics, high-emphasis text, and dark pill badges.
- **Tertiary / Success (`#059669`):** Grounded emerald. Reserved for settled payments, positive inventory balances, upward GMV trends, and success badges paired with a soft background tint (`#ECFDF5`).
- **Surface & Canvas:**
  - Base Canvas: `#F8F9FA`
  - Container Surfaces: `#FFFFFF`
  - Subtle Inset/Muted Canvas: `#F3F4F6`
- **Borders & Dividers:** High-precision hairline borders using `#E5E7EB` for structural containers and `#F1F3F5` for soft internal table separators.
- **Typography Tiers:**
  - High Emphasis: `#111827`
  - Medium Emphasis / Body: `#374151`
  - Secondary / Form Labels: `#4B5563`
  - Muted / Placeholders / Metadata: `#6B7280`

## Typography

The typographic hierarchy is built on Geist to deliver a technical, developer-grade precision suited for financial and inventory processing.

### Rules & Application
- **Tracking:** Headings feature strict negative tracking (`-0.03em` to `-0.015em`) to retain visual tightness at larger scale. Labels and micro-data use neutral or slight positive tracking for legibility at small sizes.
- **Numbers & Currencies:** Currency indicators (₹), SKU codes, GST numbers, order tracking IDs, and balance adjustments should utilize `data-mono` (JetBrains Mono) with tabular figures enabled (`font-variant-numeric: tabular-nums`) to maintain column vertical alignment.
- **Hierarchy:** Reserve font weight `600` strictly for primary section headings, key metrics, and active states. Use `500` for table headers and functional inputs, leaving body copy cleanly at weight `400`.

## Layout & Spacing

The dashboard runs on an adaptable fluid grid structured for dense multi-column merchant tools.

### Grid & Canvas Structure
- **Desktop (1280px+):** Fixed collateral navigation (240px wide), followed by a 12-column responsive fluid content canvas with `1.5rem` gutters and `2rem` outer page margins.
- **Tablet (768px - 1279px):** Collapsed icon navigation (64px wide), fluid 8-column canvas with `1rem` gutters and `1.5rem` margins.
- **Mobile (<768px):** Single-column stacked layout with top utility header, persistent bottom action bar for critical POS/order actions, and `1rem` safe-margin boundaries.

### Layout Principles
- **Information Density:** Compact component padding (`space-xs` to `space-md`) ensures high volume of SKUs, orders, and payment records without unneeded vertical scrolling.
- **Micro-Gaps:** Use `0.25rem` (4px) and `0.5rem` (8px) for tightly related data-label pairs and inline badges.

## Elevation & Depth

Visual separation relies on crisp containment lines and soft, restrained elevation rather than floating drop shadows or layered blurs.

### Surface Hierarchy
- **Level 0 (Canvas):** Tone `#F8F9FA`. Underlying background for dashboard shell and workspace canvases.
- **Level 1 (Card & Module Surface):** Tone `#FFFFFF`, bounded by a `1px solid #E5E7EB` border. Minimal ground shadow: `0 1px 2px 0 rgba(0, 0, 0, 0.05)`.
- **Level 2 (Hover States & Menus):** Pure white background with border `#E5E7EB`, elevated by an ambient lift: `0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.04)`.
- **Level 3 (Modals & Command Center / Slide-overs):** `0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.03)` with a neutral backdrop scrim (`rgba(17, 24, 39, 0.4)`).

## Shapes

The design system employs a soft, sharp geometry (`roundedness: 1`) to project technical discipline, precision, and tool-like utility.

### Radius Definitions
- **Base Components (Inputs, Buttons, Badges, Dropdowns):** `0.25rem` (4px). Clean, definitive corners that sit flush in dense arrangements.
- **Structural Modules (Cards, Modals, Flyouts):** `0.5rem` (8px). Softened enough to signal group hierarchy while preventing visual softness.
- **Status Indicators & Micro-Chips:** Optional pill formatting strictly for micro tags (`0.75rem`) where differentiation from square input fields is essential.

## Components

### Buttons
- **Primary:** Background `#EA580C`, text `#FFFFFF`, border none, corner radius `0.25rem`. Hover `#C2410C`. Focus state: `2px` ring `#EA580C` offset by `2px` white. Height `32px` (compact) or `36px` (standard).
- **Secondary:** Background `#FFFFFF`, text `#111827`, border `1px solid #E5E7EB`. Hover background `#F9FAFB`, hover border `#D1D5DB`.
- **Tertiary / Ghost:** Background transparent, text `#4B5563`. Hover background `#F3F4F6`, hover text `#111827`.

### Data Tables
- **Container:** Wrapped in `#FFFFFF` card with `1px solid #E5E7EB` border and `0.5rem` radius.
- **Header:** Height `36px`, background `#F9FAFB`, text `#4B5563`, font style `label-sm`, uppercase, letter spacing `0.02em`. Border bottom `1px solid #E5E7EB`.
- **Row:** Height `44px`, horizontal borders `1px solid #F1F3F5`. Row hover `#F9FAFB`. Right-aligned numeric and monetary values formatted in `data-mono`.

### Form Fields & Inputs
- **Text & Number Inputs:** Background `#FFFFFF`, border `1px solid #E5E7EB`, height `34px`, horizontal padding `0.625rem`. Placeholder `#6B7280`. Focused border `#EA580C` with subtle `1px` shadow ring `rgba(234, 88, 12, 0.15)`.
- **Checkboxes & Radios:** Size `16px`, border `1px solid #D1D5DB`, radius `2px` (checkbox) or circle (radio). Active state: background `#EA580C`, icon stroke `#FFFFFF`.

### Chips & Status Badges
- **Success (Settled / In Stock):** Background `#ECFDF5`, text `#059669`, border `1px solid rgba(5, 150, 105, 0.2)`.
- **Warning (Low Stock / Pending COD):** Background `#FFFBEB`, text `#D97706`, border `1px solid rgba(217, 119, 6, 0.2)`.
- **Neutral (Draft / Inactive):** Background `#F3F4F6`, text `#4B5563`, border `1px solid #E5E7EB`.
- **Dimensions:** Height `20px`, horizontal padding `6px`, font style `label-sm`, radius `4px`.

### Cards & Key Metric Displays
- **Metric Cards:** Padding `1rem`, background `#FFFFFF`, border `1px solid #E5E7EB`, radius `0.5rem`. Contains label (`label-md`, `#6B7280`), followed by massive value (`headline-lg`, `#111827`), accompanied by an inline contextual trend badge (`label-sm`).