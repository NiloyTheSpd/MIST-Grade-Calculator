---
version: alpha
name: Ink Ledger — Frame (video / frame layer)
description: >
  The frame layer for the MIST Grade Calculator launch film. Remixed onto the site's own
  dark-navy design system as it stands after the rebuild: the deep navy ground (#050A30),
  the raised navy surface (#0D1550), one lime signal (#C8E91C) used once per frame, the
  ruled ledger lines, Saira Condensed 800 for display, Figtree for sentences, and JetBrains
  Mono for every figure. The unit is the frame (1920×1080). Atoms are identical and sacred.
  Motion is out of scope.
unit: the frame — 1920×1080 primary; 9:16 and 1:1 documented
principle: atoms are sacred · composition is free · numbers come from the site

colors:
  ink: "#050A30"        # the ground — the navy the semester ends in
  ink-2: "#0D1550"      # the raised surface — the sheet, the card
  ink-3: "#131C5E"      # the hover / lit surface
  paper: "#F2F5FF"      # the text — tinted toward the navy, never pure white
  mute: "#A3ABD3"       # the secondary text
  volt: "#C8E91C"       # the one signal. one element per frame.
  volt-deep: "#9FBD0E"
  volt-ink: "#050A30"   # text on a volt fill
  rule: "rgba(255,255,255,0.16)"
  rule-2: "rgba(255,255,255,0.28)"
  rule-3: "rgba(255,255,255,0.09)"
  veil: "rgba(200,233,28,0.12)"
  error: "#FF7A6B"

typography:
  # — reading ramp (Figtree) —
  body:        { fontFamily: "Figtree", cqw: 0.83, weight: 400, lineHeight: 1.5 }
  body-lede:   { fontFamily: "Figtree", cqw: 0.95, weight: 400, lineHeight: 1.5 }
  micro:       { fontFamily: "Figtree", px: 13, weight: 400, tracking: "0", upper: false }
  micro-strong:{ fontFamily: "Figtree", px: 16, weight: 600, tracking: "0", upper: false }
  mono-tag:    { fontFamily: "JetBrains Mono", cqw: 0.78, weight: 400, tracking: "0.02em" }
  mono-chrome: { fontFamily: "JetBrains Mono", px: 13, weight: 400, tracking: "0.06em" }
  # — display ramp (Saira Condensed 800, the site's display face) —
  table-name:  { fontFamily: "Saira Condensed", cqw: 1.5, weight: 800, lineHeight: 1.0, tracking: "-0.005em" }
  row-headline:{ fontFamily: "Saira Condensed", cqw: 2.1, weight: 800, lineHeight: 1.0, tracking: "-0.005em" }
  ed-callout:  { fontFamily: "Saira Condensed", cqw: 2.6, weight: 800, lineHeight: 1.0, tracking: "-0.005em" }
  headline:    { fontFamily: "Saira Condensed", cqw: 4.6, weight: 800, lineHeight: 0.9, tracking: "-0.01em" }
  headline-index:{ fontFamily: "Saira Condensed", cqw: 5.0, weight: 800, lineHeight: 0.9, tracking: "-0.01em" }
  display-quote:{ fontFamily: "Saira Condensed", cqw: 5.7, weight: 800, lineHeight: 0.92, tracking: "-0.012em" }
  display-chapter:{ fontFamily: "Saira Condensed", cqw: 6.8, weight: 800, lineHeight: 0.9, tracking: "-0.012em" }
  display-closing:{ fontFamily: "Saira Condensed", cqw: 9.4, weight: 800, lineHeight: 0.9, tracking: "-0.015em" }
  display-hero:{ fontFamily: "Saira Condensed", cqw: 10.4, weight: 800, lineHeight: 0.88, tracking: "-0.018em" }
  vbig-numeral:{ fontFamily: "Saira Condensed", cqw: 12.5, weight: 800, lineHeight: 0.86, tracking: "-0.02em" }

spacing:
  edge: "4cqw"          # standard frame edge inset (~80px@1920)
  pad-top: "7cqw"
  pad-bottom: "6cqw"
  gap-md: "2cqw"

components:
  night-ground:
    backgroundColor: "{colors.ink}"
    description: >
      The navy ground every frame sits on. Never pure black: the site is a deep navy and
      the film must read as the same night.
  ledger-rules:
    rule: "0.12cqw solid {colors.rule}"
    placement: "between every row of a ledger, full width of the sheet"
    description: >
      The site's own ruled lines — 1px white at 16%. This is the site's signature texture,
      not a decoration.
  volt-bar:
    backgroundColor: "{colors.volt}"
    height: "0.3cqw"
    description: >
      The lime top edge the site puts on the hero card and the photo. One per frame, on the
      top edge of whatever holds the number.
  sheet-card:
    backgroundColor: "{colors.ink-2}"
    border: "0.12cqw solid {colors.rule}"
    description: >
      The site's own sheet card. A raised navy rectangle with a 1px white-at-16% edge.
  number-slot:
    typography: "{typography.vbig-numeral}"
    color: "{colors.paper}"
    description: >
      The one big number. When a figure has not been earned yet, the site shows an empty
      lime-tinted slot with a volt edge — never a zero, never a dash.
  figure-row:
    layout: "grid, equal cells, each: mono figure over a body label"
    borderTop: "0.12cqw solid {colors.rule}"
    description: >
      The site's own four-cell figures row: Target marks, Achieved so far, Semester total,
      Final maximum. The achieved cell is the only volt one.
  ladder-rung:
    layout: "grid: grade · percentage · cgpa point"
    backgroundColor: "{colors.ink-2}"
    border: "0.12cqw solid {colors.rule}"
    description: >
      One of ten rungs, A+ through F*. Exactly one is volt — A+, top-left.
  pixel-glitch:
    backgroundColor: "{colors.ink}"
    fill: "repeating-linear-gradient(90deg, {colors.volt} 0 2px, transparent 2px 8px)"
    size: "14–30cqw wide, full height, stair-stepped"
    placement: "never on a data frame; decorative only"
    description: >
      The old preset's stair-stepped scanline column. RETIRED for this film — the site has
      no glitch and the film must not invent one.
  qr-block:
    backgroundColor: "{colors.ink-2}"
    cells: "8×8, {colors.rule-2} on / {colors.rule-3} off"
    size: "3–9cqw square"
    description: >
      The old preset's QR mosaic patch. RETIRED for this film — the site has no QR motif.
  topbar-rule:
    typography: "{typography.headline-index} + {typography.mono-tag}"
    borderBottom: "0.12cqw solid {colors.rule}"
    description: "Section header on index and table frames."
  ledger-row:
    layout: "grid: mono num · Figtree name · body desc · mono delta"
    borderBottom: "0.06cqw solid {colors.rule-3} (header 0.12cqw solid {colors.rule})"
    typography: "{typography.mono-tag} + {typography.table-name} + {typography.body}"
    description: "Dense matrix row with ↑/↓/— delta."
  vstack-label:
    typography: "{typography.mono-chrome}"
    transform: "writing-mode: vertical-rl"
    description: "Catalogue chrome along a frame edge."
---

# Ink Ledger — Frame (video / frame layer)

## Brand adaptation (READ FIRST — the frontmatter is the source of truth)

The YAML frontmatter above is **normative — use it verbatim.** The prose below is the intent
behind it. Where the two disagree, the frontmatter wins.

- **Colors** — use the frontmatter hex. There is no cream, no cobalt, no paper ground.
  The ground is `{colors.ink}` and every raised surface is `{colors.ink-2}`.
- **Fonts** — **Figtree** for sentences, **Saira Condensed 800** for display, **JetBrains Mono**
  for figures and chrome. Nothing else.
- **Weights** — three only: 400, 600, 800. Mono is 400. Never 500, never 700.
- **Labels** — body face, sentence case, not tracked, not uppercase. The site's own labels
  are sentences: "Target marks", "Achieved so far", "Semester total", "Final maximum".
- **The retired atoms** — the graph-paper grid, the pixel-glitch column and the QR block are
  gone. They belonged to the old light-pastel site and the film must not carry them.

## Overview

Ink Ledger at frame scale is **the site's own night**: a deep navy ground, raised navy
surfaces, the ledger's ruled white lines, and **one lime signal per frame**. The site's
signature is the ledger — every fact sits in a ruled row or a ruled cell — and the film
inherits it.

The voice is a three-face conversation: **Saira Condensed 800** carries every display and
headline, uppercase, never italic; **Figtree** carries body sentences; **JetBrains Mono**
carries every figure and every piece of chrome.

**Key characteristics at frame scale:**

- **Navy ground, never black.** The site is `#050A30`; the film is the same night.
- **Ruled ledger lines** (1px white at 16%) between rows and under section heads. The
  site's own texture — this is what replaces the graph grid.
- **One lime element per frame.** Never two. Never a gradient, never a glow.
- **Figures are mono, tabular, and true.** Every number on screen is one the site states.
- **Three weights, three faces.** Figtree 400/600, Saira Condensed 800, JetBrains Mono 400.

## The Frame

### Frame Craft Bar

Three eyeball tests gate every frame before any structural check:

- **Squint** — one Saira Condensed element dominates at **3–6× its nearest neighbor**;
  hierarchy is size, never weight.
- **Silence** — declarative frames read **45–60% empty** with the ruled lines showing.
  The sheet and the ladder are the one dense exception (density via quiet repetition).
- **Restraint** — **one lime element**, and only where the site puts it: the achieved
  figure, the status chip, the A+ rung, the address. Never a stroke, never a gradient.

- **Primary:** 1920×1080 (16:9). Display authored in **`cqw`** (`px ÷ 1920 × 100 = cqw`).
- **Vertical:** 1080×1920 (9:16). **Square:** 1080×1080 (1:1).
- **Safe area:** `edge` (4cqw) inset; the volt bar and chrome live on the safe line.

### Motion (out of scope here, but the intent)

Everything moves on **transform and opacity only**. Nothing animates `width`, `height`,
`top` or `left`. The camera moves are `scale` and `translate`. No `transition: all`.
Every animation has a `prefers-reduced-motion: reduce` fallback, and the end state of
every frame is the state a static screenshot would show — the poster is a real frame.

## What the film must never do

- Never show a **zero** where the site shows an empty slot. An unearned number is a slot,
  not a figure.
- Never show a number the site does not state. No invented scores, no invented counts.
- Never show a mockup of the product. The captured plates are the product.
- Never put the site on a paper ground. The site is the ink ground.
- Never carry the retired graph grid, glitch column or QR block.
- Never use the site's copy paraphrased. The site's lines are used verbatim.

## The atoms the frames share

| Atom | What it is | Where it comes from |
|---|---|---|
| `night-ground` | the navy canvas | the site's `body` |
| `sheet-card` | a raised navy rectangle with a hairline edge | the site's `.hero__figure` |
| `ledger-rules` | 1px white-at-16% lines | the site's `.row` borders |
| `volt-bar` | a lime top edge | the site's `.hero__photo` border |
| `figure-row` | four equal cells, one volt | the site's `.eq` |
| `ladder-rung` | ten rungs, one volt | the site's `.lad__rung` |
| `number-slot` | the big number, or an empty lime-tinted slot | the site's `.verdict__figure` |
