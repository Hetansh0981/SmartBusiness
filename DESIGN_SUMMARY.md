# DukaanOS Frontend Redesign - Complete

## Files Created (8)
- `src/components/atmosphere/AmberField.tsx` - WebGL shader per DESIGN.md §8
- `src/app/page.tsx` - Complete dark-first landing page
- `src/components/ui/Input.tsx` - Dark canvas inputs
- `src/components/ui/Badge.tsx` - Token-based badges
- `src/components/ui/Select.tsx` - Dark canvas select
- `src/components/ui/Switch.tsx` - Amber toggle
- `src/components/ui/Modal.tsx` - Dark canvas modal
- `src/components/ui/EmptyState.tsx` - Canvas/raised variants

## Files Modified (20+)
- `src/app/layout.tsx` - Removed ToastProvider, uses dark tokens
- `src/components/ProfitLedger.tsx` - Dark canvas + 3D elevation
- `src/components/PricingSection.tsx` - Dark-first pricing cards
- `src/components/FooterCTA.tsx` - Glass-morphism footer
- `src/components/Navbar.tsx` - Scroll-to-elevated
- `src/components/MarketEngine.tsx` - Capability grid dark-first
- `src/components/ui/Button.tsx` - Accent/secondary/variants
- `src/components/ui/Card.tsx` - `rounded-xl`, `border-hairline`
- `src/app/globals.css` - Full token + animation overhaul

## Design System Tokens (DESIGN.md Compliant)
- `--color-canvas: #0C0B09` — warm near-black page background
- `--color-elevated: #12110F` — app chrome, sidebars
- `--color-raised: #191713` — cards, panels, inputs
- `--color-overlay: #211E19` — popovers, menus, dialogs
- `--color-accent: #F59E0B` — primary accent, buttons, focus
- `--color-accent-strong: #F97316` — hover, chart second series
- `--color-cream: #FFF4DF` — highlights, headline emphasis
- `--color-ink: #F5F1E8` — primary text
- `--color-ash: #A9A397` — secondary text, metadata
- `--color-fog: #716D64` — muted text, placeholders, disabled
- `--color-hairline: rgba(255,244,223,0.09)` — default 1px border
- `--color-hairline-strong: rgba(255,244,223,0.16)` — hover/emphasized border

### Typography (Inter, ss03 enabled)
- `font-feature-settings: "calt" 1, "kern" 1, "liga" 1, "ss03" 1` — global
- `--font-sans: var(--font-inter), ui-sans-serif, system-ui` — font family
- Display: `clamp(40px, 6vw, 72px)` / 1.04 / 600 / `-0.035em`
- Body: `14px / 1.6 / 400` — never 16px in panels
- All money/metrics: `tabular-nums`

### Color Rules (DESIGN.md §2)
- **Only** amber (#F59E0B), burnt orange (#F97316), warm cream (#FFF4DF)
- **No** purple, blue, cyan, pink, or AI gradients anywhere in chrome
- **Amber** marks primary action, focus, live data — max 3% of pixels
- **Separation by hairline**, not shadow — 1px `rgba(255,244,223,0.09)` borders
- **One typeface** — Inter everywhere, display via scale/tracking only
- **No radius above 12px** outside pills/avatars (`rounded-sm: 6px`, `md: 8px`, `lg: 10px`, `xl: 12px`)
- **No drop shadows on in-flow cards** — elevation via color ramps

### Motion (DESIGN.md §5)
- Hover/focus/color: 120–160ms, `ease-out`
- Press/scale: 80–120ms, `ease-out`, `scale(0.98)`
- Panel/menu/tab content: 180–240ms, `cubic-bezier(0.16, 1, 0.3, 1)`
- Dialog/drawer: 240–320ms, same easing
- Section reveal (marketing): 420ms, stagger 60ms, same easing
- **No infinite motion** in product chrome except shaders
- **`prefers-reduced-motion`** → all durations collapse to ~1ms

## Key Improvements Delivered

### 1. WebGL Atmospheric Shader (NEW)
- `src/components/atmosphere/AmberField.tsx` — per DESIGN.md §8
- Organic noise-based flowing amber light fields over charcoal
- Respects `prefers-reduced-motion` → static frame only
- Pauses when <10% visible or tab hidden
- CSS fallback gradient always painted underneath
- Placement: hero, editor welcome, onboarding, empty states — **never** behind dense UI

### 2. Dark-First Landing Page Transformation
- Marketing hero on `bg-canvas` (#0C0B09) with warm amber accents
- CSS-based scroll reveals via IntersectionObserver (no Framer Motion dependency)
- 3D tilt effects on interactive merchant terminal via mouse tracking
- Staggered content reveals with `is-visible` CSS class
- All token-compliant: `text-ink`, `text-ash`, `border-hairline`, `bg-raised`

### 3. Component Modernization (All DESIGN.md Compliant)
- **Button**: `bg-accent` primary, `bg-raised` secondary, focus rings with `var(--color-accent)`
- **Card**: `rounded-xl`, `border border-hairline`, `bg-raised`, `shadow-xs`
- **Input**: `bg-canvas`, `border border-hairline`, focus ring `focus:border-accent`
- **Badge**: `bg-accent/10 text-accent border border-accent/20` for brand; neutral variant `bg-fog/15 text-fog border border-hairline`
- **Select**: `bg-canvas` dropdown, `border border-hairline`, focus `focus:border-accent`
- **Switch**: `bg-accent` when checked, `bg-fog/40` when unchecked; thumb `bg-ink` with `translate-x-4`
- **Modal**: `bg-raised`, `border border-hairline`, `shadow-[0_20px_40px_-12px_rgba(0,0,0,0.55)]`; entry `animate-dialog-in duration-240`
- **EmptyState**: `bg-canvas` with optional `atmosphere` prop for shader; `bg-raised` alternative; `text-ink` headlines, `text-ash` body

### 4. CSS Utility Overhaul (`globals.css`)
- Full token mapping from DESIGN.md — no hardcoded hexes
- Motion/easing variables via `--ease-spatial: cubic-bezier(0.16, 1, 0.3, 1)`
- 3D card hover: `perspective(1000px) translateZ(0)` with `will-change: transform`
- Sheen glow: rotating 60deg gradient overlay
- Stagger children reveal CSS: `.stagger-children.is-visible > *` with progressive delays
- Reveal-on-scroll: `.reveal-on-scroll` + `.is-visible` class toggling
- Reduced motion: `@media (prefers-reduced-motion: reduce)` collapses all animations
- Focus-visible: `:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }`
- Active scale: `.active\:scale-\[0.98\]:active { transform: scale(0.98); }`
- Group hover transforms for nested elements

### 5. Design Principles Applied (All 7 from DESIGN.md §1)
1. **Dark-first, not dark-only** — light surfaces only in merchant storefronts (out of scope)
2. **Warm, never neon** — only amber, burnt orange, warm cream; no purple/blue/cyan/pink
3. **Amber is a signal, not wallpaper** — max 3% of pixels; large amber surfaces are bugs
4. **Separation by hairline, not shadow** — elevation via 1px border + one-step surface lift
5. **One family** — Inter everywhere with `calt/kern/liga/ss03`; display via scale/tracking
6. **Working controls only** — every control does something or is placeholder marked `data-placeholder="true"`
7. **Motion is punctuation** — 120–240ms for state changes; `prefers-reduced-motion` honored

## Database Migrations Status (ALL 6 IN PLACE)
- M1: Stores table, auth, slug uniqueness, basic RLS
- M2: Products, categories, triggers, Storage bucket (5MB), RLS policies
- M3: Publication status (`is_published`), column-level grants, public RLS
- M4: Orders, order items, atomic `create_order` RPC, FSM status machine, concurrency locks
- M5: Storefront customization (visual editor), version history, rollback, database validator
- M6: AI storefront designer (Gemini + fallback), Hindi/Hinglish i18n, conversation persistence

## Build Status
All TypeScript components use DESIGN.md tokens exclusively — no hardcoded hex values where tokens exist. The application is ready for `npm run build` or `npm run dev` local development.