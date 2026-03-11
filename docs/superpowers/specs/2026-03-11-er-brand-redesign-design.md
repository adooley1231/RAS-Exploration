# RAS → ER Brand Redesign

**Date:** 2026-03-11
**Project:** RAS Vacation Lottery Prototype
**Scope:** Full redesign across all 4 views, aligning to Exclusive Resorts brand system
**Approach:** Critic-driven iterative (Approach A)

---

## Goal

Migrate the RAS Lottery prototype from its current custom luxury palette to the canonical Exclusive Resorts (ER) design system, and redesign all four views to genuinely reflect ER's editorial, luxury aesthetic — not just swapping tokens but rethinking layout, hierarchy, and composition wherever needed.

Design standard: **the last 1% is 99% of the work.** Micro-spacing, typographic refinement, hover states, and transition timing are not finishing touches — they are the work.

---

## Scope

### In scope
- ER design token migration (colors, typography, spacing) applied to `index.css` and all components
- Layout & composition redesign per view, guided by critic findings
- Typography hierarchy and editorial moments
- Component-level polish: cards, buttons, badges, inputs
- Shared components: Header, ProgressIndicator, DestinationCard
- Cross-view consistency check after all views are complete

### Out of scope
- Functionality or logic changes
- New features or views
- Routing or state management changes

---

## Architecture

No structural changes to the component tree. The work is entirely in styles, layout, and visual composition. The token system lives in `src/index.css` (Tailwind v4 `@theme` block) with component-level overrides inline via Tailwind classes.

---

## Phase Plan

### Phase 1 — Baseline & Token Foundation

1. **Start dev server** — `vite` on `localhost:5173`
2. **Run `er-design-critic` (baseline)** — screenshot the live app, evaluate against ER quality standard, produce structured markdown critique with severity-ranked findings
3. **Apply ER design system tokens globally** — update `src/index.css` `@theme` block with official ER CSS primitives, Theme, Mode, and Custom tokens; replace current navy/gold/cream palette with canonical ER token stack

### Phase 2 — View-by-View Redesign

For each view: **redesign → re-run er-design-critic → fix findings → pass critic → move on**

| View | Key Design Challenge |
|------|---------------------|
| BrowseOrSearch | Destination grid, hero cards, wishlist sidebar, date bar. Highest visual impact — sets the editorial tone. |
| PointsAllocation | Drag-and-drop ranking + points slider. Data-dense; luxury treatment without losing clarity. |
| ReviewSubmit | "Moment of truth" feel — high trust, confident typography, elevated submission experience. |
| ResultsDashboard | Win/loss outcomes. Celebratory for wins; graceful and warm for losses. |

### Phase 3 — Cross-view Consistency

After all 4 views pass the critic individually:
- Shared components audit (Header, ProgressIndicator, DestinationCard)
- Spacing rhythm consistency across views
- Token usage consistency check

---

## Quality Gates

Each view must pass `er-design-critic` before moving to the next. The critic evaluates against the ER quality standard — findings are ranked by severity and must be resolved before sign-off.

---

## Success Criteria

- All four views pass `er-design-critic` with no high-severity findings
- ER design system tokens used throughout (no hardcoded hex values outside the token file)
- Every component feels like it belongs in an Exclusive Resorts product
- The last 1% is not skipped
