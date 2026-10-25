#!/usr/bin/env python3
"""Shoot the film through the running HyperFrames preview server.

The preview server mounts the sub-compositions and registers their
timelines, so the frames render the way the film will.
"""
import pathlib
import sys

from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = pathlib.Path("/tmp/shots")
URL = "http://localhost:4310/index.html"

# Global times in the film.
TIMES = [
    (0.8, "01-ink-band"),
    (1.6, "01-ink-band"),
    (2.6, "01-ink-band"),
    (3.6, "02-the-sheet"),
    (5.0, "02-the-sheet"),
    (6.3, "02-the-sheet"),
    (7.2, "03-six-fields"),
    (9.0, "03-six-fields"),
    (11.0, "03-six-fields"),
    (12.8, "03-six-fields"),
    (13.5, "04-the-answer"),
    (14.6, "04-the-answer"),
    (16.5, "04-the-answer"),
    (17.6, "05-the-rules"),
    (19.5, "05-the-rules"),
    (21.2, "05-the-rules"),
    (22.0, "06-the-ladder"),
    (23.5, "06-the-ladder"),
    (24.8, "06-the-ladder"),
    (26.0, "07-end-card"),
    (27.5, "07-end-card"),
    (29.5, "07-end-card"),
]


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    only = sys.argv[1:] if len(sys.argv) > 1 else None

    with sync_playwright() as p:
        browser = p.chromium.launch(args=["--force-color-profile=srgb"])
        page = browser.new_page(viewport={"width": 1920, "height": 1080})
        page.goto(URL, wait_until="networkidle")
        page.wait_for_timeout(3000)

        keys = page.evaluate("() => Object.keys(window.__timelines || {})")
        print("timelines:", keys)

        for t, label in TIMES:
            if only and label not in only:
                continue
            page.evaluate(
                """(t) => {
                    const tl = window.__timelines['main'];
                    if (tl) tl.seek(t, false);
                }""",
                t,
            )
            page.wait_for_timeout(260)
            out = OUT / f"film-{t:05.2f}-{label}.png"
            page.screenshot(path=str(out))
            print("shot", out.name)

        browser.close()


if __name__ == "__main__":
    main()
