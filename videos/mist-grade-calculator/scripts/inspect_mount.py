#!/usr/bin/env python3
"""Inspect what the HyperFrames runtime mounts, and what is visible at a time.

The snapshot tool tells us what a frame looks like; this tells us why. It
loads the project's index.html through the runtime the same way the renderer
does, then reports the mounted sub-compositions, their visibility, and the
timeline the host is driving.
"""
import json
import pathlib
import subprocess
import sys

from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
PORT = 4319


def main():
    times = [float(a) for a in sys.argv[1:]] or [5.0]

    server = subprocess.Popen(
        ["npx", "--yes", "hyperframes@0.8.198", "preview", "--port", str(PORT)],
        cwd=str(ROOT),
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    try:
        # The preview server boots the Studio SPA; give it a moment to
        # start listening before the browser goes looking for it.
        import time
        import urllib.request

        for _ in range(60):
            try:
                urllib.request.urlopen(f"http://localhost:{PORT}/index.html", timeout=1)
                break
            except Exception:
                time.sleep(1)

        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page(viewport={"width": 1920, "height": 1080})
            page.goto(f"http://localhost:{PORT}/index.html", wait_until="networkidle")
            page.wait_for_timeout(4000)

            for t in times:
                report = page.evaluate(
                    """(t) => {
                        const out = { time: t, slots: [] };
                        const host = document.querySelector('#root[data-composition-id="main"]');
                        for (const slot of host.children) {
                            const cs = getComputedStyle(slot);
                            const rect = slot.getBoundingClientRect();
                            out.slots.push({
                                id: slot.getAttribute('data-composition-id'),
                                start: slot.getAttribute('data-start'),
                                duration: slot.getAttribute('data-duration'),
                                visibility: cs.visibility,
                                opacity: cs.opacity,
                                display: cs.display,
                                transform: cs.transform,
                                rect: [Math.round(rect.x), Math.round(rect.y), Math.round(rect.width), Math.round(rect.height)],
                                childRoots: Array.from(slot.querySelectorAll('[data-composition-id]')).map((r) => ({
                                    id: r.getAttribute('data-composition-id'),
                                    visibility: getComputedStyle(r).visibility,
                                    rect: (() => { const b = r.getBoundingClientRect(); return [Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)]; })(),
                                })),
                            });
                        }
                        out.timelines = Object.keys(window.__timelines || {});
                        out.hasRuntime = typeof window.__hf !== 'undefined' || !!window.__timelines;
                        return out;
                    }""",
                    t,
                )
                print(json.dumps(report, indent=2))

            browser.close()
    finally:
        server.terminate()


if __name__ == "__main__":
    main()
