---
format: 1920x1080
duration: 30s
message: "Find out the Final-exam number you need before the exam, not after it"
arc: Hook → the sheet → filling it → the answer → the rules → the ladder → the end card
audience: MIST undergraduates with one exam left
music: focused editorial pulse, no melody in the first 3s, 108 BPM
---

## Frame 1 — The ink band

- scene: The site's own verdict band on its ink ground, full-bleed, "143" held at the right
- duration: 3s
- poster: 1.6s
- transition_in: cut
- status: outline
- reads: "The Final" reads (0.3-1.1s); "143" is the number the film is about (0.5-2.0s); the cursor arrives (2.2-3.0s)
- sound: bed enters on its first bar, low and building; no click yet
- asset_candidates: assets/photos/04-verdict.png — the site's own verdict band
- src: compositions/frames/01-ink-band.html
- blueprint: kinetic-type-beats (Adapt)
- rules: svg-path-draw, counting-dynamic-scale

Open cold on the site's real verdict panel, on its own ink ground: the number, already
there, waiting to be earned. The hairline rule under the band draws itself, left to right.
The cursor enters from the bottom-right corner and grows to 5% of the frame width, hovering
at the first input row. This is the thumbnail frame — the number must be legible at 120px
wide.

## Frame 2 — The sheet

- scene: Pull back to reveal the whole semester sheet, verdict band over six ruled rows over the figures
- duration: 3.5s
- poster: 2.4s
- transition_in: cut
- status: outline
- reads: the whole sheet reads as one object (0.2-2.0s); the figures row and its volt cell are visible (2.0-3.5s)
- sound: the bed's pulse arrives on the bar
- src: compositions/frames/02-the-sheet.html
- blueprint: camera-journey (Adapt)
- rules: viewport-change, multi-phase-camera

One continuous camera move: pull back 1.0 → 0.62 with `power2.inOut` over 17 frames.
The sheet is the site's real one — SEMESTER SHEET head, the credit toggle, the target-grade
select, the verdict band, six ruled input rows, and the four-cell figures row with its volt
cell on "Achieved so far". The ink ground and its ruled ledger lines behind it.

## Frame 3 — Six fields

- scene: Push in on the six input rows; the cursor clicks each and a mark is typed in
- duration: 6.5s
- poster: 4.6s
- transition_in: cut
- status: outline
- reads: the cursor finds the first field (0.2-0.9s); each of the six fields fills in turn (0.9-5.2s); the achieved figure climbs to 97.00 (2.0-5.6s)
- sound: one soft dry click per field, six clicks, each on a beat
- asset_candidates: assets/photos/03-sheet.png — the six real input rows
- src: compositions/frames/03-six-fields.html
- blueprint: cursor-ui-demo (Adapt)
- rules: camera-cursor-tracking, cursor-click-ripple, counting-dynamic-scale

Push in to 1.8x on the six rows. The cursor — a solid paper arrow, 5% of the frame width —
moves field to field with `power2.inOut`, and on each arrival a mark types in. The marks
are the site's own real scenario: Class Test 1 17, Class Test 2 15, Class Test 3 12,
Performance 12, Attendance 13, Mid term 24. As each lands, the volt "Achieved so far"
figure in the band above rises 25.50 → 48.00 → 48.00 → 78.00 → 91.50 → 97.00. The verdict
number above updates with it.

## Frame 4 — The answer

- scene: The band answers — 143, the number takes 40% of the frame
- duration: 4s
- poster: 2.6s
- transition_in: cut
- status: outline
- reads: the status reads AIMING FOR A+ (0.2-1.0s); "143" lands and holds (0.6-3.4s); the message reads "You need 143 marks in the Final." (1.4-3.6s)
- sound: a low settle as the number lands, on the bar
- src: compositions/frames/04-the-answer.html
- blueprint: kinetic-type-beats (Adapt)
- rules: counting-dynamic-scale, coordinate-target-zoom

The payoff, once. Push in 1.0 → 1.18 over 17 frames with `power2.inOut` while the number
counts up to 143 and settles. The status line is the site's own sentence and the number
itself is the volt — the accent appears once here. Hold the number dead still for the last
second; nothing breathes.

## Frame 5 — The rules

- scene: The site's "Six marks on the sheet" table, seen flat, rows revealing top to bottom
- duration: 4.5s
- poster: 2.6s
- transition_in: cut
- status: outline
- reads: "Six marks on the sheet" lands (0.2-1.4s); each row reveals with its rule drawing (1.4-3.6s); the Final row is the last (3.0-4.5s)
- sound: the bed continues; a tick per row reveal
- asset_candidates: assets/photos/03-sheet.png — the real sheet, its six rows and their maxima
- src: compositions/frames/05-the-rules.html
- blueprint: fixed-anchor-cycle (Adapt)
- rules: svg-path-draw, discrete-text-sequence

A punch-in inside the same world, not a world change. The table is the site's real one:
the six sheet rows with their maxima, drawn as the site's own ledger — Class test 20,
Mid term 30, Attendance 15, Performance 15, Final 180. Rows reveal top to bottom, 3 frames
apart, each row's hairline drawing left → right. The Final row is the heaviest rule, and it
holds last. The site's own figures row under it: 240 target marks, 300 semester total,
180 final maximum.

## Frame 6 — The ladder

- scene: The grade ladder rises into place with its one volt cell at A+
- duration: 3.5s
- poster: 2.2s
- transition_in: cut
- status: outline
- reads: "What each grade takes" lands (0.2-1.4s); A+ reads 80% and 4.00 in the volt cell (1.2-2.6s); the rest of the ladder is visible (2.0-3.5s)
- sound: the bed opens out; a single low swell on the flood
- asset_candidates: assets/photos/06-ladder.png — the real grade ladder on ink
- src: compositions/frames/06-the-ladder.html
- blueprint: dataviz-countup (Adapt)
- rules: theme-crossfade-morph, stat-bars-and-fills

The ground is already ink, so there is no colour flood — the ladder simply rises into
place over 12 frames with `power2.inOut`. Ten rungs, A+ through F*, each with its percentage
and its CGPA point. Exactly one rung is volt: A+ 80% 4.00, top-left. The rest are ink-2 and
rule. This is the film's widest frame of information and it holds still long enough to
read.

## Frame 7 — The end card

- scene: The site's campus night photograph; the wordmark carried in; the address lands
- duration: 5s
- poster: 3.2s
- transition_in: cut
- status: outline
- reads: the photograph reads as the MIST campus at night (0.2-1.6s); "MIST GRADE CALCULATOR" is carried in (1.6-3.2s); "mistgc.vercel.app" lands in volt (3.0-4.4s)
- sound: the bed resolves and fades out over 1.5s from the second
- asset_candidates: assets/photos/10-night.png — the site's own night photograph, full-bleed
- src: compositions/frames/07-end-card.html
- blueprint: cta-morph-press (Adapt)
- rules: theme-crossfade-morph, discrete-text-sequence

The site's own night photograph, full-bleed, as it is — the dusk sky between the towers,
the sky-bridge, the lamps coming on. The wordmark is drawn as type, because the site has
no logo image: Saira Condensed 800 uppercase, paper white, carried in from the left on the
site's own line. Then "mistgc.vercel.app" in volt beneath it, and the site's own last
sentence holding for the final second: "The sheet above is the part you can still change."

## Video direction

**Camera.** One continuous take through the product: the camera enters already inside the
sheet's verdict band (Frame 1), pulls back to reveal the whole sheet (Frame 2), pushes in on
the six rows (Frame 3), pushes further into the verdict band for the answer (Frame 4),
drops to the ledger below (Frame 5), lifts the ladder into place (Frame 6), and lands on
the photograph (Frame 7). Only one cut in the film is a scene change: the lift in Frame 6.
Everything else is a move inside the same ink world.

**Light.** No shadows anywhere. Depth is ink against ink-2, and rule weight: 1px for a
row, 2px for a sheet edge, 4px never. The photograph frames are the only place a
gradient exists, and it is the site's own.

**Type.** Saira Condensed 800 for every number and title, uppercase, never italic.
Figtree for sentences. JetBrains Mono for tabular figures. Nothing below 28px.

**Accent discipline.** Volt appears on exactly one element per frame, and only where the
site puts it: the achieved-so-far cell, the answer number, the A+ ladder rung, the
address. It is never a stroke, never a glow, never a gradient.

**Cuts.** Seven frames, all on a bar line of the 108 BPM bed. The rhythm is: 3, 3.5, 6.5,
4, 4.5, 3.5, 5 — one long beat at the filling (the demo holds one framing while the UI
acts) and a short one at the answer.

**No.** No voiceover. No text that moves while it is read. No title that keeps drifting.
No three-cards-in-a-row. No docked logo. No invented dashboard. Every number on screen is
one the site states. No graph grid, no glitch column, no QR block — the film does not
invent motifs the site does not have.
