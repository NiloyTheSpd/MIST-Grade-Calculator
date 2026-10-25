#!/usr/bin/env python3
"""The seven film frames, in the site's own night."""
import sys
import pathlib

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from build_frames import write  # noqa: E402

# ---------------------------------------------------------------- Frame 1 ----
# The site's own verdict band, full-bleed on the ink ground.
F1_CSS = """
        /* The band is the site's own card: a raised navy rectangle with a
           hairline edge and the lime top bar the site puts on its photo. */
        #root .band {
          position: absolute;
          left: 0;
          top: 0;
          width: 1920px;
          height: 1080px;
          background-color: #050a30;
          overflow: hidden;
        }

        #root .band__card {
          position: absolute;
          left: 96px;
          top: 150px;
          width: 1728px;
          height: 780px;
          background-color: #0d1550;
          border: 1px solid rgba(255, 255, 255, 0.16);
        }

        #root .band__bar {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 4px;
          background-color: #c8e91c;
          transform-origin: 0 50%;
          transform: scaleX(0);
        }

        #root .band__label {
          position: absolute;
          left: 72px;
          top: 92px;
          font-family: 'Figtree', system-ui, sans-serif;
          font-size: 30px;
          font-weight: 400;
          color: #a3abd3;
          letter-spacing: 0;
        }

        #root .band__status {
          position: absolute;
          left: 72px;
          top: 148px;
          font-family: 'Saira Condensed', 'Arial Narrow', sans-serif;
          font-weight: 800;
          font-size: 84px;
          line-height: 0.9;
          letter-spacing: -0.005em;
          color: #f2f5ff;
          text-transform: uppercase;
        }

        #root .band__rule {
          position: absolute;
          left: 72px;
          top: 264px;
          width: 1584px;
          height: 1px;
          background-color: rgba(255, 255, 255, 0.16);
          transform-origin: 0 50%;
          transform: scaleX(0);
        }

        #root .band__message {
          position: absolute;
          left: 72px;
          top: 296px;
          font-family: 'Figtree', system-ui, sans-serif;
          font-size: 34px;
          font-weight: 400;
          color: #a3abd3;
          opacity: 0;
        }

        #root .band__figure {
          position: absolute;
          right: 72px;
          top: 96px;
          font-family: 'Saira Condensed', 'Arial Narrow', sans-serif;
          font-weight: 800;
          font-size: 460px;
          line-height: 0.86;
          letter-spacing: -0.02em;
          color: #f2f5ff;
          font-variant-numeric: tabular-nums;
        }

        #root .band__chrome {
          position: absolute;
          left: 96px;
          bottom: 74px;
          font-size: 28px;
        }

        /* The cursor: the site's paper-white arrow, square tail. */
        #root .cursor {
          position: absolute;
          left: 1560px;
          top: 900px;
          width: 96px;
          height: 96px;
          opacity: 0;
        }
"""

F1_BODY = """      <div
        id="root"
        data-composition-id="01-ink-band"
        data-start="0"
        data-width="1920"
        data-height="1080"
        data-duration="3"
      >
        <div class="clip" id="s01-scene" data-start="0" data-duration="3" data-track-index="0">
          <div class="stage" id="s01-stage">
            <div class="band">
              <div class="band__card">
                <div class="band__bar" id="s01-bar"></div>
                <div class="band__label">The Final</div>
                <div class="band__status" id="s01-status">Aiming for A+</div>
                <div class="band__rule" id="s01-rule"></div>
                <div class="band__message" id="s01-message">
                  You need 143 marks in the Final.
                </div>
                <div class="band__figure" id="s01-figure">0</div>
              </div>
            </div>
            <div class="band__chrome chrome">MIST GRADE CALCULATOR</div>
            <svg
              class="cursor"
              id="s01-cursor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M3 2 L3 20 L8.5 15.5 L11.5 22 L15 20.5 L12 14 L19 14 Z" fill="#f2f5ff" />
            </svg>
          </div>
        </div>
      </div>
"""

F1_SCRIPT = """          const bar = document.getElementById("s01-bar");
          const rule = document.getElementById("s01-rule");
          const status = document.getElementById("s01-status");
          const message = document.getElementById("s01-message");
          const figure = document.getElementById("s01-figure");
          const cursor = document.getElementById("s01-cursor");

          const tl = gsap.timeline({ paused: true });

          /* The lime bar draws itself across the top of the band. */
          tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 12 / 30, ease: "power4.out" }, 0);

          /* The rule under the status draws itself. */
          tl.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 12 / 30, ease: "power4.out" }, 6 / 30);

          /* The status arrives per word, blur only, no translate. */
          tl.fromTo(
            status,
            { opacity: 0, filter: "blur(8px)" },
            { opacity: 1, filter: "blur(0px)", duration: 10 / 30, ease: "power4.out" },
            9 / 30
          );

          /* The number counts up to the site's own figure and settles. */
          const counter = { n: 0 };
          tl.to(
            counter,
            {
              n: 143,
              duration: 18 / 30,
              ease: "power2.out",
              onUpdate: () => {
                figure.textContent = String(Math.round(counter.n));
              },
            },
            12 / 30
          );

          /* The sentence comes in under it, early enough to be read at
             pace before the frame cuts. */
          tl.fromTo(
            message,
            { opacity: 0 },
            { opacity: 1, duration: 10 / 30, ease: "power2.out" },
            24 / 30
          );

          /* The cursor enters from the bottom right and grows to 5% of the
             frame width, then holds over the first row. */
          tl.fromTo(
            cursor,
            { opacity: 0, x: 300, y: 300, scale: 0.2 },
            { opacity: 1, x: 0, y: 0, scale: 1, duration: 17 / 30, ease: "power3.out" },
            66 / 30
          );
"""

# ---------------------------------------------------------------- Frame 2 ----
# The whole semester sheet, revealed by one camera pull-back.
F2_CSS = """
        /* The site's own sheet, cropped to the card. Measured on
           assets/photos/03-sheet.png (3840 x 2556, captured at 2x):
             card          x 742..3097, y 538..2314
             figures row   y 1914..2121
           The crop keeps the card's own edge. The volt "Reset all" button
           sits at the card's foot; the camera settles above it, so exactly
           one volt element — the achieved-so-far cell — is on screen. */
        #root .sheet {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 2355px;
          height: 1776px;
          margin-left: -1177.5px;
          margin-top: -888px;
          overflow: hidden;
        }

        #root .sheet img {
          position: absolute;
          left: -742px;
          top: -538px;
          width: 3840px;
          height: 2556px;
          user-select: none;
          -webkit-user-drag: none;
        }

        #root .camera {
          position: absolute;
          inset: 0;
          transform-origin: 50% 46%;
          will-change: transform;
        }

        #root .tag {
          position: absolute;
          left: 96px;
          top: 92px;
          font-size: 28px;
        }
"""

F2_BODY = """      <div
        id="root"
        data-composition-id="02-the-sheet"
        data-start="0"
        data-width="1920"
        data-height="1080"
        data-duration="3.5"
      >
        <div class="scene">
          <div
            id="s02-camera"
            class="camera clip"
            data-start="0"
            data-duration="3.5"
            data-track-index="0"
            data-layout-allow-overflow
          >
            <div class="sheet" data-layout-allow-overflow>
              <img
                src="assets/photos/03-sheet.png"
                width="3840"
                height="2556"
                alt="The MIST Grade Calculator semester sheet on a navy ground: the semester sheet head, the 3 credit toggle, the target grade select reading A+ 4.00, the verdict band reading Aiming for A+ and 143, six ruled input rows for Class Test 1 to 3, Performance, Attendance and Mid Term, and a four-cell figures row where 97.00 Achieved so far is the volt cell."
              />
            </div>
          </div>
        </div>
        <div class="tag chrome">MIST GRADE CALCULATOR</div>
      </div>
"""

F2_SCRIPT = """          const camera = document.getElementById("s02-camera");

          /* One writer composes the transform, so any seek reproduces the
             exact mid-move pose. */
          const cam = { scale: 1.55 };

          function applyCamera() {
            camera.style.transform = "scale(" + cam.scale + ")";
          }

          applyCamera();

          const tl = gsap.timeline({ paused: true });

          /* One continuous move: pull back to reveal the whole sheet. */
          tl.fromTo(
            cam,
            { scale: 1.55 },
            {
              scale: 1,
              duration: 17 / 30,
              ease: "power2.inOut",
              onUpdate: applyCamera,
            },
            0
          );
"""

# ---------------------------------------------------------------- Frame 3 ----
# Push in on the six input rows; the cursor fills each one.
F3_CSS = """
        /* The six rows, rebuilt live as the site's own ledger: a label on
           the left, a boxed field on the right, a hairline between each.
           The site's plate is the reference; the type is rebuilt so it stays
           crisp at the film's push-in and the cursor can actually click. */
        #root .rows {
          position: absolute;
          left: 120px;
          top: 344px;
          width: 1680px;
        }

        #root .row {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 260px;
          align-items: center;
          gap: 40px;
          height: 106px;
          border-top: 1px solid rgba(255, 255, 255, 0.16);
        }

        #root .row__label {
          font-family: 'Figtree', system-ui, sans-serif;
          font-size: 38px;
          font-weight: 400;
          color: #f2f5ff;
        }

        #root .row__field {
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding-right: 26px;
          background-color: #050a30;
          border: 1px solid rgba(255, 255, 255, 0.16);
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 32px;
          font-weight: 400;
          color: #f2f5ff;
          font-variant-numeric: tabular-nums;
        }

        /* The band above, redrawn live so the figure can climb with the
           fields. It is the site's own card, not a screenshot, and it stays
           outside the camera so the numbers stay legible while the rows
           move. */
        #root .band {
          position: absolute;
          left: 96px;
          top: 64px;
          width: 1728px;
          height: 236px;
          background-color: #0d1550;
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-top: 3px solid #c8e91c;
        }

        #root .band__label {
          position: absolute;
          left: 44px;
          top: 30px;
          font-family: 'Figtree', system-ui, sans-serif;
          font-size: 28px;
          color: #a3abd3;
        }

        #root .band__status {
          position: absolute;
          left: 44px;
          top: 72px;
          font-family: 'Saira Condensed', 'Arial Narrow', sans-serif;
          font-weight: 800;
          font-size: 58px;
          line-height: 0.9;
          color: #f2f5ff;
          text-transform: uppercase;
        }

        #root .band__message {
          position: absolute;
          left: 44px;
          top: 160px;
          font-family: 'Figtree', system-ui, sans-serif;
          font-size: 28px;
          color: #a3abd3;
        }

        /* The achieved figure. One number, right-aligned in the band. It
           is tweened as a decimal string with a modifier that keeps two
           places, so the figure reads 25.50, 48.00, 97.00 as it climbs —
           the values the site's own figures row shows. */
        #root .band__figure {
          position: absolute;
          right: 44px;
          top: 18px;
          font-family: 'Saira Condensed', 'Arial Narrow', sans-serif;
          font-weight: 800;
          font-size: 132px;
          line-height: 0.86;
          letter-spacing: -0.02em;
          color: #f2f5ff;
          font-variant-numeric: tabular-nums;
        }

        /* The cursor: paper white, square tail. */
        #root .cursor {
          position: absolute;
          width: 96px;
          height: 96px;
          opacity: 0;
        }

        #root .caret {
          position: absolute;
          left: 1778px;
          top: 0;
          width: 3px;
          height: 44px;
          background-color: #c8e91c;
          opacity: 0;
        }
"""

F3_BODY = """      <div
        id="root"
        data-composition-id="03-six-fields"
        data-start="0"
        data-width="1920"
        data-height="1080"
        data-duration="6.5"
      >
        <div class="scene" id="s03-scene">
          <div
            id="s03-camera"
            class="camera clip"
            data-start="0"
            data-duration="6.5"
            data-track-index="0"
            data-layout-allow-overflow
          >
            <div class="band">
              <div class="band__label">The Final</div>
              <div class="band__status">Aiming for A+</div>
              <div class="band__message">
                You need <span id="s03-required">215</span> marks in the Final.
              </div>
              <div class="band__figure" id="s03-figure">0</div>
            </div>

            <div class="rows" id="s03-rows">
              <div class="row">
                <div class="row__label">Class Test 1</div>
                <div class="row__field" id="s03-f0">0</div>
              </div>
              <div class="row">
                <div class="row__label">Class Test 2</div>
                <div class="row__field" id="s03-f1">0</div>
              </div>
              <div class="row">
                <div class="row__label">Class Test 3</div>
                <div class="row__field" id="s03-f2">0</div>
              </div>
              <div class="row">
                <div class="row__label">Performance</div>
                <div class="row__field" id="s03-f3">0</div>
              </div>
              <div class="row">
                <div class="row__label">Attendance</div>
                <div class="row__field" id="s03-f4">0</div>
              </div>
              <div class="row">
                <div class="row__label">Mid Term</div>
                <div class="row__field" id="s03-f5">0</div>
              </div>
            </div>

            <svg class="cursor" id="s03-cursor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 2 L3 20 L8.5 15.5 L11.5 22 L15 20.5 L12 14 L19 14 Z" fill="#f2f5ff" />
            </svg>
            <div class="caret" id="s03-caret"></div>
          </div>
        </div>
      </div>
"""

F3_SCRIPT = """          const camera = document.getElementById("s03-camera");
          const figure = document.getElementById("s03-figure");
          const required = document.getElementById("s03-required");
          const cursor = document.getElementById("s03-cursor");
          const caret = document.getElementById("s03-caret");
          const fields = Array.from(document.querySelectorAll("#s03-scene .row__field"));

          const cam = { scale: 1 };

          function applyCamera() {
            camera.style.transform = "scale(" + cam.scale + ")";
          }

          applyCamera();

          const tl = gsap.timeline({ paused: true });

          /* A slow drift down the six rows over the frame. Every label
             stays in frame: this is the frame that has to be read, and the
             cursor and the caret carry the motion. */
          tl.fromTo(
            cam,
            { scale: 1 },
            {
              scale: 1.04,
              duration: 6.5,
              ease: "power1.out",
              onUpdate: applyCamera,
            },
            0
          );

          /* The site's own scenario. Each mark lands in a field and the
             achieved figure climbs with it.

             Everything below is a tweened property, never a callback. The
             host renders this composition by seeking its timeline with
             events suppressed, so onStart, onUpdate and tl.call never fire
             on a seek: a frame built out of callbacks renders blank. GSAP
             still writes tweened values on a seek, so each number is a
             textContent tween and each change is a property tween. */
          const marks = [
            { value: "17", total: "25.50", required: 215 },
            { value: "15", total: "48.00", required: 192 },
            { value: "12", total: "48.00", required: 192 },
            { value: "12", total: "78.00", required: 162 },
            { value: "13", total: "91.50", required: 149 },
            { value: "24", total: "97.00", required: 143 }
          ];

          /* Each mark lands fifteen frames after the last, so the six land
             over the three seconds the frame spends on the rows. */
          const STEP = 15 / 30;
          const START = 18 / 30;
          /* The cursor reaches the field, the caret blinks, the number
             counts up, and the figure follows it. */
          const MOVE = 9 / 30;
          const CARET = 9 / 30;
          const COUNT = 11 / 30;
          const CLIMB = 8 / 30;

          /* Whole numbers, the way a mark is written. */
          const whole = {
            modifiers: {
              textContent: (value) => String(Math.round(parseFloat(value)))
            }
          };

          /* The achieved figure keeps the two places the site's own
             figures row shows. */
          const cents = {
            modifiers: {
              textContent: (value) => {
                const n = parseFloat(value);
                return Number.isFinite(n) ? n.toFixed(2) : value;
              }
            }
          };

          /* The cursor arrives over the first field. */
          tl.fromTo(
            cursor,
            { opacity: 0, x: 2400, y: 200, scale: 0.4 },
            { opacity: 1, x: 1834, y: 400, scale: 1, duration: 12 / 30, ease: "power3.out" },
            6 / 30
          );

          marks.forEach((mark, index) => {
            const at = START + index * STEP;
            const row = fields[index];
            const rowTop = 344 + index * 106;

            /* The cursor moves to the field. */
            tl.to(
              cursor,
              { x: 1786, y: rowTop + 56, duration: MOVE, ease: "power2.inOut" },
              at
            );

            /* The caret stands in the field while the number counts up,
               and lifts out when the figure has moved on. */
            tl.fromTo(
              caret,
              { opacity: 0, y: rowTop + 36 },
              { opacity: 1, y: rowTop + 36, duration: 2 / 30, ease: "none" },
              at + CARET
            );
            tl.to(caret, { opacity: 0, duration: 3 / 30, ease: "none" }, at + COUNT + CLIMB);

            /* The mark counts up into the field. */
            tl.to(
              row,
              Object.assign({ textContent: mark.value, duration: CLIMB, ease: "power1.out" }, whole),
              at + COUNT
            );

            /* The achieved figure climbs to the new total. */
            tl.to(
              figure,
              Object.assign({ textContent: mark.total, duration: CLIMB, ease: "power1.out" }, cents),
              at + COUNT
            );

            /* The marks still needed in the Final fall as the total
               rises. */
            tl.to(
              required,
              Object.assign({ textContent: String(mark.required), duration: CLIMB, ease: "power1.out" }, whole),
              at + COUNT
            );
          });
"""

if __name__ == "__main__":
    write("01-ink-band", "01 — The ink band", 3, F1_CSS, F1_BODY, F1_SCRIPT)
    write("02-the-sheet", "02 — The sheet", 3.5, F2_CSS, F2_BODY, F2_SCRIPT)
    write("03-six-fields", "03 — Six fields", 6.5, F3_CSS, F3_BODY, F3_SCRIPT)
