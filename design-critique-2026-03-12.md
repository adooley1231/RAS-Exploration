# Design Critique — BrowseOrSearch (Baseline)
**Date:** 2026-03-12
**Reviewed by:** ER Design Critic
**Overall grade:** Needs Work → Getting There

---

## Summary

The prototype has strong structural bones — good destination imagery, a dark wishlist sidebar that creates one real surface moment, and a sensible two-column featured section. But the overall feel is a capable SaaS app, not a luxury travel product. The two biggest gaps are typography (no Canela display type anywhere, Inter used where Gotham would give precision) and surface rhythm (nearly every section is the same cream-white, creating a flat, airless page). There's no single editorial moment that earns a pause.

---

## Section-by-section findings

### Header
- **Status:** ⚠️ Needs attention
- **Issues found:**
  - Gold square "R" wordmark is a placeholder — reads as a generic SaaS icon, not an ER-caliber identity mark
  - "RAS Lottery" in Playfair Display at ~18px is undersized for a brand nameplate; should command more presence
  - Points/coins UI in the header feels data-heavy and transactional — could be refined to a quieter status indicator
  - Member badge ("Sarah Johnson") has no luxury treatment — just an avatar + name in gray
  - Sticky header that appears on scroll is a different layout than the resting header — confirm they match visually
- **What good looks like here:**
  - Wordmark replaced with ER logotype or a refined typographic lockup (not an icon box)
  - Brand name at 22–24px Canela 100, letterspaced, quiet and confident
  - Points displayed as a discreet status chip — tabular nums, ER gold token, no icon clutter
  - Member name in Gotham 500 small-caps at 11px — like a hotel loyalty tier badge

### Progress Stepper
- **Status:** ❌ Off-brand
- **Issues found:**
  - Reads as a checkout funnel — dark circle with number + label is standard e-commerce
  - "Add Requests / Allocate Points / Review & Submit" language is functional but not ER-toned
  - Connector lines are medium-weight — too prominent for secondary wayfinding
  - Disabled states are too gray/muted — could be more gracefully inactive
- **What good looks like here:**
  - Ultra-thin connecting line, small-caps step labels at 10px with 0.12em tracking
  - Active state uses ER gold as an underline or dot, not a filled dark circle
  - Steps feel like editorial chapter markers, not a SaaS progress bar

### Points Budget Bar
- **Status:** ⚠️ Needs attention
- **Issues found:**
  - White card on cream body — near-zero surface contrast, card barely registers
  - "POINTS BUDGET" label + large gold number is the right instinct but the execution is plain
  - Coin/coin-stack icon (gold) is an interesting choice but could feel more refined
  - "0 allocated | 20 remaining" pipe-delimited layout is developer-readable, not member-readable
- **What good looks like here:**
  - Card on a slightly deeper cream or soft warm-gray surface (#f5f3ef) so it floats
  - Points visualization as a track/meter — could be a thin horizontal bar showing used vs. remaining
  - Typography: large tabular number for the main figure, subdued label-caps for the descriptor

### Travel Window / Date Picker
- **Status:** ⚠️ Needs attention
- **Issues found:**
  - "TRAVEL WINDOW" label + date input feels like a form, not an editorial moment
  - The date picker input is a plain white rounded rectangle — generic
  - "Applies to new requests" right-aligned helper text is nearly invisible at current contrast
  - This section has no visual personality — it's utility only
- **What good looks like here:**
  - Frame this as "Your Travel Window" — slightly warmer editorial tone in the heading
  - Date input styled as a bordered horizontal strip (no white card wrapper), date range shown as two adjacent date chips when selected
  - Helper text upgraded to Gotham 400 13px in ER's muted-text token

### Featured Destinations
- **Status:** ⚠️ Needs attention
- **Issues found:**
  - Two equal-sized 16:9 cards side by side — feels like a 2-column grid, not a feature moment
  - "FEATURED" badge in `bg-gold/90` yellow-gold on image is readable but generic (pill badge format)
  - "AVAILABLE" badge on the second card undermines the featured premium feel — "Available" is a status, not a feature
  - "+ add request" text link at bottom of each card is hard to see — needs better affordance
  - Section label "FEATURED ✦" is good instinct (small-caps + icon) but the sparkle icon reads playful
  - Card corners are rounded (`rounded-xl` approx) — editorial luxury prefers sharp or very subtly rounded
- **What good looks like here:**
  - Asymmetric hero layout: one large card (~70% width, full-bleed height) with one narrower secondary card
  - Feature card gets a more cinematic gradient overlay — richer, deeper, bottom-weighted
  - Destination name at Canela 100 32–40px, location in Gotham 400 small-caps 11px
  - Remove "AVAILABLE" badge; replace "+ add request" with a more inviting CTA (e.g., "Request stay →")
  - Sharp or barely-rounded corners (2–4px max)

### All Destinations Grid
- **Status:** ⚠️ Needs attention
- **Issues found:**
  - 3-column uniform square card grid — functional but no editorial variation
  - Cards are nearly the same size as the featured cards — no visual hierarchy between sections
  - Card text (destination name + location) overlays are readable but not beautifully typeset
  - "ALL DESTINATIONS" section label is identical style to "FEATURED" — no differentiation
  - Some destination names are truncated ("Miami South Beach Pen...", "Charleston Historic Ma...") — needs resolution at this grid size
  - Rounded card corners throughout — same note as above
- **What good looks like here:**
  - Mix of card sizes: one wide card + two standard in a row, or a 2+1 masonry-like rhythm
  - Names never truncate — either resize type or allow card to be taller
  - Grid cards slightly smaller than featured section to reinforce hierarchy
  - Section label styled more quietly (Gotham 400, lighter weight) vs. "FEATURED" (Gotham 600)

### Wishlist Sidebar
- **Status:** ✅ Strong concept, ⚠️ needs refinement
- **Issues found:**
  - Dark navy sidebar is the only real surface contrast moment on the page — this is the right call, keep it
  - "Your Wishlist 0/10" header: "Your Wishlist" in serif is appropriate; the gold "0/10" counter is good
  - Empty state illustration (pin icon) is too small and the helper text is centered in a wide space awkwardly
  - The sidebar has no top-right border radius / shadow separation — merges into content area
- **What good looks like here:**
  - Empty state: larger, softer icon (perhaps a compass), text centered with more vertical breathing room, italic Playfair tone ("Your next great escape starts here")
  - Sidebar right edge: consider a subtle 1px border or slight shadow on the content-side edge
  - Progress bar (wishlist fill) on the header: add a thin gold line below the header strip to show capacity used

---

## Typography audit

| Element | Current | Should be | Severity |
|---------|---------|-----------|----------|
| Hero destination name | Playfair 400 ~20px | Canela 100 32–40px | ❌ High |
| Section labels (FEATURED, ALL DESTINATIONS) | Inter 600 small-caps ~11px | Gotham 500 small-caps 11px 0.12em tracking | ❌ High |
| Points budget number | Inter 700 ~18px | Tabular Gotham 500, 24px, ER gold | ⚠️ Medium |
| Progress step labels | Inter 500 ~13px | Gotham 400 small-caps 10px | ⚠️ Medium |
| Date picker label | Inter ~14px | Gotham 400 13px, muted token color | ⚠️ Medium |
| Header brand name | Playfair 700 ~18px | Canela 100 22px, wider tracking | ❌ High |
| Card location text (Hawaii, Colorado) | Inter 400 ~11px | Gotham 400 10px small-caps | 💬 Low |

---

## Surface audit

| Section | Current background | Should be | Severity |
|---------|--------------------|-----------|----------|
| Page body | #fafaf9 cream | Keep — correct | ✅ |
| Points budget card | White on cream | Warm gray #f5f3ef or slight border only | ⚠️ Medium |
| Featured section | Same cream as body | Introduce a very subtle warm-off-white section break | 💬 Low |
| All destinations section | Same cream as body | Dark navy section (bg-navy) to create editorial break | ❌ High |
| Travel window card | White rounded card | Borderless inset, or just the rule-above separator | ⚠️ Medium |
| Wishlist sidebar | Navy #0f172a | Keep — this is the page's best surface moment | ✅ |

---

## 💡 Design opportunities

### Opportunity 1: Dark editorial grid section
- **What I noticed:** The "All Destinations" grid has 9 destination cards on a cream background — visually flat, no drama
- **Suggestion:** Put the entire grid on a navy/dark background (`bg-navy`). White card text over dark imagery pops dramatically. The transition from cream → dark → cream creates the surface rhythm the page needs.
- **Reference:** ER's own collection pages use alternating dark sections for browse grids
- **Effort:** Low (background color change + adjust text colors)

### Opportunity 2: Asymmetric featured hero
- **What I noticed:** Two 50/50 hero cards — editorial opportunity being left on the table
- **Suggestion:** One dominant card at ~65% width, one secondary at ~35%. The primary card gets a cinematic full-height gradient treatment and the destination name at 40px Canela 100. The secondary card is smaller, quieter.
- **Reference:** Rosewood hotel homepage room grid — one feature room dominates, others support
- **Effort:** Medium (layout change in BrowseOrSearch.tsx HeroCard section)

### Opportunity 3: Wishlist sidebar — editorial empty state
- **What I noticed:** Empty sidebar has a tiny pin icon and generic helper text — low investment for a high-value moment
- **Suggestion:** "Your next escape begins here" in italic Playfair 400 at 16px, with a subtle destination silhouette illustration or just generous whitespace. The sidebar is navy — it can absorb a more atmospheric treatment.
- **Effort:** Low (copy + typography change)

### Opportunity 4: Progress stepper → chapter markers
- **What I noticed:** Checkout-funnel styling breaks the luxury tone immediately — it's the second element the eye hits after the header
- **Suggestion:** Replace filled circle with gold dot/dash markers. Step labels in Gotham 400 small-caps. Make it read like act markers in a theater program.
- **Effort:** Low-medium (CSS only)

---

## Recommended change order

1. **Apply ER font tokens** — Canela for display, Gotham for functional (highest impact, affects everything)
2. **Dark section for destinations grid** — single background color change, enormous visual impact
3. **Featured hero: asymmetric layout** — one large, one small card
4. **Progress stepper: luxury marker treatment** — remove checkout-funnel feel
5. **Surface differentiation** — points budget card, travel window section
6. **Header refinements** — brand name typography, points display, member badge
7. **Card corners: sharpen** — 2–4px max across all destination cards
8. **Wishlist empty state** — italic editorial copy, more atmosphere

---

## What NOT to change

- The dark navy wishlist sidebar — the right call, keep the concept
- The `.label-caps` small-caps pattern on section headings — correct direction, just needs font/weight refinement
- Destination imagery — strong photography throughout, no replacements needed
- The gold coin icon pattern in the points area — interesting, just needs refinement
- The grain texture overlay on `body::before` — subtle and correct for luxury
- The `panel-enter` slide-up animation for the mini panel — felt smooth and premium
- The `ultra-shimmer` animation on the Ultra ribbon — keep, refine execution
