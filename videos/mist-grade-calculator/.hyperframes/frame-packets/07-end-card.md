# Frame packet: 07-end-card

## Project inputs

- Project: /home/thespd/Projects/MIST-Grade-Calculator/videos/mist-grade-calculator
- Design tokens: /home/thespd/Projects/MIST-Grade-Calculator/videos/mist-grade-calculator/frame.md
- RULES_DIR: /home/thespd/.agents/skills/hyperframes-animation/rules

## Assigned storyboard block

## Frame 7 — The end card

- scene: The site's campus night photograph in its duotone; the wordmark carried in; the address lands
- duration: 5s
- poster: 3.2s
- transition_in: cut
- status: outline
- reads: the photograph reads as the MIST campus at night (0.2-1.6s); "MIST GRADE CALCULATOR" is carried in (1.6-3.2s); "mistgc.vercel.app" lands in volt (3.0-4.4s)
- sound: the bed resolves and fades out over 1.5s from the second
- asset_candidates: capture/assets/mist-at-the-hour-the-semester-ends.jpg — the site's own night photograph, full-bleed
- src: compositions/frames/07-end-card.html
- blueprint: cta-morph-press (Adapt)
- rules: theme-crossfade-morph, discrete-text-sequence

The site's own night photograph, full-bleed, in its own duotone — grayscale 1,
contrast 1.2, multiplied into the ink. The wordmark is drawn as type, because the site
has no logo image: Saira Condensed 800 uppercase, paper white, carried in from the left
on the site's own line. Then "mistgc.vercel.app" in volt beneath it, and the site's own
last sentence holding for the final second: "The sheet above is the part you can still
change."

## Video direction

**Camera.** One continuous take through the product: the camera enters already inside the
sheet's ink band (Frame 1), pulls back to reveal the whole sheet (Frame 2), pushes in on
the six rows (Frame 3), pushes further into the verdict band for the answer (Frame 4),
drops to the table below (Frame 5), floods to ink for the ladder (Frame 6), and lands on
the photograph (Frame 7). Only one cut in the film is a scene change: the flood in Frame 6.
Everything else is a move inside the same paper world.

**Light.** No shadows anywhere. Depth is paper-2 against paper, and rule weight: 1px for
a row, 2px for a sheet edge, 4px never. The photograph frames are the only place a
gradient exists, and it is the site's own.

**Type.** Saira Condensed 800 for every number and title, uppercase, never italic.
Albert Sans for sentences. JetBrains Mono for tabular figures. Nothing below 28px.

**Accent discipline.** Volt appears on exactly one element per frame, and only where the
site puts it: the achieved-so-far cell, the AIMING FOR A+ chip, the A+ ladder cell, the
address. It is never a stroke, never a glow, never a gradient.

**Cuts.** Seven frames, all on a bar line of the 108 BPM bed. The rhythm is: 3, 3.5, 6.5,
4, 4.5, 3.5, 5 — one long beat at the filling (the demo holds one framing while the UI
acts) and a short one at the answer.

**No.** No voiceover. No text that moves while it is read. No title that keeps drifting.
No three-cards-in-a-row. No docked logo. No invented dashboard. Every number on screen is
one the site states.

## Selected blueprint: cta-morph-press

# cta-morph-press — CTA Morph & Press

**intent**: A resting brand mark condenses at the same screen center into a smaller, brighter CTA, then a cursor arrives from off-stage and lands a human-aimed click on it. The viewer's eye is walked from "this is who we are" to "and this is what you do." The morph and the click are the two headline beats.

**roles served**

- CTA (from `cta-morph-press`): when the close moves from brand identity to a single user action, two elements share the same center sequentially (a morph, not a cut), and the payoff is a simulated click with physical feedback. Reach for it for a focused "click here" sign-off — no spatial set, no multi-step UI (that's `cursor-ui-demo`).
- Hook (ROLE-WIDENED, from `widget-morph-on-blank-field`): the same
  machinery run as an OPENER — a lone `[widget]` (pill / chip lockup) on a flat field transforms
  in place, performs its payload, then vanishes to a plain frame that a typed `[title]` resolves.
  The click, when present, ignites the morph rather than closing it; there may be no cursor at
  all. Reach for it when the product hook IS one widget doing one thing — still no spatial set,
  no multi-step UI (that's `cursor-ui-demo`). Mint-reconsideration trigger: if future mining
  brings 2+ more widget-morph openers with the vanish → typed-title resolve, promote this variant
  to its own blueprint (the beat order is fully inverted by then).

**duration**: 4–6s (Hook widget-morph opener 5–7.5s)

**shot structure** (a `[bg]` canvas; hero and CTA are flex-centered siblings sharing one `transform-origin`)

- **Scene 1 (0.0–~1.4s) — presence.** The `[hero mark / brand lockup]` holds dead-center, alive but resting — only a faint rotational breath on the mark; any title text under it stays rock-stable. Camera static.
- **Scene 2 (~1.4–2.4s) — the morph (signature move).** The hero CONDENSES at the same screen center into a smaller, brighter `[CTA]` (button / card): the outgoing mark shrink-fades exactly as the CTA scales up in its place. Because they share one `transform-origin`, the eye reads it as one element transforming, not a swap.
- **Scene 3 (~2.4–3.4s) — approach.** A `[cursor]` arrives from off-stage on a **decelerating** path (it "arrives," it does not pass through) and lands a few px **off** the CTA's geometric center, so the aim reads human, not scripted.
- **Scene 4 (~3.4–end) — press.** The cursor lands a physical CLICK — cursor and CTA compress together in lockstep, then release with feedback (an optional ripple / glow bloom). Holds on the clicked state.
- **Variant — Hook (widget-morph opener)** (from `widget-morph-on-blank-field`;
  reorders the beats — press first, morph second, title last). **(1) presence**: a lone
  `[pill / chip lockup]` sits centered on a flat `[field]`; optionally the `[cursor]` glides in, a
  hover pill-background appears behind the chip, and the click lands with the same lockstep press.
  **(2) the morph**: the widget transforms IN PLACE — expands downward anchored at its top edge
  into a `[menu]`, or spring-morphs outward into a `[prompt card]` with a small overshoot settle —
  new content fades/slides into place. **(3) payload**: the transformed state performs —
  `[placeholder]` types with a blinking caret, `[user text]` types while a control flips from
  muted to its vibrant active color, or the menu snap-collapses back to the pill carrying the
  `[new value]` + a checkmark pop; the background may snap to a new color under the persistent
  foreground card. **(4) resolve**: the widget VANISHES; a plain frame closes the beat — a
  `[closing title]` types on center, or a hold on the flipped solid.

**motion vocabulary**: faint rotation-only resting breath (logo scope only); same-center morph-swap (shrink-fade ↔ scale-up sharing `transform-origin`); cursor decel-arrival from off-stage; off-center human aim; lockstep press compression; release feedback ripple / glow. Hook opener: anchored downward expand of a pill into a menu and springy snap-collapse back;
chip-to-card spring morph with overshoot settle; placeholder / user-text typewriter with blinking
caret (may cut mid-word); control color-state flip muted → vibrant; background color snap under a
persistent foreground card; checkmark pop; widget vanish to blank frame; typed closing title.

**rule mapping**

- hero → CTA condense at one center → `scale-swap-transition` (shared `transform-origin: 50% 50%` is what sells the morph; CTA `position: absolute` so it doesn't shove the hero during the brief overlap)
- resting-hero aliveness (rotation only, scoped to the mark so the Phase-2 scale doesn't fight it) → `sine-wave-loop` (low-amplitude rotation register — subtle jitter, not a scale breath)
- cursor press + release in lockstep (single-target-array so both compress together) → `physics-press-reaction` (PRESS_DOWN + RELEASE portion)
- cursor approach (decel from off-stage, off-center landing, hard-cut opacity in) → `gsap-effects` (translate on `power2.out`)
- click ripple / release glow → `cursor-click-ripple` (attack-decay ring) and/or `ambient-glow-bloom` (release bloom)
- (Hook) chip → prompt-card spring morph at one center → `scale-swap-transition` (the base morph
  contract, run in the expand direction) + `card-morph-anchor` (corner-radius / surface ride-along)
- (Hook) anchored-edge expand / snap-collapse (pill ↔ menu, top edge pinned) →
  `anchored-layout-expand` (edge-anchored directional container growth — origin-pinned expansion
  with counter-scaled children; `card-morph-anchor` stays for uniform-scale morphs only)
- (Hook) placeholder + user typing, blinking caret, mid-word cut → `gsap-effects` (typewriter) +
  `context-sensitive-cursor` (blink) + `discrete-text-sequence` (mid-word cut states)
- (Hook) control color flip muted → vibrant → `press-release-spring` (color-transition variation)
- (Hook) checkmark pop / card-arrival overshoot → `spring-pop-entrance`
- (Hook) hover pill-background + igniting click → the base's `physics-press-reaction` +
  `cursor-click-ripple` mappings apply unchanged

**camera modifier**: camera-static — the morph and click happen in element space; a camera move would compete with the click as the climax. The Hook opener keeps the same contract — even the background color flip is an element-level
snap, not a camera event.

## Selected motion rule: theme-crossfade-morph

---
name: theme-crossfade-morph
description: Whole-theme in-place morph under a fixed anchor — background, typography, corner radii, icons, chrome and logos all blend simultaneously (~0.3s) through N pre-styled skins while one anchor element never moves. Recipe = stacked full layers + opacity crossfade, anchor rendered once on top. Seek-safe by construction.
metadata:
  tags: theme, skin, crossfade, morph, anchor, reskin, cycle, ui, stacked-layers
---

# Theme Crossfade Morph

The whole world re-skins while one thing holds still. A composer box cycles through four IDE themes; a checkout widget flips through brand skins — background, typography, corner radii, toolbar icons, footer logos all change **at once**, in place, in ~0.3s, N times — and through every flip one anchor element (the prompt string, the widget layout, the wordmark) **never moves**. The anchor's stillness is the rhetorical claim: _everything changes, this doesn't._

Boundary: [card-morph-anchor.md](card-morph-anchor.md) morphs **one container** between two shots — its dimensions, radius, and surface tween continuously. This rule re-skins an **entire scene** through **N discrete states**: nothing tweens property-by-property (fonts, icons, and logos can't interpolate); the "morph" is a fast simultaneous crossfade of complete pre-styled layers. ([scale-swap-transition.md](scale-swap-transition.md) swaps an element at center; here the surroundings swap and the element holds.)

## How It Works

1. **One skin = one complete layer.** Each theme state is a fully pre-styled, full-bleed layer (`position: absolute; inset: 0`) containing everything that changes: background, shell/chrome, toolbar icons, footer logos, typography. All `N_SKINS` layers exist in the DOM from `t=0`, stacked; skin 0 starts visible, the rest at `opacity: 0`.
2. **The morph is a crossfade.** At each boundary, two opposing opacity tweens run at the same timeline position over `MORPH_DUR` (~0.3s): outgoing `1 → 0`, incoming `0 → 1`. Because both layers are complete, every property "blends" simultaneously for free — including the un-tweenable ones (font families, icon glyphs, logos), which read as morphing precisely because everything else is mid-blend around them.
3. **The anchor renders once, on top.** The element that must not move lives in its own layer above all skins and is **excluded from every skin layer**. No transforms, no re-parenting, no per-skin restyle.
4. **Windows are precomputed.** `T_k = CYCLE_START + k × (SKIN_HOLD + MORPH_DUR)`. Steady cadence by default; hold the final skin longest when it's the resolve.

The only animated property is `opacity` — which is why this rule is seek-safe with zero special machinery.

## Recipe

```html
<!-- inside a standard scene clip (hyperframes-core) -->
<div class="theme-stage">
  <!-- One complete pre-styled layer per skin; skin-0 visible at t=0 -->
  <div class="skin skin-0"><div class="shell">…terminal chrome, mono type, footer badge…</div></div>
  <div class="skin skin-1">
    <div class="shell">…rounded composer, sans type, toolbar pills, logo…</div>
  </div>
  <div class="skin skin-2"><div class="shell">…dark shell, its own chrome and footer…</div></div>

  <!-- The anchor: rendered ONCE, above every skin. It never moves. -->
  <div class="anchor" id="anchor">{anchorText}</div>
</div>
```

```css
.theme-stage {
  position: absolute;
  inset: 0;
}
.skin {
  position: absolute;
  inset: 0;
  opacity: 0;
  /* Each skin fully self-styled: its own background, fonts, radii,
     icons, chrome, logos. Nothing inherited across skins. */
}
.skin-0 {
  opacity: 1; /* the opening state — matches the timeline's fromTo */
}
.shell {
  /* CRITICAL: shared geometry. The shell box (and any element that
     "persists" across skins — toolbar row, footer row) sits at the SAME
     coordinates in every skin, so mid-blend frames read as one UI
     changing clothes, not two UIs ghosting. */
  position: absolute;
  left: SHELL_LEFT;
  top: SHELL_TOP;
  width: SHELL_WIDTH;
  height: SHELL_HEIGHT;
}
.anchor {
  position: absolute;
  z-index: 10; /* above every skin */
  left: ANCHOR_LEFT;
  top: ANCHOR_TOP;
  /* No transforms, no transitions — the stillness is load-bearing. */
}
```

```js
const skins = gsap.utils.toArray(".skin");

// Boundary k→k+1 at T_k: outgoing fades down as incoming fades up —
// ONE simultaneous crossfade, everything blends at once.
skins.forEach((skin, k) => {
  if (k === 0) return; // skin-0 is the opening state
  const at = CYCLE_START + k * (SKIN_HOLD + MORPH_DUR);
  tl.fromTo(skin, { opacity: 0 }, { opacity: 1, duration: MORPH_DUR, ease: "power2.inOut" }, at);
  tl.to(
    skins[k - 1],
    { opacity: 0, duration: MORPH_DUR, ease: "power2.inOut" },
    at, // same position — the blend is simultaneous, never sequential
  );
});

// The anchor gets NO tweens. Its absence from the timeline is the point.
```

## Variations

- **Anchor-typography reskin (per-layer copies)** — when the anchor's own type treatment must change with the theme (mono in the terminal skin, sans in the editor skin), each skin carries its own copy of the anchor at **pixel-identical geometry** and there is no separate top layer; the invariant shifts from "one element" to "one geometry." Verify the copies overlay exactly (screenshot two skins at 50% opacity) — a 2px baseline drift reads as the anchor flinching, which breaks the whole claim.
- **Skin-cycle tour with logo relay** — a large brand logo outside the anchored shell crossfades **in the same windows** as the skins (logo k with skin k, same `MORPH_DUR`). The paired swap sells "same product, every brand."
- **Washout finale** — after the last skin, a final low-key layer (faint dot-grid, blueprint wash) fades in while the last shell drops to ~0.25 opacity — the cycle resolves into a held diagram of itself. One extra window; the anchor may fade with the shell or hold full-strength.
- **Emphasis brake** — steady cadence for `N−1` skins, then hold the final skin 2–3× `SKIN_HOLD`; the cycle demonstrates breadth, the brake lands the resolve. Precompute the hold array; don't drift the cadence without cause.

## Values

| token           | range                                       | notes                                                                                                |
| --------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| N_SKINS         | 3–5                                         | two is a before/after (consider `card-morph-anchor`); past five the cycle pads                       |
| SKIN_HOLD       | 0.8–1.5s                                    | long enough to register the logo/footer identity, short enough to keep the churn rhetorical          |
| MORPH_DUR       | 0.25–0.4s, ~0.3s canonical                  | faster reads as a hard cut; slower reads as a mushy dissolve with lingering double-exposure          |
| CYCLE_START     | ≥ anchor settle + a beat                    | after the anchor and skin-0 have fully registered                                                    |
| SHELL geometry  | —                                           | shell / toolbar / footer coordinates identical across skins; contents inside the slots differ freely |
| ANCHOR position | —                                           | identical to the pixel across the scene (per-layer form: identical in every skin)                    |
| washout / brake | shell ~0.2–0.3 opacity; hold 2–3× SKIN_HOLD | —                                                                                                    |

## Critical Constraints

- **The anchor never moves.** No transforms, no opacity dips, no re-parenting, no restyle — the contrast between total churn and total stillness is the entire device; one flinch and the shot becomes a slideshow.
- **Nothing tweens but `opacity`** — no `borderRadius` / `background` tweens; radii and colors change by being different in the next layer. Visibility via `opacity` only, never `display` / `visibility` toggles (they can't blend mid-fade).
- **Pixel-align the shared geometry** — mid-blend both skins are partially visible; aligned shells read as one UI changing clothes, misaligned shells ghost into two UIs.
- **Pre-style everything** — each skin is complete and static; no class toggling, no runtime restyle mid-tween.
- **Outgoing and incoming tweens share one timeline position** — a staggered blend flashes the stage background between skins.
- **Adjacent windows only** — skin k crossfades with k+1, never k+2; at no frame are three skins partially visible.
- **Camera static — always.** A push-in on top of a theme cycle destroys the stillness that makes the anchor read.
- **Hard cuts are the cheaper sibling** — if the states should _snap_, that's `discrete-text-sequence` territory; the ~0.3s blend is specifically the "morph" read.

## See also

`context-sensitive-cursor` (caret color switches at each `T_k`) · `discrete-text-sequence` (type the anchor first; or the hard-cut alternative) · `card-morph-anchor` (the single-container sibling) · `spring-pop-entrance` (the lockup that joins the anchor at the resolve) · `sine-wave-loop` (drifting field under the cycle — never on the anchor).

## Selected motion rule: discrete-text-sequence

---
name: discrete-text-sequence
description: Replace entire text states at frame thresholds for non-linear typing effects — typos, bulk additions, pauses, backspaces, simulated thinking.
metadata:
  tags: text, typing, discrete, threshold, non-linear, sequence
---

# Discrete Text Sequence

Instead of character-by-character typewriter, replace entire string states at time thresholds — enabling non-linear effects (typos, backspaces, bulk paste, "thinking" gaps) that smooth per-char typing can't achieve. If your effect is "type each character, no edits", this rule is overkill — use the smooth-slice variation below.

## How It Works

The typing is authored as a sparse array of `{ t, text }` states; on every `onUpdate` a **reverse search** finds the latest entry whose `t` has passed and renders its text. Display jumps between states with no animation between them — the realism comes from the schedule shape: fast keystroke clusters (0.06–0.20s apart), pauses at word breaks (0.3–0.6s), a typo, backspaces peeling back to the fork, then a bulk paste replacing many chars in one entry. A block cursor blinks via a deterministic sin square wave on the same timeline.

## Recipe

```html
<!-- inside a standard scene clip (hyperframes-core) -->
<div class="terminal">
  <div class="prompt">$</div>
  <div class="text-wrap">
    <span class="text" id="text"></span><span class="cursor" id="cursor">_</span>
  </div>
</div>
```

```css
.terminal {
  font-family: {monoFont}; /* monospace required — proportional jitters even in a fixed box */
  display: flex;
  align-items: baseline;
  font-size: TERMINAL_FONT_SIZE;
}
.text-wrap {
  display: inline-flex;
  align-items: baseline;
  min-width: TEXT_WRAP_MIN_WIDTH; /* ≥ widest state — stops right-edge jitter */
  white-space: nowrap;
}
.cursor {
  display: inline-block; /* inline ignores width */
  width: CURSOR_WIDTH;
}
```

```js
// Each entry shows from its t until the NEXT entry's t.
// Shape: keystrokes → typo → backspace to the fork → bulk paste → completion mark.
const SEQUENCE = [
  { t: 0.0, text: "" },
  { t: T_K1, text: "{p1}" }, // first keystrokes (~3-5 chars, 0.1-0.2s apart)
  { t: T_K2, text: "{p1 + ' ' + p2_typo}" }, // continuation containing a typo
  { t: T_BS, text: "{p1 + ' ' + p2_partial}" }, // backspace(s) — peel back to the fork
  { t: T_BULK, text: "{fullCorrectedText}" }, // bulk paste — many chars in one jump
  { t: T_DONE, text: "{fullCorrectedText + ' ✓'}" }, // completion marker
];

// Reverse-search for the latest entry whose t has passed
function textAt(time) {
  for (let i = SEQUENCE.length - 1; i >= 0; i--) {
    if (time >= SEQUENCE[i].t) return SEQUENCE[i].text;
  }
  return "";
}

const textEl = document.getElementById("text");
const cursorEl = document.getElementById("cursor");

const driver = { t: 0 };
tl.to(
  driver,
  {
    t: TOTAL_DURATION,
    duration: TOTAL_DURATION,
    ease: "none",
    onUpdate: () => {
      textEl.textContent = textAt(driver.t);
    },
  },
  0,
);

// Cursor blink — deterministic sin square wave, never a CSS animation
const blink = { p: 0 };
tl.to(
  blink,
  {
    p: Math.PI * 2 * BLINK_CYCLES,
    duration: TOTAL_DURATION,
    ease: "none",
    onUpdate: () => {
      cursorEl.style.opacity = Math.sin(blink.p) > 0 ? "1" : "0";
    },
  },
  0,
);
```

## Variations

- **Smooth character slice** (continuous typewriter — no pauses, no edits): faster to author but uniformly "machine-typed", missing the human realism:

```js
const fullText = "{fullPhrase}";
const len = { v: 0 };
tl.to(
  len,
  {
    v: fullText.length,
    duration: TYPE_DUR,
    ease: "power1.inOut",
    onUpdate: () => {
      textEl.textContent = fullText.substring(0, Math.floor(len.v));
    },
  },
  0,
);
```

- **Thinking pause** — hold one state for `THINK_HOLD_DUR` (0.8–2.0s; under 0.5s reads as a stutter, not thought) simply by leaving a gap before the next entry's `t`.
- **State pulse on completion** — when the final state lands, `tl.to(".text", { scale: 1.03–1.08, duration: 0.15–0.3, yoyo: true, repeat: 1 }, T_DONE)`.
- **Per-state color shift** — in `onUpdate`, branch on `driver.t` vs the milestones: success color after `T_DONE`, dim mid-edit, normal while typing.

## Values

| token               | range                                        | notes                                                                  |
| ------------------- | -------------------------------------------- | ---------------------------------------------------------------------- |
| TERMINAL_FONT_SIZE  | 48–96px                                      | full-bleed comps; smaller for terminal-style detail                    |
| TEXT_WRAP_MIN_WIDTH | ≥ widest state                               | measure with a hidden probe after `document.fonts.ready` if unsure     |
| milestone `t`s      | keystrokes 0.06–0.20s apart; pauses 0.3–0.6s | monotonically increasing; `T_DONE ≤ TOTAL_DURATION − ~1s` climax dwell |
| TYPE_DUR (smooth)   | `chars × 0.06–0.12s`                         | fast → relaxed                                                         |
| BLINK_CYCLES        | one cycle per 0.5–0.8s                       | `TOTAL_DURATION / 0.8 ≤ BLINK_CYCLES ≤ TOTAL_DURATION / 0.5`           |
| CURSOR_WIDTH        | ~0.3× font size                              | gap to text single-digit px so the cursor feels attached               |

## Critical Constraints

- **Reverse-search the array each frame** — O(n) with small n (≤30 typical); don't index by frame, the sequence is sparse.
- **`min-width` on the text wrap is mandatory** — without it the right edge jitters as state length changes.
- **Discrete jumps must be INSTANT** — any transition on the text turns the jump into a smear and kills the "typing" feel.
- **Cursor blink is sin/sequence-driven on the timeline**, `display: inline-block`, monospace font, `white-space: nowrap` (wrapping mid-state breaks the illusion; trailing spaces must survive).
- **Discrete vs smooth** — use discrete only for non-linear states (typos, pauses, bulk paste); plain typing takes the smooth-slice variation.

## See also

`context-sensitive-cursor` (same SEQUENCE pattern + segment-colored cursor) · `3d-text-depth-layers` (discrete text with layered depth) · `counting-dynamic-scale` (discrete label beside a smooth counter) · `press-release-spring` (post-completion press beat).
