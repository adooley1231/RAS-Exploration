# RAS ER Brand Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fully redesign the RAS Lottery prototype across all 4 views to align with the Exclusive Resorts brand system — tokens, typography, layout, and last-1% polish.

**Architecture:** No structural changes. All work is in styles, layout, and visual composition. Token system lives in `src/index.css` (`@theme` block). Component-level styles via Tailwind classes inline. Each view is redesigned independently with an `er-design-critic` quality gate before moving on.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, Vite, lucide-react, @dnd-kit

**Design principle:** The last 1% is 99% of the work. Do not stop at "good enough."

---

## Chunk 1: Setup & Baseline

### Task 1: Start the dev server

**Files:**
- No file changes — dev server only

- [ ] **Step 1: Start Vite dev server in background**

```bash
cd "/Users/annadooley/RAS-exploration 2" && npm run dev &
```

Wait a few seconds, then verify:

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:5173
```

Expected: `200`

- [ ] **Step 2: Confirm the app renders in browser**

Open `http://localhost:5173` — should show the RAS Lottery app on the BrowseOrSearch view.

---

### Task 2: Run er-design-critic baseline

**Files:**
- Output: `er-design-critic` writes a critique markdown file

- [ ] **Step 1: Invoke er-design-critic skill**

```
@er-design-critic
```

This skill screenshots `http://localhost:5173`, evaluates the full app against the ER quality standard, and writes a structured markdown critique with severity-ranked findings.

- [ ] **Step 2: Read the critique**

Note all HIGH and MEDIUM severity findings — these drive the redesign priorities in later tasks. Write them to a scratch file (e.g., `docs/superpowers/critique-baseline.md`) so they're available when redesigning each view.

- [ ] **Step 3: Commit baseline critique**

```bash
git add -A && git commit -m "chore: add ER design baseline critique"
```

---

### Task 3: Apply ER design system tokens globally

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Invoke er-design-system skill**

```
@er-design-system
```

This skill knows the full ER token stack (ER_CSS primitives, Theme, Mode, Custom). It will update `src/index.css` `@theme` block with canonical ER tokens, replacing the current custom navy/gold/cream palette.

- [ ] **Step 2: Verify the app still compiles and renders**

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:5173
```

Expected: `200`. Open browser and confirm no visual breakage (layout intact, no missing colors).

- [ ] **Step 3: Commit**

```bash
git add src/index.css && git commit -m "feat: apply ER design system tokens globally"
```

---

## Chunk 2: Shared Foundation (Header + shared components)

These components appear on every view — getting them right first means every subsequent view inherits the correct foundation.

### Task 4: Redesign Header and ProgressIndicator

**Files:**
- Modify: `src/components/layout/Header.tsx`
- Modify: `src/components/shared/ProgressIndicator.tsx`

- [ ] **Step 1: Invoke design-inspiration skill before starting**

```
@design-inspiration
```

Read the inspiration output and extract relevant design language for header/navigation patterns.

- [ ] **Step 2: Redesign `Header.tsx`**

Apply ER brand to the header. Key things to address (pulled from the baseline critique):
- Logo treatment: replace gold-gradient "R" square with ER wordmark or editorial treatment
- Typography: ensure header uses correct ER typefaces at correct weights
- Member badge: refine to feel distinctly ER — ultra badge in particular needs luxury treatment
- Points preview: align to ER token colors
- Spacing and height: should feel editorial, not like a generic SaaS nav
- Sticky behavior: ensure shadow/border is subtle, not harsh

- [ ] **Step 3: Redesign `ProgressIndicator.tsx`**

The progress stepper sits below the header on every view:
- Step labels should use ER typography (small caps, letter-spacing)
- Active/complete/inactive states should use ER token colors, not slate/gold custom
- Line connectors: thin, quiet — this is secondary wayfinding
- Should feel like a high-end travel app, not a checkout funnel

- [ ] **Step 4: Visual check**

Navigate to `http://localhost:5173` and inspect header + progress bar. Check:
- [ ] Fonts load correctly
- [ ] Colors match ER token palette
- [ ] Spacing feels intentional
- [ ] Mobile layout (resize to 375px) is clean

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/Header.tsx src/components/shared/ProgressIndicator.tsx
git commit -m "feat: redesign Header and ProgressIndicator with ER tokens"
```

---

### Task 5: Redesign shared components

**Files:**
- Modify: `src/components/shared/DestinationCard.tsx`
- Modify: `src/components/shared/PointsBank.tsx`
- Modify: `src/components/shared/ARTokenTracker.tsx`
- Modify: `src/components/shared/BoostIndicator.tsx`
- Modify: `src/components/shared/CountdownTimer.tsx`

- [ ] **Step 1: Redesign `DestinationCard.tsx`**

This card is used across multiple views. Key considerations:
- Image gradient overlay: ER aesthetic uses richer, more cinematic gradients
- Typography on image: destination name should feel editorial — Playfair weight and size should be reconsidered
- Location tag: subtle, precise — MapPin + region text
- Card shadow: use ER token shadow values
- Hover state: lift should feel premium, not just `translateY(-2px)`
- Variant handling (`compact`, `full`, `result`) must all be ER-quality

- [ ] **Step 2: Redesign `PointsBank.tsx`**

Read the current file first, then:
- Points visualization should feel like a premium gauge or status indicator
- Colors must use ER tokens (no hardcoded hex)
- Compact variant used in header needs careful spacing
- Progress/remaining states should be visually distinct without being loud

- [ ] **Step 3: Redesign `ARTokenTracker.tsx` and `BoostIndicator.tsx`**

Read both files first, then:
- AR token tracker: luxury data display — tabular nums, ER gold treatment
- Boost indicator: subtle badge treatment; should not feel like a gamification element

- [ ] **Step 4: Visual check across views**

Navigate through BrowseOrSearch, PointsAllocation, ReviewSubmit to check shared components appear consistently.

- [ ] **Step 5: Commit**

```bash
git add src/components/shared/
git commit -m "feat: redesign shared components with ER brand"
```

---

## Chunk 3: BrowseOrSearch Redesign

### Task 6: Redesign BrowseOrSearch view

**Files:**
- Modify: `src/components/BrowseOrSearch/BrowseOrSearch.tsx`
- Modify: `src/components/BrowseOrSearch/DestinationMiniPanel.tsx`
- Modify: `src/components/BrowseOrSearch/EditRequestModal.tsx`

- [ ] **Step 1: Invoke design-inspiration skill**

```
@design-inspiration
```

Focus the inspiration read on destination grids, editorial card layouts, wishlist/sidebar patterns for luxury travel.

- [ ] **Step 2: Redesign `BrowseOrSearch.tsx` — destination grid and section headers**

This is the highest-impact view. Work through each section:

**Section headings (`SectionHeading` sub-component):**
- Label caps with gold accent line — currently good structure, refine the gold gradient divider
- "Featured" / "All destinations" labels should use ER small-caps treatment

**Hero cards (`HeroCard` sub-component):**
- 16:9 aspect ratio with cinematic gradient — good bones, polish the gradient depth
- Featured badge: ER uses very restrained badge styling — reconsider `bg-gold/90` for something more editorial
- Name typography: size, weight, tracking all need ER-level precision
- "+ add request" affordance: this is a key interaction — it should feel inviting, not like a button label

**Standard destination cards (`DestinationCard` in BrowseOrSearch):**
- Square aspect ratio — check whether this feels right for portrait-format destination imagery
- Scale-110 on hover may be too aggressive — recalibrate to ER's cinematic feel

**Date bar:**
- "Travel window" section: the rule + label pattern is good, refine execution
- DateRangePicker container: should feel integrated, not like a form widget
- `bg-white rounded-2xl` card — ensure shadow and border are ER-token values

**Ultra ribbon:**
- `ultra-shimmer gold-gradient` — keep the shimmer, make it feel more refined
- Crown icon + text: balance between status communication and luxury understatement

- [ ] **Step 3: Redesign `BrowseOrSearch.tsx` — wishlist sidebar**

**Dark sidebar header:**
- Navy background with gold progress bar — solid concept, refine execution
- "Your Wishlist" title: serif, but check size and weight in context
- Request counter: gold tabular nums — ensure ER-token gold value

**Request list items (`RequestListItem` sub-component):**
- Thumbnail with rank overlay: `w-12 h-12` thumbnail — consider whether this size communicates the destination's beauty
- Date text at `text-[11px]` — confirm this is legible and still looks intentional at ER scale
- Edit/remove actions: hover-reveal pattern is good, ensure icon size and spacing feel precise
- Flexible dates in gold — ER-appropriate, keep

**Continue button:**
- `gold-gradient text-white rounded-xl` — apply ER button token treatment
- Arrow icon position and spacing

- [ ] **Step 4: Redesign `DestinationMiniPanel.tsx`**

Read the file first, then:
- This panel slides up when a destination is selected — `panel-enter` animation
- Panel positioning, shadow, border — all need ER token treatment
- Date picker within panel: compact form elements need luxury feel
- "Add to wishlist" / "Advanced options" CTAs: button hierarchy must be clear

- [ ] **Step 5: Redesign `EditRequestModal.tsx`**

Read the file first, then:
- Modal overlay: `bg-black/50` — confirm this opacity feels right
- Modal container: rounded, shadow, ER-token border
- Form elements within: all should use ER design tokens
- Close button and header: ER editorial treatment

- [ ] **Step 6: Visual check**

Navigate `http://localhost:5173`:
- [ ] BrowseOrSearch grid loads and looks editorial
- [ ] Click a destination — mini panel animates in correctly
- [ ] Wishlist sidebar shows items correctly
- [ ] Mobile: resize to 375px, confirm layout stacks cleanly

- [ ] **Step 7: Commit**

```bash
git add src/components/BrowseOrSearch/
git commit -m "feat: redesign BrowseOrSearch view with ER brand"
```

---

### Task 7: Run er-design-critic on BrowseOrSearch

- [ ] **Step 1: Invoke er-design-critic**

```
@er-design-critic
```

- [ ] **Step 2: Review findings**

Work through each HIGH finding immediately. MEDIUM findings that affect visual quality (typography, spacing, hierarchy) must also be resolved. LOW findings are optional but encouraged — remember, the last 1% matters.

- [ ] **Step 3: Fix findings iteratively**

For each issue: edit the relevant file → verify in browser → move to next.

- [ ] **Step 4: Re-run er-design-critic until clean**

```
@er-design-critic
```

Repeat until no HIGH or MEDIUM findings remain.

- [ ] **Step 5: Commit**

```bash
git add src/components/BrowseOrSearch/ && git commit -m "fix: BrowseOrSearch ER critic pass"
```

---

## Chunk 4: PointsAllocation Redesign

### Task 8: Redesign PointsAllocation view

**Files:**
- Modify: `src/components/PointsAllocation/PointsAllocation.tsx`
- Modify: `src/components/PointsAllocation/SortablePointsCard.tsx`

- [ ] **Step 1: Invoke design-inspiration skill**

```
@design-inspiration
```

Focus on data-dense luxury UI, allocation interfaces, drag-and-drop list patterns.

- [ ] **Step 2: Redesign `PointsAllocation.tsx`**

**Page header:**
- "Allocate Your Points" — serif h2, check size/weight vs ER typescale
- Instructional text: tone and typography should feel like ER member communication, not SaaS microcopy

**Strategy tip banner:**
- `bg-gold/10 rounded-xl` — apply ER token, refine border treatment
- Info icon + dismiss: subtle, not urgent — ER members are savvy

**Quick allocation tools:**
- Four strategy buttons (Prioritize Top 3, Even Split, All-in, Safe Spread)
- Currently `bg-slate-100` buttons — these need ER treatment: could be outlined, ghost, or small pill buttons
- Consider whether "quick allocation" deserves a more editorial framing

**Max wins stat block:**
- `bg-white rounded-xl card-shadow` — ER token shadow
- "Maximum possible wins" stat: this is meaningful data, present it with appropriate weight
- Ultra badge here: refine from current `gold-gradient rounded-full`

**Duplicate destinations warning:**
- `bg-amber/10` — ER token amber, refine border

**Navigation buttons:**
- Back + Continue CTA pair: apply ER button token treatment
- CTA should feel like the premium action it is

- [ ] **Step 3: Redesign `SortablePointsCard.tsx`**

Read the file first, then:
- This is the core interaction unit — draggable card with points slider
- Drag handle: subtle but discoverable
- Rank number treatment: should feel like editorial numbering, not a chip
- Destination thumbnail: small but must still look beautiful
- Points slider: this is the most important interactive element — it needs ER-level craft
  - Track, thumb, fill: all using ER tokens
  - Current value display: tabular nums, gold treatment
  - Min/max labels: label-caps treatment
- Limit-to-one-win toggle: should be understated
- Move up/down arrow controls (keyboard alternative to drag): precise icon sizing

- [ ] **Step 4: Visual check**

Navigate to PointsAllocation view (add a destination first if needed):
- [ ] Cards render with drag handles
- [ ] Points slider is interactive and looks polished
- [ ] Quick allocation buttons work visually
- [ ] Drag to reorder works and looks clean

- [ ] **Step 5: Commit**

```bash
git add src/components/PointsAllocation/
git commit -m "feat: redesign PointsAllocation view with ER brand"
```

---

### Task 9: Run er-design-critic on PointsAllocation

- [ ] **Step 1: Navigate to PointsAllocation**

The critic needs to screenshot this specific view. Navigate to it in the browser before running. Make sure at least one destination has been added to the wishlist (use the Settings icon to reset to a scenario with requests if needed).

- [ ] **Step 2: Invoke er-design-critic**

```
@er-design-critic
```

- [ ] **Step 3: Fix all HIGH and MEDIUM findings**

- [ ] **Step 4: Re-run until clean**

```
@er-design-critic
```

- [ ] **Step 5: Commit**

```bash
git add src/components/PointsAllocation/ && git commit -m "fix: PointsAllocation ER critic pass"
```

---

## Chunk 5: ReviewSubmit Redesign

### Task 10: Redesign ReviewSubmit view

**Files:**
- Modify: `src/components/ReviewSubmit/ReviewSubmit.tsx`

- [ ] **Step 1: Invoke design-inspiration skill**

```
@design-inspiration
```

Focus on confirmation/review screens, luxury checkout moments, trust-building UI.

- [ ] **Step 2: Redesign the main review layout**

**Page header:**
- "Review & Submit" — this is the moment of truth. Typography should be elevated.

**Points allocation summary:**
- Bar chart of allocations: gold-gradient bars — ER treatment, consider if the visual weight is right
- "Points allocated" stat: tabular nums, hierarchy
- Top-priority call-out: `text-navy-light` — confirm ER token value

**Request cards:**
- Left column: rank number + points — dark navy strip with white text and gold pts
  - This treatment is strong; refine proportions and spacing
- Image strip: `w-28 h-32` — confirm aspect ratio feels editorial
- Content area: destination name (serif), region (MapPin), date chips
  - Flexibility badges: `bg-slate-100` → ER token surface color
- BoostIndicator in top-right: must be refined from shared component work

**Confirmation modal:**
- `bg-black/50` overlay + `bg-white rounded-2xl` container
- AlertCircle icon in `bg-gold/10` circle — ER treatment
- Stats recap: clean table layout with ER tokens
- Cancel + Confirm button pair: hierarchy matters here

**Submission success state (`isSubmitted`):**
- CheckCircle in `bg-teal/10` circle — ER token teal
- Success headline + body copy: tone should feel warm, celebratory but understated
- Action buttons: "View Demo Results" (primary) + "Start Over" (secondary)

- [ ] **Step 3: Redesign summary sidebar**

**"How many wins?" section:**
- Trophy icon + heading: understated luxury
- +/- stepper: `w-10 h-10 rounded-full` buttons with navy text — refine
- Large wins number (`text-4xl font-bold`): this is a key moment, consider whether it needs more visual weight
- Info hint for 1-token state: `bg-gold/10 rounded-lg` → ER token

**Stats rows:**
- Clean divider lines: ER token border color
- Label/value pairs: precise spacing

**Lottery date block:**
- `bg-slate-50 rounded-lg` — ER token surface
- Clock icon + date: editorial treatment

**Submit CTA:**
- `gold-gradient rounded-xl` — apply ER primary button token
- Send icon: confirm size and alignment

- [ ] **Step 4: Visual check**

Navigate to ReviewSubmit:
- [ ] Points bars render
- [ ] Request cards look editorial
- [ ] Sidebar floats correctly
- [ ] Modal opens and looks premium

- [ ] **Step 5: Commit**

```bash
git add src/components/ReviewSubmit/ReviewSubmit.tsx
git commit -m "feat: redesign ReviewSubmit view with ER brand"
```

---

### Task 11: Run er-design-critic on ReviewSubmit

- [ ] **Step 1: Navigate to ReviewSubmit and invoke critic**

```
@er-design-critic
```

- [ ] **Step 2: Fix all HIGH and MEDIUM findings**

Pay particular attention to the submission CTA and modal — these are conversion-critical moments.

- [ ] **Step 3: Re-run until clean**

```
@er-design-critic
```

- [ ] **Step 4: Commit**

```bash
git add src/components/ReviewSubmit/ && git commit -m "fix: ReviewSubmit ER critic pass"
```

---

## Chunk 6: ResultsDashboard Redesign + Final Pass

### Task 12: Redesign ResultsDashboard view

**Files:**
- Modify: `src/components/ResultsDashboard/ResultsDashboard.tsx`
- Modify: `src/components/ResultsDashboard/ResultCard.tsx`

- [ ] **Step 1: Invoke design-inspiration skill**

```
@design-inspiration
```

Focus on results/outcome screens, win announcement UI, graceful empty states, luxury confirmation design.

- [ ] **Step 2: Redesign `ResultsDashboard.tsx`**

This view has two distinct emotional states — wins and no-wins. Each needs its own design treatment.

**Summary banner:**
- Trophy + wins count: for winners, this should feel celebratory without being garish
- Pending/confirmed stat blocks: clean dividers, ER token colors for amber (pending) and teal (confirmed)

**No-wins state:**
- `Frown` icon in slate circle: consider whether this is the right emotional register for an ER product
  - Suggestion: a more graceful icon (perhaps a compass or calendar) with warm, empathetic copy
- Secondary lottery callout: `bg-gold/10 rounded-xl` → ER token; Gift icon + copy should feel supportive, not consolation-prize

**Wins section heading:**
- "Your Wins ({n})" with Trophy + gold: editorial serif treatment
- Grid: `md:grid-cols-2 gap-6` — consider whether a more dramatic layout suits wins

**Losses section:**
- "Not Selected ({n})" heading in `text-slate-400`: quietly muted, appropriate
- Should feel gracefully understated, not clinically cold

**Action buttons:**
- "Start New Session" + "Try Request Flow Again"
- Secondary/primary hierarchy using ER button tokens

- [ ] **Step 3: Redesign `ResultCard.tsx`**

Read the file first, then:
- Won vs lost states need visually distinct but balanced treatments
- Won: gold or celebratory accent, accept/decline CTAs prominent
- Lost: muted, graceful — no harsh indicators
- Destination image treatment: cinematic, beautiful — the card should make you want to go there even if you didn't win
- Accept/decline button pair: these are the most important CTAs on the entire page

- [ ] **Step 4: Visual check (both scenarios)**

Use the demo scenario switcher (Settings icon, top right):
- [ ] Switch to "Results (Mix)" — check wins + losses layout
- [ ] Switch to "Results (No Wins)" — check empty/graceful state
- [ ] Accept/decline a win and confirm state change looks correct

- [ ] **Step 5: Commit**

```bash
git add src/components/ResultsDashboard/
git commit -m "feat: redesign ResultsDashboard view with ER brand"
```

---

### Task 13: Run er-design-critic on ResultsDashboard

- [ ] **Step 1: Switch to "Results (Mix)" scenario and invoke critic**

```
@er-design-critic
```

- [ ] **Step 2: Fix HIGH and MEDIUM findings**

- [ ] **Step 3: Switch to "Results (No Wins)" and invoke critic again**

```
@er-design-critic
```

Check the no-wins empty state specifically.

- [ ] **Step 4: Re-run until both states pass**

- [ ] **Step 5: Commit**

```bash
git add src/components/ResultsDashboard/ && git commit -m "fix: ResultsDashboard ER critic pass"
```

---

### Task 14: Final cross-view consistency check

**Files:** Any files with inconsistencies found

- [ ] **Step 1: Navigate all 4 views end-to-end**

BrowseOrSearch → PointsAllocation → ReviewSubmit → ResultsDashboard. Check:
- [ ] Spacing rhythm feels consistent across views (`py-8`, `max-w` containers)
- [ ] Typography scale is consistent (h2 page titles, body text, labels)
- [ ] Button styles are consistent (primary CTA uses the canonical ER primary button token throughout, secondary always uses the outlined/ghost treatment)
- [ ] Gold token is used consistently (same shade everywhere)
- [ ] Card shadows are consistent
- [ ] No hardcoded hex values remaining (all should be ER CSS custom properties)

- [ ] **Step 2: Invoke visual-qa skill for pixel-perfect pass**

```
@visual-qa
```

- [ ] **Step 3: Fix any remaining inconsistencies**

- [ ] **Step 4: Invoke er-design-critic for final full-app pass**

```
@er-design-critic
```

This is the final gate. No HIGH or MEDIUM findings should remain across any view.

- [ ] **Step 5: Final commit**

```bash
git add -A && git commit -m "feat: complete ER brand redesign — all views pass design critic"
```

---

## Summary

| Phase | Views | Gate |
|-------|-------|------|
| Chunk 1 | Setup + tokens | Dev server up, baseline critique captured |
| Chunk 2 | Shared foundation | Shared components on-brand |
| Chunk 3 | BrowseOrSearch | er-design-critic pass |
| Chunk 4 | PointsAllocation | er-design-critic pass |
| Chunk 5 | ReviewSubmit | er-design-critic pass |
| Chunk 6 | ResultsDashboard + final | er-design-critic pass, cross-view consistency |

**Done when:** All 4 views pass `er-design-critic` with no HIGH or MEDIUM findings, visual-qa confirms cross-view consistency, and no hardcoded tokens remain.
