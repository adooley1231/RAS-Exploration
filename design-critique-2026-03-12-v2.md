# Design Critique — Full Flow Pass (Post-ER Token Retrofit)
**Date:** 2026-03-12
**Reviewed by:** ER Design Critic
**Overall grade:** Close

---

## Summary

The ER token system is now reading clearly across all four views — Cormorant Garamond 300 headings, the light/dark surface rhythm on BrowseOrSearch, the editorial rank strip on request cards, and the Compass empty state are all working at the level you'd expect in a real product review. The weakest view is PointsAllocation, which never breaks out of flat white surfaces — it could use one strong moment to match the drama of the other screens. The biggest single opportunity is the gap between "functional-correct" and "stops you scrolling" — a few targeted moments could take this from a polished prototype to something you'd show in a pitch.

---

## Section-by-section findings

### Header & Navigation
- **Status:** ✅ Strong
- **Working well:**
  - "R" in square border + Cormorant 300 brand name is restrained and right
  - "Q2 2025 · VACATION REQUESTS" in label-caps sits quietly below — correct hierarchy
  - Points preview (20 available | 0 allocated | 20 remaining) is unobtrusive
  - Progress indicator: editorial square markers instead of filled circles is a meaningful upgrade — now reads like a magazine pagination indicator, not a checkout funnel

### BrowseOrSearch — Featured Section
- **Status:** ✅ Strong
- **Working well:**
  - Asymmetric 63/37 featured hero is the best editorial moment in the app — exactly right
  - Cormorant Garamond 300 at 1.875rem on the primary card has real presence
  - Cinematic gradient overlay, sharp corners, "Request stay →" replacing "+ add" — all correct
  - Wishlist sidebar: Compass icon + italic serif "Your next great escape begins here." is warm and brand-correct
- **Minor attention:**
  - The "FEATURED" label sits close to the points bank card — the vertical rhythm between those two sections could use 4–8px more breathing room

### BrowseOrSearch — Travel Dates Section
- **Status:** ⚠️ Needs attention
- **Issues found:**
  - The date picker card is the most utilitarian element on the page — white box, "Select check-in and check-out dates" in plain text, no visual warmth
  - "TRAVEL WINDOW" label is correct, "Applies to new requests" subtitle is fine — but the card itself has no texture
- **What good looks like here:**
  - A very subtle warm stone (`--er-gray-50`) background instead of white, plus the "Stays must be 2–14 nights" helper in label-caps at the bottom

### BrowseOrSearch — Dark Destinations Section
- **Status:** ✅ Strong
- **Working well:**
  - Navy surface breaking the cream/white rhythm is the most important design decision on the page — it's working
  - "ALL DESTINATIONS" in white label-caps with low opacity reads correctly as a section header on dark
  - 3-column grid of destination cards with image and text overlay is clean and editorial

### PointsAllocation
- **Status:** ⚠️ Needs attention
- **Issues found:**
  - Every surface on this page is white/light gray — there is no rhythm break, no dark moment, no editorial punch
  - The heading "Allocate Your Points" in Cormorant 300 is the strongest moment, but the page immediately goes flat: white card, white card, white card
  - The "Maximum Possible Wins" stat card is good conceptually but feels like an afterthought — a large lone number on a white rectangle
  - With only one request, the card list looks sparse. This is a data problem more than a design problem, but it exposes that the cards don't have visual weight on their own
- **What good looks like here:**
  - The "Maximum Possible Wins" stat could have a dark treatment — slate-800 background, gold number, white label — making it a feature moment rather than a utility card
  - Even a subtle cream (`--er-stone-50` or similar) background on the page container (vs pure white cards) would create a surface distinction

### ReviewSubmit
- **Status:** ✅ Strong
- **Working well:**
  - "Review & Submit" heading in Cormorant 300 is elevated and correct for the "moment of truth" screen
  - Navy rank strip (left column on request cards) is exactly right — strong concept, well-executed
  - The sidebar Summary is clean: Cormorant heading, square stepper buttons, label-caps lottery date section
  - Gold "Submit to Lottery" CTA has appropriate weight for the primary action
- **Minor attention:**
  - In the points allocation bars, destination names truncate with ellipsis ("Maui Oceanfront Vil…") — the width of the name column (w-32) is too narrow for longer names. Could expand to `w-40` or use a `min-width` approach.
  - The "0 pts" display in the allocation bar is using `color: var(--color-gold-dark)` which looks correct on win but odd when the value is literally 0. Consider using `--er-gray-400` when value is 0.

### ResultsDashboard & ResultCard
- **Status:** ✅ Strong
- **Working well:**
  - Square gold icon for wins banner (not a circle!) is an important detail — it's editorial
  - Cormorant 300 on destination name over image overlay at 1.625rem is genuinely beautiful
  - Grayscale + brightness reduction on losing destination images is effective and proportionate
  - "Not Selected" heading in muted gray (`--er-gray-400`) vs "Your Wins" in slate — the typographic hierarchy communicates outcome without needing color-coded alerts
  - Italic serif "This destination was not available for your requested dates." on loss cards — warmer than the original "Better luck next quarter!"
  - Accept/Decline buttons: outlined Decline + teal Accept is the right visual weight pairing
  - Compass icon replacing Frown on no-wins state is more on-brand
- **Minor attention:**
  - The no-wins empty state — the italic serif line "Your next great escape is still ahead of you." is good but the surrounding layout is slightly tight. The Compass icon sits in a square box with very low contrast (gray-50 fill, gray-100 border) — it nearly disappears. Could try `rgba(201,169,110,0.08)` background with a thin gold border to give it more presence.

---

## Typography audit

| Element | Current | Should be | Severity |
|---------|---------|-----------|----------|
| All page headings | Cormorant Garamond 300 | ✅ Correct | ✅ |
| Body/UI text | DM Sans 400–500 | ✅ Correct | ✅ |
| Progress labels | label-caps DM Sans | ✅ Correct | ✅ |
| Destination name (featured hero) | Cormorant 300 1.875rem | ✅ Correct | ✅ |
| Section labels (dark bg) | label-caps 0.11rem, 0.12em tracking | ✅ Correct | ✅ |
| Rank strip (#1, pts) | DM Sans tabular | ✅ Correct | ✅ |
| Nav labels (header) | DM Sans 400 small-caps | ✅ Correct | ✅ |
| Allocation bar names | DM Sans 0.8125rem | Truncating — width | ⚠️ Medium |

---

## Surface audit

| Section | Current background | Should be | Severity |
|---------|--------------------|-----------|----------|
| BrowseOrSearch | cream + dark navy section | ✅ Strong rhythm | ✅ |
| PointsAllocation | all white/light-gray | Needs 1 dark or stone moment | ⚠️ Medium |
| ReviewSubmit | cream page + white cards | ✅ Acceptable | ✅ |
| ResultsDashboard | cream page + white cards | ✅ Acceptable | ✅ |
| No-wins empty state icon | gray-50 fill (barely visible) | rgba(gold, 0.08) with gold border | 💬 Low |

---

## 💡 Design opportunities

### Opportunity 1: PointsAllocation dark feature card for Max Wins
- **What I noticed:** The "Maximum Possible Wins This Quarter" card is currently a white rectangle with a large number — it reads as a utility readout, not a moment
- **Suggestion:** Give it a dark slate-800 background with white label-caps, gold tabular number, and if Ultra member, the gold gradient badge — make it feel like a scoreboard
- **Reference:** The ResultsDashboard wins banner (gold icon, stat on white) — same energy, but for this card go darker
- **Effort:** Low (style change on one component block)

### Opportunity 2: No-wins icon presence
- **What I noticed:** The Compass icon on the no-wins empty state lives in a nearly invisible gray-50 box
- **Suggestion:** Change to `rgba(201,169,110,0.08)` fill with `1px solid rgba(201,169,110,0.2)` border — a faint gold halo, connecting it to the brand and the "next adventure" message
- **Effort:** Very low (2 style changes)

### Opportunity 3: Destination name overflow in allocation bars
- **What I noticed:** Names like "Maui Oceanfront Vil…" truncate in the ReviewSubmit points bars
- **Suggestion:** Change name column from `w-32` to `w-40` or use `flex-1 min-w-0` on the label, `flex-shrink-0 w-28` on the right pts value
- **Effort:** Very low (one className change)

### Opportunity 4: Travel Dates section warmth
- **What I noticed:** The date picker card on BrowseOrSearch is visually colder than everything around it
- **Suggestion:** Set `background: var(--er-gray-50)` on the date picker card (instead of white), giving it a very slight warmth distinction from the featured section below
- **Effort:** Very low

---

## Recommended change order
1. PointsAllocation Max Wins card → dark slate treatment (highest visual impact)
2. Allocation bar name truncation fix (functional + polish)
3. No-wins Compass icon → faint gold halo background
4. Travel Dates card → `--er-gray-50` background
5. Points allocation bar: zero-value color → `--er-gray-400`

---

## What NOT to change

- **BrowseOrSearch featured hero** — the asymmetric 63/37 split and card overlay typography are exactly right, do not touch
- **Dark navy section for All Destinations** — the surface rhythm break is the most important layout decision in the whole app
- **Wishlist empty state** — Compass icon + italic serif is warm and brand-correct
- **Progress indicator** — square editorial markers are a strong departure from the checkout-funnel baseline
- **Navy rank strip on request cards** — strong concept, well-executed across PointsAllocation and ReviewSubmit
- **ResultCard grayscale treatment** — the visual outcome communication (full color = win, grayscale = loss) is clear and proportionate
- **All Cormorant Garamond headings** — the weight and scale are now consistent across all four views
