#!/usr/bin/env python3
"""Frames 4 to 7: the answer, the rules, the ladder, the end card."""
import sys
import pathlib

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from build_frames import write  # noqa: E402

# ---------------------------------------------------------------- Frame 4 ----
# The answer. The number takes 40% of the frame and settles.
F4_CSS = """
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
        }

        #root .band__label {
          position: absolute;
          left: 72px;
          top: 92px;
          font-family: 'Figtree', system-ui, sans-serif;
          font-size: 30px;
          color: #a3abd3;
        }

        #root .band__status {
          position: absolute;
          left: 72px;
          top: 152px;
          font-family: 'Saira Condensed', 'Arial Narrow', sans-serif;
          font-weight: 800;
          font-size: 92px;
          line-height: 0.9;
          color: #f2f5ff;
          text-transform: uppercase;
          opacity: 0;
        }

        #root .band__message {
          position: absolute;
          left: 72px;
          top: 286px;
          font-family: 'Figtree', system-ui, sans-serif;
          font-size: 36px;
          color: #f2f5ff;
          opacity: 0;
        }

        #root .band__figure {
          position: absolute;
          right: 72px;
          top: 92px;
          font-family: 'Saira Condensed', 'Arial Narrow', sans-serif;
          font-weight: 800;
          font-size: 460px;
          line-height: 0.86;
          letter-spacing: -0.02em;
          color: #c8e91c;
          font-variant-numeric: tabular-nums;
        }

        #root .band__chrome {
          position: absolute;
          left: 96px;
          bottom: 74px;
          font-size: 28px;
        }

        #root .camera {
          position: absolute;
          inset: 0;
          transform-origin: 76% 50%;
          will-change: transform;
        }
"""

F4_BODY = """      <div
        id="root"
        data-composition-id="04-the-answer"
        data-start="0"
        data-width="1920"
        data-height="1080"
        data-duration="4"
      >
        <div class="clip" id="s04-scene" data-start="0" data-duration="4" data-track-index="0">
          <div class="stage" id="s04-camera">
            <div class="band">
              <div class="band__card">
                <div class="band__bar"></div>
                <div class="band__label">The Final</div>
                <div class="band__status" id="s04-status">Aiming for A+</div>
                <div class="band__message" id="s04-message">
                  You need 143 marks in the Final.
                </div>
                <div class="band__figure" id="s04-figure">0</div>
              </div>
            </div>
          </div>
        </div>
        <div class="band__chrome chrome">MIST GRADE CALCULATOR</div>
      </div>
"""

F4_SCRIPT = """          const camera = document.getElementById("s04-camera");
          const status = document.getElementById("s04-status");
          const message = document.getElementById("s04-message");
          const figure = document.getElementById("s04-figure");

          const cam = { scale: 1 };

          function applyCamera() {
            camera.style.transform = "scale(" + cam.scale + ")";
          }

          applyCamera();

          const tl = gsap.timeline({ paused: true });

          /* The status arrives per word, blur only. */
          tl.fromTo(
            status,
            { opacity: 0, filter: "blur(8px)" },
            { opacity: 1, filter: "blur(0px)", duration: 10 / 30, ease: "power4.out" },
            6 / 30
          );

          /* The number counts up to 143 and settles. */
          const counter = { n: 0 };
          tl.to(
            counter,
            {
              n: 143,
              duration: 24 / 30,
              ease: "power2.out",
              onUpdate: () => {
                figure.textContent = String(Math.round(counter.n));
              },
            },
            12 / 30
          );

          /* The site's own sentence lands under it. */
          tl.fromTo(
            message,
            { opacity: 0 },
            { opacity: 1, duration: 10 / 30, ease: "power2.out" },
            42 / 30
          );

          /* Push in on the number over 17 frames, then hold dead still. */
          tl.fromTo(
            cam,
            { scale: 1 },
            {
              scale: 1.12,
              duration: 17 / 30,
              ease: "power2.inOut",
              onUpdate: applyCamera,
            },
            0
          );
"""

# ---------------------------------------------------------------- Frame 5 ----
# The rules. The sheet's six rows and their maxima, as the site's ledger.
F5_CSS = """
        #root .ledger {
          position: absolute;
          left: 96px;
          top: 92px;
          width: 1728px;
          background-color: #0d1550;
          border: 1px solid rgba(255, 255, 255, 0.16);
        }

        #root .ledger__head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          padding: 34px 48px 24px;
        }

        #root .ledger__title {
          font-family: 'Saira Condensed', 'Arial Narrow', sans-serif;
          font-weight: 800;
          font-size: 74px;
          line-height: 0.9;
          color: #f2f5ff;
          text-transform: uppercase;
        }

        #root .ledger__sub {
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 30px;
          font-weight: 400;
          letter-spacing: 0.06em;
          color: #a3abd3;
        }

        #root .row {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: baseline;
          gap: 40px;
          padding: 19px 48px 17px;
          border-top: 1px solid rgba(255, 255, 255, 0.16);
          position: relative;
          overflow: hidden;
        }

        #root .row__rule {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 1px;
          background-color: rgba(255, 255, 255, 0.28);
          transform-origin: 0 50%;
          transform: scaleX(0);
        }

        #root .row__name {
          font-family: 'Figtree', system-ui, sans-serif;
          font-size: 38px;
          font-weight: 400;
          color: #f2f5ff;
          opacity: 0;
        }

        #root .row__max {
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 34px;
          font-weight: 400;
          color: #a3abd3;
          font-variant-numeric: tabular-nums;
          opacity: 0;
        }

        /* The Final row is the heaviest rule on the sheet. */
        #root .row--final {
          border-top: 2px solid rgba(255, 255, 255, 0.28);
        }

        #root .row--final .row__name {
          font-family: 'Saira Condensed', 'Arial Narrow', sans-serif;
          font-weight: 800;
          font-size: 52px;
          text-transform: uppercase;
          color: #f2f5ff;
        }

        #root .row--final .row__rule {
          height: 2px;
          background-color: rgba(255, 255, 255, 0.28);
        }

        #root .ledger__foot {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          padding: 22px 48px 26px;
          border-top: 1px solid rgba(255, 255, 255, 0.16);
        }

        #root .ledger__foot-label {
          font-family: 'Figtree', system-ui, sans-serif;
          font-size: 32px;
          color: #a3abd3;
          opacity: 0;
        }

        #root .ledger__foot-value {
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 34px;
          color: #f2f5ff;
          font-variant-numeric: tabular-nums;
          opacity: 0;
        }
"""

F5_BODY = """      <div
        id="root"
        data-composition-id="05-the-rules"
        data-start="0"
        data-width="1920"
        data-height="1080"
        data-duration="4.5"
      >
        <div class="clip" id="s05-scene" data-start="0" data-duration="4.5" data-track-index="0">
          <div class="stage" id="s05-stage">
            <div class="ledger">
              <div class="ledger__head">
                <div class="ledger__title" id="s05-title">Six marks on the sheet</div>
                <div class="ledger__sub">MAX</div>
              </div>

              <div class="row">
                <div class="row__rule"></div>
                <div class="row__name">Class Test 1</div>
                <div class="row__max">20</div>
              </div>
              <div class="row">
                <div class="row__rule"></div>
                <div class="row__name">Class Test 2</div>
                <div class="row__max">20</div>
              </div>
              <div class="row">
                <div class="row__rule"></div>
                <div class="row__name">Class Test 3</div>
                <div class="row__max">20</div>
              </div>
              <div class="row">
                <div class="row__rule"></div>
                <div class="row__name">Mid term</div>
                <div class="row__max">30</div>
              </div>
              <div class="row">
                <div class="row__rule"></div>
                <div class="row__name">Attendance</div>
                <div class="row__max">15</div>
              </div>
              <div class="row">
                <div class="row__rule"></div>
                <div class="row__name">Performance</div>
                <div class="row__max">15</div>
              </div>
              <div class="row row--final">
                <div class="row__rule"></div>
                <div class="row__name">Final</div>
                <div class="row__max">180</div>
              </div>

              <div class="ledger__foot">
                <div class="ledger__foot-label" id="s05-foot-label">
                  Semester total
                </div>
                <div class="ledger__foot-value" id="s05-foot-value">300</div>
              </div>
            </div>
          </div>
        </div>
      </div>
"""

F5_SCRIPT = """          const title = document.getElementById("s05-title");
          const rows = Array.from(document.querySelectorAll("#s05-scene .row"));
          const footLabel = document.getElementById("s05-foot-label");
          const footValue = document.getElementById("s05-foot-value");

          const tl = gsap.timeline({ paused: true });

          /* The title arrives per word, blur only, no translate. */
          tl.fromTo(
            title,
            { opacity: 0, filter: "blur(10px)" },
            { opacity: 1, filter: "blur(0px)", duration: 12 / 30, ease: "power4.out" },
            6 / 30
          );

          /* Rows reveal top to bottom, 3 frames apart, each row's hairline
             drawing left to right. */
          rows.forEach((row, index) => {
            const at = (42 + index * 9) / 30;
            const rule = row.querySelector(".row__rule");
            const name = row.querySelector(".row__name");
            const max = row.querySelector(".row__max");

            tl.fromTo(
              rule,
              { scaleX: 0 },
              { scaleX: 1, duration: 8 / 30, ease: "power3.out" },
              at
            );
            tl.fromTo(name, { opacity: 0 }, { opacity: 1, duration: 6 / 30, ease: "none" }, at);
            tl.fromTo(max, { opacity: 0 }, { opacity: 1, duration: 6 / 30, ease: "none" }, at);
          });

          /* The foot lands last: the semester total. */
          tl.fromTo(
            footLabel,
            { opacity: 0 },
            { opacity: 1, duration: 8 / 30, ease: "none" },
            108 / 30
          );
          tl.fromTo(
            footValue,
            { opacity: 0 },
            { opacity: 1, duration: 8 / 30, ease: "none" },
            108 / 30
          );
"""

# ---------------------------------------------------------------- Frame 6 ----
# The ladder. Ten rungs, one volt: A+, top-left.
F6_CSS = """
        #root .lad {
          position: absolute;
          left: 96px;
          top: 306px;
          width: 1728px;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 4px;
          transform-origin: 0 0;
        }

        #root .rung {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          min-height: 130px;
          padding: 22px 30px;
          background-color: #0d1550;
          border: 1px solid rgba(255, 255, 255, 0.16);
          opacity: 0;
        }

        #root .rung__grade {
          font-family: 'Saira Condensed', 'Arial Narrow', sans-serif;
          font-weight: 800;
          font-size: 56px;
          line-height: 1;
          color: #f2f5ff;
          text-transform: uppercase;
        }

        #root .rung__figures {
          display: flex;
          align-items: baseline;
          gap: 18px;
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 28px;
          font-weight: 400;
          color: #a3abd3;
          font-variant-numeric: tabular-nums;
        }

        /* The one volt rung: A+, top-left. A fill, not a stroke. */
        #root .rung--volt {
          background-color: #c8e91c;
          border-color: #c8e91c;
        }

        #root .rung--volt .rung__grade {
          color: #050a30;
        }

        #root .rung--volt .rung__figures {
          color: #050a30;
        }

        #root .lad__head {
          position: absolute;
          left: 96px;
          top: 92px;
          font-size: 28px;
        }

        #root .lad__title {
          position: absolute;
          left: 96px;
          top: 156px;
          font-family: 'Saira Condensed', 'Arial Narrow', sans-serif;
          font-weight: 800;
          font-size: 78px;
          line-height: 0.9;
          color: #f2f5ff;
          text-transform: uppercase;
          opacity: 0;
        }

"""

F6_BODY = """      <div
        id="root"
        data-composition-id="06-the-ladder"
        data-start="0"
        data-width="1920"
        data-height="1080"
        data-duration="3.5"
      >
        <div class="clip" id="s06-scene" data-start="0" data-duration="3.5" data-track-index="0">
          <div class="stage" id="s06-stage">
            <div class="lad__head chrome">MIST GRADE CALCULATOR</div>
            <div class="lad__title" id="s06-title">What each grade takes</div>

            <div class="lad" id="s06-lad">
              <div class="rung rung--volt">
                <div class="rung__grade">A+</div>
                <div class="rung__figures"><span>80%</span><span>4.00</span></div>
              </div>
              <div class="rung">
                <div class="rung__grade">A</div>
                <div class="rung__figures"><span>75%</span><span>3.75</span></div>
              </div>
              <div class="rung">
                <div class="rung__grade">A-</div>
                <div class="rung__figures"><span>70%</span><span>3.50</span></div>
              </div>
              <div class="rung">
                <div class="rung__grade">B+</div>
                <div class="rung__figures"><span>65%</span><span>3.25</span></div>
              </div>
              <div class="rung">
                <div class="rung__grade">B</div>
                <div class="rung__figures"><span>60%</span><span>3.00</span></div>
              </div>
              <div class="rung">
                <div class="rung__grade">B-</div>
                <div class="rung__figures"><span>55%</span><span>2.75</span></div>
              </div>
              <div class="rung">
                <div class="rung__grade">C+</div>
                <div class="rung__figures"><span>50%</span><span>2.50</span></div>
              </div>
              <div class="rung">
                <div class="rung__grade">C</div>
                <div class="rung__figures"><span>45%</span><span>2.25</span></div>
              </div>
              <div class="rung">
                <div class="rung__grade">D</div>
                <div class="rung__figures"><span>40%</span><span>2.00</span></div>
              </div>
              <div class="rung">
                <div class="rung__grade">F*</div>
                <div class="rung__figures"><span>0%</span><span>0.00</span></div>
              </div>
            </div>

          </div>
        </div>
      </div>
"""

F6_SCRIPT = """          const title = document.getElementById("s06-title");
          const lad = document.getElementById("s06-lad");
          const rungs = Array.from(document.querySelectorAll("#s06-scene .rung"));

          const tl = gsap.timeline({ paused: true });

          /* The ladder rises into place over 12 frames. */
          tl.fromTo(
            lad,
            { y: 44, opacity: 0 },
            { y: 0, opacity: 1, duration: 12 / 30, ease: "power2.inOut" },
            0
          );

          /* The title lands and holds. */
          tl.fromTo(
            title,
            { opacity: 0, filter: "blur(10px)" },
            { opacity: 1, filter: "blur(0px)", duration: 12 / 30, ease: "power4.out" },
            6 / 30
          );

          /* The rungs settle in, 2 frames apart, top to bottom. */
          rungs.forEach((rung, index) => {
            tl.fromTo(
              rung,
              { opacity: 0, y: 16 },
              { opacity: 1, y: 0, duration: 8 / 30, ease: "power2.out" },
              (24 + index * 2) / 30
            );
          });

          /* The volt rung lights last, so the eye lands on A+. */
          tl.fromTo(
            rungs[0],
            { boxShadow: "inset 0 0 0 0 rgba(200,233,28,0)" },
            { boxShadow: "inset 0 0 0 0 rgba(200,233,28,0)", duration: 1 / 30 },
            44 / 30
          );

"""

# ---------------------------------------------------------------- Frame 7 ----
# The end card: the site's own night photograph, the wordmark, the address.
F7_CSS = """
        #root .photo {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        #root .photo img {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 1920px;
          height: 2078px;
          transform: translate(-50%, -50%);
          object-fit: cover;
          user-select: none;
          -webkit-user-drag: none;
        }

        /* The ink scrim, so the type sits on the ground the site uses.
           The night photograph is already dark; the scrim only has to
           hold the type off it, not hide the campus behind it. */
        #root .scrim {
          position: absolute;
          inset: 0;
          background-color: rgba(5, 10, 48, 0.52);
        }

        #root .scrim--band {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 720px;
          background: linear-gradient(
            to top,
            rgba(5, 10, 48, 0.95) 0%,
            rgba(5, 10, 48, 0.72) 46%,
            rgba(5, 10, 48, 0) 100%
          );
        }

        #root .mark {
          position: absolute;
          left: 96px;
          bottom: 348px;
          font-family: 'Saira Condensed', 'Arial Narrow', sans-serif;
          font-weight: 800;
          font-size: 116px;
          line-height: 0.9;
          letter-spacing: -0.012em;
          color: #f2f5ff;
          text-transform: uppercase;
          opacity: 0;
        }

        #root .rule {
          position: absolute;
          left: 96px;
          bottom: 318px;
          width: 1728px;
          height: 1px;
          background-color: rgba(255, 255, 255, 0.16);
          transform-origin: 0 50%;
          transform: scaleX(0);
        }

        #root .address {
          position: absolute;
          left: 96px;
          bottom: 214px;
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 44px;
          font-weight: 400;
          letter-spacing: 0.02em;
          color: #c8e91c;
          opacity: 0;
        }

        #root .last {
          position: absolute;
          left: 96px;
          bottom: 118px;
          font-family: 'Figtree', system-ui, sans-serif;
          font-size: 34px;
          color: #a3abd3;
          opacity: 0;
        }

        #root .frame {
          position: absolute;
          inset: 0;
          border: 1px solid rgba(255, 255, 255, 0.09);
        }
"""

F7_BODY = """      <div
        id="root"
        data-composition-id="07-end-card"
        data-start="0"
        data-width="1920"
        data-height="1080"
        data-duration="5"
      >
        <div class="clip" id="s07-scene" data-start="0" data-duration="5" data-track-index="0">
          <div class="stage" id="s07-stage">
            <div class="photo">
              <img
                src="assets/photos/campus-night.jpg"
                width="960"
                height="1280"
                alt="The MIST campus at night: two tall blocks seen from below, a sky-bridge between them with a metal lattice, and the dusk sky beyond, with a cloud low over the horizon and the moon rising."
              />
            </div>
            <div class="scrim"></div>
            <div class="scrim--band"></div>
            <div class="frame"></div>

            <div class="mark" id="s07-mark">MIST Grade Calculator</div>
            <div class="rule" id="s07-rule"></div>
            <div class="address" id="s07-address">mistgc.vercel.app</div>
            <div class="last" id="s07-last">
              The sheet above is the part you can still change.
            </div>
          </div>
        </div>
      </div>
"""

F7_SCRIPT = """          const photo = document.querySelector("#s07-scene .photo img");
          const mark = document.getElementById("s07-mark");
          const rule = document.getElementById("s07-rule");
          const address = document.getElementById("s07-address");
          const last = document.getElementById("s07-last");

          const cam = { scale: 1 };

          function applyCamera() {
            photo.style.transform =
              "translate(-50%, -50%) scale(" + cam.scale + ")";
          }

          applyCamera();

          const tl = gsap.timeline({ paused: true });

          /* A slow push on the photograph. Transform only. */
          tl.fromTo(
            cam,
            { scale: 1 },
            {
              scale: 1.06,
              duration: 5,
              ease: "power1.out",
              onUpdate: applyCamera,
            },
            0
          );

          /* The wordmark is carried in from the left on the site's own line. */
          tl.fromTo(
            mark,
            { opacity: 0, x: -40 },
            { opacity: 1, x: 0, duration: 14 / 30, ease: "power3.out" },
            36 / 30
          );

          /* The rule draws left to right. */
          tl.fromTo(
            rule,
            { scaleX: 0 },
            { scaleX: 1, duration: 12 / 30, ease: "power3.out" },
            42 / 30
          );

          /* The address lands in volt, early enough to hold to the end. */
          tl.fromTo(
            address,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 10 / 30, ease: "power2.out" },
            48 / 30
          );

          /* The site's own last line holds for the film's final seconds. */
          tl.fromTo(
            last,
            { opacity: 0 },
            { opacity: 1, duration: 12 / 30, ease: "none" },
            60 / 30
          );
"""

if __name__ == "__main__":
    write("04-the-answer", "04 — The answer", 4, F4_CSS, F4_BODY, F4_SCRIPT)
    write("05-the-rules", "05 — The rules", 4.5, F5_CSS, F5_BODY, F5_SCRIPT)
    write("06-the-ladder", "06 — The ladder", 3.5, F6_CSS, F6_BODY, F6_SCRIPT)
    write("07-end-card", "07 — The end card", 5, F7_CSS, F7_BODY, F7_SCRIPT)
