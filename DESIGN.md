# Dukaan OS — Design System

**Status:** canonical · **Applies to:** marketing site, visual editor, admin dashboard
**Stack:** Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · lucide-react · Recharts · Framer Motion

This file is the single source of truth for all frontend work in this repository.
If a component, page, or stylesheet disagrees with this document, **this document wins**.

---

## 0. References consulted (honesty note)

| Source | Outcome |
| --- | --- |
| `getdesign.md/design-md` catalog | Inspected. |
| **Recast** `getdesign.md/design-md/recast` | **Not available.** Returns 404; no entry in the catalog or in GitHub code search. It was **not** used as a visual source — nothing in this system is attributed to it. |
| **Raycast** DESIGN.md | **Retrieved in full** via `npx getdesign add raycast` → stored at [`raycast/DESIGN.md`](./raycast/DESIGN.md) (669 lines). Primary dark-system reference. |
| raycast.com | Fetched and read for atmosphere: near-black canvas, hairline borders, restrained lighting, Inter + `ss03`, white CTA pill, generous ~96px rhythm. |
| Linear | Secondary dark-SaaS reference (surface ladder, hairline separation, low-noise density). |
| `stitch_design/DESIGN.md` ("Merchant Precision") | Prior in-repo reference; borrowed only its restraint on radius and its tabular-numeral discipline. |

**What we take from Raycast:** the dark canvas discipline, the 4-step surface ladder, hairline borders instead of drop shadows, typographic feature settings, and the rule that light is *earned* — an accent appears because something is interactive or important, never because a panel looked empty.

**What we deliberately do not copy:** Raycast's pure monochrome accent policy. Dukaan OS is a merchant product for Indian retail; it keeps a **warm amber/orange** identity.

---

## 1. Principles

1. **Dark-first, not dark-only.** The system is designed on a warm near-black canvas. Light surfaces exist only inside merchant storefronts, which are merchant-authored content and out of scope for this document.
2. **Warm, never neon.** The only hues are amber (`#F59E0B`), burnt orange (`#F97316`), and warm cream (`#FFF4DF`). No purple, blue, cyan, pink, or "AI-gradient" surfaces anywhere in product chrome.
3. **Amber is a signal, not a wallpaper.** Amber marks the primary action, the current selection, focus, and live data. Large amber surfaces are a bug. A dashboard screen should read as charcoal + cream text, with amber appearing in maybe 3% of pixels.
4. **Separation by hairline, not shadow.** Elevation is expressed with a 1px border and a one-step surface lift. Drop shadows are reserved for genuinely floating layers (menus, dialogs, drawers).
5. **One family.** Inter everywhere, with `calt/kern/liga/ss03`. Display sizes are made by scale and tracking, never by a second typeface.
6. **Working controls only.** Every control in this product either does something or is explicitly marked as a placeholder. No decorative buttons.
7. **Motion is punctuation.** 120–240ms for state changes, 240–420ms for spatial changes, easing `cubic-bezier(0.16, 1, 0.3, 1)`. Everything honors `prefers-reduced-motion`.

---

## 2. Color

### 2.1 Core palette

| Token | Value | Role |
| --- | --- | --- |
| `--color-canvas` | `#0C0B09` | Page background. Warm near-black. |
| `--color-elevated` | `#12110F` | App chrome: sidebar, toolbar, top bar. |
| `--color-raised` | `#191713` | Cards, panels, inputs, table rows on hover. |
| `--color-overlay` | `#211E19` | Popovers, menus, dialogs, selected rows, active tabs. |
| `--color-accent` | `#F59E0B` | Primary accent. Primary buttons, focus ring, active state, key data. |
| `--color-accent-strong` | `#F97316` | Secondary accent. Hover of primary, chart second series, gradient partner. |
| `--color-cream` | `#FFF4DF` | Warm cream. Brand highlights, headline emphasis, icon tints. |
| `--color-ink` | `#F5F1E8` | Primary text. |
| `--color-ash` | `#A9A397` | Secondary text. |
| `--color-fog` | `#716D64` | Muted text, placeholders, disabled labels, axis labels. |
| `--color-hairline` | `rgba(255,244,223,0.09)` | Default border. |
| `--color-hairline-strong` | `rgba(255,244,223,0.16)` | Hover / emphasized border, dividers between dense rows. |

### 2.2 Functional colors

| Token | Value | Use |
| --- | --- | --- |
| `--color-success` | `#4FA97A` | Paid, published, in stock, healthy. |
| `--color-warning` | `#F59E0B` | Pending, low stock, unsaved. (= accent) |
| `--color-danger` | `#E5644E` | Failed, out of stock, destructive. |
| `--color-info` | `#A9A397` | Neutral informational. Deliberately **not** blue. |

Status colors are used at full strength only for a **dot, a 1px ring, or ≤12px text**. Backgrounds use `color-mix(in srgb, <status> 12%, transparent)`.

### 2.3 Ratio rules

- Text on `canvas`/`elevated`/`raised`/`overlay` must be `ink` (≥12:1), `ash` (≥5.5:1), or `fog` (≥4.5:1 — never for essential instructions).
- A primary button is `accent` background with **`#1A1408` text** (not white — white on `#F59E0B` fails AA at small sizes).
- Never place `ash` text on `overlay` for anything a user must read to proceed.

### 2.4 Gradients

Only these two are permitted, and only in the marketing hero, the editor welcome, and empty states:

```css
/* atmospheric field — never behind dense UI */
radial-gradient(ellipse 80% 60% at 50% 0%, rgba(245,158,11,0.16), transparent 70%)
radial-gradient(ellipse 60% 50% at 85% 30%, rgba(249,115,22,0.10), transparent 65%)
```

```css
/* text emphasis — max one per headline */
linear-gradient(180deg, #FFF4DF 0%, #F5C877 100%)  /* used as text fill */
```

Forbidden: rainbow gradients, mesh gradients, blue/purple glows, colored card backgrounds.

---

## 3. Typography

Single family: **Inter** (variable, self-hosted via `next/font`, `display: swap`).

```css
font-feature-settings: "calt" 1, "kern" 1, "liga" 1, "ss03" 1;
font-variant-numeric: tabular-nums; /* all money, counts, dates, tables */
```

| Role | Size / line-height | Weight | Tracking |
| --- | --- | --- | --- |
| Display (marketing hero) | `clamp(40px, 6vw, 72px)` / 1.04 | 600 | `-0.035em` |
| H1 (page title) | 28–32px / 1.15 | 600 | `-0.025em` |
| H2 (section) | 22–24px / 1.25 | 600 | `-0.02em` |
| H3 (card title) | 15–16px / 1.4 | 600 | `-0.01em` |
| Body | 14px / 1.6 | 400 | `0` |
| Small / helper | 13px / 1.55 | 400 | `0` |
| Label / eyebrow | 11–12px / 1.4 | 500 | `0.08em`, UPPERCASE |
| Micro (table meta, badges) | 11px / 1.3 | 500 | `0.02em` |

Rules:
- Marketing is the **only** place type exceeds 32px.
- Dashboard/editor density: 14px body, 13px controls, 11–12px meta. Never 16px body in a panel.
- Money and metrics always `tabular-nums`.
- Sentence case for buttons and headings. UPPERCASE only for 11–12px eyebrows and table headers.
- Max line length 68ch for prose, 52ch for marketing sub-headlines.

---

## 4. Space, radius, elevation

**Spacing** — strict 4/8 scale: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96`.
Panel padding is 16px. Card padding 20–24px. Marketing section rhythm is **96px** desktop / 64px mobile.

**Radius** (restrained — the spec, expressed as Tailwind tokens):

| Token | Value | Use |
| --- | --- | --- |
| `rounded-sm` | 6px | Badges, chips, small inputs |
| `rounded-md` | 8px | Buttons, inputs, tabs |
| `rounded-lg` | 10px | Cards, panels, menus |
| `rounded-xl` | 12px | Dialogs, drawers, large frames |
| `rounded-full` | 9999px | Pills, avatars, dots only |

No 16px+ radii. No blobs. No `rounded-3xl` cards.

**Elevation** — border-first:

| Level | Expression |
| --- | --- |
| 0 — inset | `border border-hairline` + `bg-raised` |
| 1 — raised | `border border-hairline` + `bg-overlay` |
| 2 — floating (menu/tooltip) | `border border-hairline-strong` + `bg-overlay` + `shadow-[0_16px_40px_-12px_rgba(0,0,0,0.7)]` |
| 3 — modal | level 2 + backdrop `rgba(6,5,4,0.72)` + `backdrop-blur-sm` |

Shadows are **black and soft**, never colored, never amber-tinted.

---

## 5. Motion

| Kind | Duration | Easing |
| --- | --- | --- |
| Hover / focus / color | 120–160ms | `ease-out` |
| Press / scale | 80–120ms | `ease-out`, `scale(0.98)` |
| Panel, menu, tab content | 180–240ms | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Dialog / drawer | 240–320ms | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Section reveal (marketing) | 420ms, stagger 60ms | `cubic-bezier(0.16, 1, 0.3, 1)` |

- No infinite animation in product chrome except the skeleton shimmer and the shader.
- `prefers-reduced-motion: reduce` → all durations collapse to ~1ms, reveals render at final state, the shader renders a single static frame.

---

## 6. Iconography

**lucide-react only.** One set, one stroke language.

- Default: `size={16}`, `strokeWidth={1.75}` in dense UI; `size={18}` for sidebar/nav items; `size={20}`+ for empty states and feature blocks.
- Never emoji as icons. Never mixed icon libraries. Never filled icons next to stroked ones.
- Icon color inherits `ash` by default; `accent` only when the icon *is* the state (active nav, live indicator).
- Decorative icons get `aria-hidden="true"`; interactive icon-only controls get `aria-label` + a tooltip.

---

## 7. Component system

All components live in `src/components/ui/` and are re-exported from `src/components/ui/index.ts`.
**Never hardcode a hex value where a token exists.** Use `bg-raised`, `text-ash`, `border-hairline`, etc.

### 7.1 Inventory & required states

Every component below exists, and every interactive one implements **hover, active, focus-visible, disabled, loading, selected** as applicable.

| Component | File | Notes |
| --- | --- | --- |
| `Button` | `Button.tsx` | variants: `primary` · `secondary` · `ghost` · `danger` · `subtle`; sizes `sm/md/lg`; `isLoading` swaps content for a spinner and sets `aria-busy`; `leftIcon`/`rightIcon`. |
| `IconButton` | `Button.tsx` | square, always `aria-label` + `Tooltip`; sizes `sm/md`. |
| `Input`, `Textarea`, `Field` | `Input.tsx` | `Field` owns label / helper / error / required marker and wires `aria-describedby`. |
| `Select` | `Select.tsx` | native `<select>` restyled (keyboard + screen-reader correct for free). |
| `Checkbox`, `Switch`, `Radio` | `Choice.tsx` | `role`-correct, `aria-checked`, disabled states. |
| `DropdownMenu`, `ContextMenu` | `Menu.tsx` | roving focus, `Escape` closes, click-outside closes, sub-menus, destructive item variant, `Shortcut` slot. |
| `CommandMenu` | `Command.tsx` | ⌘K/Ctrl-K palette: fuzzy filter, arrow-key navigation, grouped results, empty state, `kbd` hints. |
| `Tooltip` | `Tooltip.tsx` | 400ms open delay, 80ms close, hover **and** focus triggered, `Escape` dismisses, never contains interactive content. |
| `Tabs`, `TabList`, `Tab`, `TabPanel` | `Tabs.tsx` | `role="tablist"`, arrow-key roving tabindex, animated active pill. |
| `Dialog` | `Dialog.tsx` | focus trap, `Escape`, scroll lock, backdrop dismiss (opt-out for destructive), sizes `sm/md/lg`. |
| `ConfirmDialog` | `Dialog.tsx` | title / body / confirm label / cancel label / `tone: default\|danger`; confirm button reflects loading. |
| `Drawer` | `Drawer.tsx` | side `right\|left\|bottom`, same focus discipline as Dialog, used for inspector/history panels. |
| `Toast`, `ToastProvider`, `useToast` | `Toast.tsx` | `success\|error\|info\|warning`, optional action, auto-dismiss 5s (errors sticky), `role="status"`, viewport bottom-right. |
| `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`, `Panel` | `Card.tsx` | `Panel` is the bordered app-surface primitive used by dashboard/editor. |
| `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell` | `Table.tsx` | sticky header, zebra by hairline only, numeric cells `tabular-nums` + right aligned, row hover `bg-raised`, row selected `bg-overlay`. |
| `Sidebar`, `SidebarSection`, `SidebarItem` | `Sidebar.tsx` | persistent app nav; active item = `bg-overlay` + `accent` left bar + `ink` label. |
| `AppTopbar` | `AppTopbar.tsx` | compact 56px top bar: breadcrumb slot, search, actions, account. |
| `Navbar` (marketing) | `Navbar.tsx` | sticky, transparent → `elevated` + hairline on scroll; mobile sheet menu. |
| `SearchInput`, `SearchBar` | `SearchInput.tsx` | leading icon, `Escape` clears, clear button when filled, loading state. |
| `Breadcrumbs` | `Breadcrumbs.tsx` | `nav[aria-label]`, `>` separators, current page `aria-current`, collapses to "…" on narrow. |
| `StatusIndicator` | `Status.tsx` | 6px dot + label; tone `success\|warning\|danger\|neutral\|accent`; optional pulsing "live" variant (max one per screen). |
| `Skeleton`, `SkeletonText`, `TableSkeleton` | `Skeleton.tsx` | shimmer via `background-position`, disabled under reduced motion. |
| `EmptyState` | `EmptyState.tsx` | icon in a 44px `overlay` tile, title ≤24px, description ≤15ch–60ch, primary + secondary action, optional `atmosphere` prop that mounts the shader field at low intensity. |
| `ColorPicker` | `ColorPicker.tsx` | swatch grid of the system palette + native `<input type=color>` + hex field with validation + alpha-free (product chrome has no translucent fills). |
| `Badge`, `Kbd`, `Avatar` | `Badge.tsx` | badge tones `neutral\|accent\|success\|warning\|danger\|cream`; `Kbd` for shortcut display. |
| `Progress`, `Separator` | `Primitives.tsx` | thin 2–4px bars, hairline dividers. |

### 7.2 Focus

```css
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
  border-radius: inherit;
}
```

Never remove focus rings without replacing them. Focus is always visible on `canvas` and on `overlay`.

### 7.3 Interaction conventions

- **Primary action:** exactly one per panel/section. Amber fill.
- **Secondary action:** `secondary` (raised bg + hairline border).
- **Destructive:** `danger` variant, and always behind a `ConfirmDialog`.
- **Icon-only:** `IconButton` + tooltip + `aria-label`.
- **Loading:** the control keeps its width, shows a spinner, sets `aria-busy`, and blocks repeat submits.
- **Disabled:** `opacity-50` + `cursor-not-allowed` + `aria-disabled`; never rely on color alone.
- **Selected/active in nav:** never color alone — add a 2px accent bar or a filled tile.

---

## 8. The atmospheric shader

`src/components/atmosphere/AmberField.tsx` — a single WebGL canvas drawing soft flowing amber/burnt-orange light fields over charcoal, with organic noise.

**Placement:** marketing hero, editor welcome/empty canvas, onboarding, selected empty states. **Never** behind tables, forms, dense inspector panels, or the live canvas.

**Contract:**

1. `prefers-reduced-motion: reduce` → render exactly one static frame, then stop. No rAF loop ever starts.
2. Static CSS fallback (`background: radial-gradient(...)` from §2.4) is painted underneath at all times; the canvas is an *enhancement layer* only. If WebGL is unavailable, the CSS field remains and nothing breaks.
3. Paused via `IntersectionObserver` when <10% visible and via `document.visibilitychange` when the tab is hidden.
4. Runs at `devicePixelRatio` capped at 1.5, max 30fps, canvas sized by `ResizeObserver`.
5. Never mounted inside the editor's live preview iframe or the storefront renderer.
6. `aria-hidden="true"`, `pointer-events: none`.

---

## 9. Surfaces

### 9.1 Marketing (`/`)

Sections in order: **Nav → Shader hero → Headline + CTAs → Product UI preview → Features → Editor showcase → Dashboard showcase → Workflow → Integrations → Pricing → FAQ → Footer.**

- Preview imagery must be **real product UI** built from the same components (a rendered dashboard frame, a rendered editor frame) — never stock photos or abstract art.
- Section rhythm 96/64px. Max content width `1200px` (`max-w-6xl`), prose `max-w-2xl`.
- Headline: `ink` with one `cream`→amber gradient phrase.
- CTAs: primary "Start free" (amber), secondary "See the editor" (ghost with hairline).

### 9.2 Visual editor (`/dashboard/customizer`)

Three-panel application shell:

- **Top toolbar (52px):** back · project/brand · undo/redo · viewport switcher (desktop/tablet/mobile) · zoom · preview · save status · **Publish**.
- **Left sidebar (264px):** tabs `Pages · Layers · Components · Sections · Assets · Add`. Sections are reorderable (drag + keyboard `Alt+↑/↓`), toggle visibility, duplicate, delete.
- **Center canvas:** neutral `#080706` backdrop, framed viewport with selection outline (`1px accent` + 4 resize handles), zoom `fit/50/75/100/125/150%`, ruler-free, empty state uses the shader.
- **Right inspector (300px):** accordions — Content · Typography · Colors · Background · Spacing (padding/margin) · Borders & radius · Shadow · Layout · Responsive visibility · Element settings. Every control writes to the existing undo/redo store.

**Working vs placeholder:** controls bound to `StorefrontConfig`/`ThemeTokens` are working. Anything not yet wired is rendered with a `data-placeholder="true"` attribute, `fog` label, and a tooltip reading "Coming soon" — it must not look or feel enabled.

Preserve the existing engine: 50-step undo/redo, viewport state, save-draft/publish/rollback with revision-conflict handling (`EditorClient.tsx`, `actions.ts`).

### 9.3 Admin dashboard (`/dashboard/*`)

Persistent **left sidebar (240px)** + **compact top bar (56px)** + breadcrumbs + content.

Routes: Overview · Revenue · Orders · Products · Customers · Websites · Website management · Themes · Integrations · Notifications · Billing · Team · Settings.

- Charts: Recharts, **restrained amber only** — single series `#F59E0B` at 2px with an `accent → transparent` area fill; second series `#F97316` dashed. Grid lines `hairline`, axis text `fog` 11px, no default tooltips (custom dark tooltip: `overlay` bg, hairline-strong border).
- No colorful stat cards. Stat tiles are `raised` + hairline, label `ash` 12px, value `ink` 28–32px tabular, delta as `StatusIndicator`.
- Tables are the primary data surface; cards are for framing, not decoration.

---

## 10. Responsive

| Breakpoint | Marketing | Dashboard | Editor |
| --- | --- | --- | --- |
| ≥1280 | full 12-col, 96px rhythm | sidebar visible, 3-panel | 3-panel |
| 1024–1279 | 12-col, tighter gutters | sidebar icon-collapsed (64px) | 3-panel, inspector 280px |
| 768–1023 | 6-col | sidebar → drawer, tables scroll-x | left+right become drawers |
| <768 | 1-col, 64px rhythm, sheet nav | single column, FAB for primary action | canvas only + bottom sheet inspector |

- Nothing may overflow horizontally at 320px.
- All touch targets ≥40px on coarse pointers (`@media (pointer: coarse)` bumps control heights).
- Tables: horizontal scroll with a sticky first column rather than card-stacking, unless the page explicitly opts into cards.

---

## 11. Accessibility

- Semantic landmarks: `header`, `nav`, `main`, `aside`, `footer`; one `h1` per page; heading order never skips.
- All form controls have associated labels; errors are announced (`aria-live="polite"` on the toast region and form error summary).
- Dialogs/drawers trap focus and restore it to the trigger on close.
- Menus/tabs implement the ARIA keyboard patterns (roving tabindex, `Home`/`End`).
- Color is never the sole carrier of meaning — pair with icon or text.
- Contrast per §2.3. Tested at 100% zoom and 200% browser zoom.
- `prefers-reduced-motion` and `prefers-contrast` respected globally.

---

## 12. Non-negotiables (review checklist)

- [ ] No hardcoded hex where a token exists.
- [ ] No purple/blue/cyan/pink, no multi-hue gradients.
- [ ] No amber surface larger than a button or a chart area.
- [ ] No radius above 12px outside pills/avatars.
- [ ] No drop shadow on an in-flow card.
- [ ] No second typeface.
- [ ] No icon set other than lucide-react.
- [ ] No control without hover/active/focus/disabled states.
- [ ] No infinite motion in product chrome.
- [ ] No dead buttons — working or explicitly `data-placeholder`.
- [ ] Shader only where §8 permits, and only as an enhancement over the CSS fallback.
