#!/usr/bin/env python3
"""Build the seven film frames from the shared base plus a per-frame body.

Each frame is a self-contained HyperFrames template: the shared base CSS
(compositions/base.css) inlined, then the frame's own rules, its scene markup
and its GSAP timeline.
"""
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
BASE = (ROOT / "compositions" / "base.css").read_text()

# The shared base declares #root and the font faces; every frame appends its
# own rules below. Split the base so the frame body can go inside one <style>.
BASE_CSS = BASE


def frame(slug, title, duration, css, body, script):
    return f"""<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <title>{title}</title>
  </head>
  <body>
    <template id="frame-{slug}">
      <style>
{BASE_CSS}
{css}
      </style>

{body}

      <script>
        (() => {{
{script}
          window.__timelines = window.__timelines || {{}};
          window.__timelines["{slug}"] = tl;
        }})();
      </script>
    </template>
  </body>
</html>
"""


def write(slug, title, duration, css, body, script):
    path = ROOT / "compositions" / "frames" / f"{slug}.html"
    path.write_text(frame(slug, title, duration, css, body, script))
    print(f"wrote {path.relative_to(ROOT)}")


if __name__ == "__main__":
    print("This module is imported by build-all.py", file=sys.stderr)
