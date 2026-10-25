# SPEC — MIST Grade Calculator launch film

Storyline picked: **1. THE NUMBER LANDS** (storyline 1 of three in STORYLINES.md).
Reason: it uses the captured site as itself and makes the answer the subject.

## GOAL
The viewer believes that before the final, they can already know the number they must score —
and leaves knowing where the tool is.

## OUTPUT
HyperFrames, 1920x1080, 30 fps. 30 s.

## TIME
30 s x 30 fps = 900 frames. Music bed at 108 BPM (the "SaaS / tech" base from the mood
inference table): 1 beat = 16.67 frames, 1 bar = 66.7 frames. Cuts land on bar lines.

## LOOK
The site's own night, held still. The film is the site, not an interpretation of it.

- **ground**: deep navy `#050A30` — the site is the ink ground, so the film is too. Never
  black, never paper.
- **surface**: raised navy `#0D1550` for the sheet card and the ladder rungs. Depth comes
  from ink against ink-2, and from rule weight. Zero shadows.
- **accent**: volt `#C8E91C` — a FILL only, never a stroke, never a glow, never a gradient.
  Exactly one element per frame, and only where the site puts it: the achieved-so-far
  cell, the A+ ladder cell, the status chip, the address.
- **rule**: the site's own ledger line, 1px white at 16% (`rgba(255,255,255,0.16)`), with
  9% for the lighter row dividers. Rule weight is the only hierarchy.
- **text**: paper `#F2F5FF`, muted `#A3ABD3`. Never pure white.
- **display face**: Saira Condensed 800. Hero numerals at 12.5cqw (240px) with -0.02em
  tracking. Titles 4.6–6.8cqw. Always uppercase, never italic.
- **body face**: Figtree 400/600 at 0.83–0.95cqw.
- **figure face**: JetBrains Mono 400 for every tabular number, tabular-nums.
- **medium**: the product is the product — the site's own captured plates, rebuilt panels
  at 1.8x, and the site's own night photograph. No 3D, no glass, no fake UI.
- **texture**: the ruled ledger line only. The old graph grid, the pixel-glitch column and
  the QR block are retired — the site has no such motif and the film must not invent one.
- **light and depth**: zero shadows, zero gradients outside the site's own photograph.
  Vignette 0%. Grain 0%.

## OBJECTS
- **the sheet** — the site's real `SEMESTER SHEET`: the verdict band, six ruled input rows,
  a four-cell figures row. Raised navy card, 1px white-at-16% edge, hairline rules
  between rows, square corners, the volt cell in the figures row.
- **the cursor** — a solid ink arrow, 5% of the frame width, square tail. It enters from
  off-frame, moves with `power2.inOut`, and its click causes the next thing.
- **the answer** — a number in Saira Condensed 800, 12.5cqw, in paper on ink.
- **the photographs** — the site's own campus images, as they are.

## MOTION
- **eases by role**: arrival `expo.out`; camera move `power2.inOut`; exit `power3.in`;
  colour flood `power2.inOut`; clip reveals `power4.out`.
- **durations**: moves 0.4–0.6 s (15 frames at 30 fps), pushes 0.55 s (17 frames).
- **stagger**: words 70 ms apart (2 frames), list rows 3 frames apart.
- **arrival**: titles land and are dead still for the rest of their frame. Nothing breathes,
  floats or pulses. No title keeps moving after it lands.
- **title entrances** — vary them, never one move for all:
  1. the hero number counts up (1.2 s) then holds;
  2. a title arrives per word, blur 6px → 0, no translate (2 frames apart);
  3. a title wipes in behind a 2px bar rule that draws left → right.

## SHOTS
1. **0.0–3.0s · The ink band.** Full-bleed the site's own verdict band on its ink ground,
   cropped so "The Final" and "Aiming for A+" sit left and "143" right. A hairline rule
   draws under it. The cursor enters from bottom-right, growing 0 → 5% width. Reads: the
   number is already there, and it is a final-exam number. Sound: bed enters on its first
   bar, low and building.
2. **3.0–6.5s · The sheet.** Pull back 1.0 → 0.62 to reveal the whole sheet: ink band, six
   ruled rows, the four figures. Reads: this is a sheet you fill in. Sound: bed's pulse
   arrives.
3. **6.5–13.0s · Six fields.** Push in on the six input rows. The cursor clicks each field
   and a number types in, left to right, 3 frames apart. With each field the "Achieved so
   far" figure in the volt cell rises: 25.50 → 48.00 → 48.00 → 78.00 → 91.50 → 97.00 — the
   site's own scenario (Class tests 17 / 15 / 12, Performance 12, Attendance 13, Mid term
   24, best two weighted 1.5). The band above updates as it goes. Reads: you put your marks
   in, it counts. Sound: one soft click per field, six clicks, dry and close.
4. **13.0–17.0s · The answer.** The band answers: "143", the status flips to "Aiming for
   A+", and the message reads "You need 143 marks in the Final." The number takes 40% of the
   frame height. Push in 1.0 → 1.18 over 17 frames. Reads: 143 is what the Final must be.
   Sound: a low settle as the number lands, on the bar.
5. **17.0–21.5s · The rules.** A hard cut inside the scene (this is a punch-in, not a world
   change). The sheet's "Six marks on the sheet" table, seen flat: Class tests 3 × 20, Mid
   term 30, Attendance 15, Performance 15, Final 180. Rows reveal top to bottom, 3 frames
   apart, each row's rule drawing left → right. The Final row is the bar-rule row.
   Reads: the Final is what is left. Sound: the bed continues; a tick per row.
6. **21.5–25.0s · The ladder.** The grade ladder on the ink ground: A+ 80% 4.00 lit in volt
   at the top-left, then A, A-, B+, B, B-, C+, C, D, F*. The volt cell holds. Reads: A+ is
   80% of the semester, worth 4.00. Sound: the bed opens out.
7. **25.0–30.0s · The end card.** The site's own night photograph fills the frame, lit only
   by the campus lamps and the dusk sky. The wordmark "MIST GRADE CALCULATOR" is carried in
   on the site's own line — it is drawn as type, not as a logo file, because the site has no
   logo image — and the address "mistgc.vercel.app" lands under it in volt. Then the site's
   own last line holds: "The sheet above is the part you can still change." Sound: the bed
   resolves and fades over 1.5 s.

## BANNED
- a dark navy void with small elements floating in it
- the retired graph-paper grid, the pixel-glitch column and the QR block
- a zero where the site shows an empty slot; an unearned number is a slot, not a figure
- a number the site does not state; a mockup of the product
- glow, bloom, neon, lens flares, glowing orbs, floating particles
- purple or blue gradients, mesh gradients, glass cards, frosted panels
- cream/off-white ground with a serif display, italic accent words, numbered "01 / 02"
  labels, small monospace caps labels, pill-shaped chips and buttons
- everything centred; everything fading in at once; every element fading and sliding up
- text that moves while it is read; titles that keep drifting after they land
- corner labels, frame borders, corner brackets, HUD readouts as decoration
- three cards in a row, KPI grids, a title over a dimmed screenshot
- the logo docked in a corner
- breathing, floating or pulsing loops; bounce on UI; click rings
- every scene entering the same way
- a made-up dashboard, an invented screen, a number the site does not state

## QA
- **Frame 1 @ 1.5s**: the number reads 143, and the frame is the site's own ink band.
- **Frame 3 @ 10s**: all six fields hold real marks and the volt cell reads 97.00.
- **Frame 4 @ 15s**: the number reads 143 and the status reads Aiming for A+.
- **Frame 5 @ 19s**: the table's last row is Final, and the bar rule sits under it.
- **Frame 6 @ 23s**: exactly one cell is volt, and it is A+.
- **Frame 7 @ 28s**: the address reads mistgc.vercel.app and the wordmark is type, not an image.
- **Every frame**: no text smaller than 28px at 1080p; nothing outside the 90% action-safe box.
