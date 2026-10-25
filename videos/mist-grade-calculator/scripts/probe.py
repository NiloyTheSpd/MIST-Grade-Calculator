#!/usr/bin/env python3
"""Load the film through the real HyperFrames runtime and dump what is on screen.

The snapshot tool tells us what a frame looks like; this tells us which
composition owns the pixels. It builds a page that includes the runtime
bundle, mounts the seven sub-compositions the way index.html does, seeks the
root timeline, and reports, for every mounted inner root: its composition id,
its visibility, and the bounding box of its content.
"""
import http.server
import json
import pathlib
import socketserver
import sys
import threading
import time

from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
RUNTIME = pathlib.Path(
    "/home/thespd/.npm/_npx/702923228c2ce1e6/node_modules/hyperframes/dist/hyperframe.runtime.iife.js"
)
PORT = 0  # 0 = let the OS pick a free port; the real one is read back below.


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=str(ROOT), **kw)

    def log_message(self, *a):
        pass


def build_probe_page():
    index = (ROOT / "index.html").read_text()
    start = index.index("<div data-hf-id=\"hf-8ksb\"")
    end = index.index("</div>", index.index("data-composition-src=\"compositions/frames/07-end-card.html\""))
    # Take the root element and its children wholesale from index.html.
    body = index[start : index.index("</body>")]

    page = (ROOT / "scripts" / "probe.html").read_text()
    page = page.replace("<!--PROBE_BODY-->", body)
    # The sub-composition paths are relative to the page. The scratch page
    # sits under scripts/ so the linter never sees a second root
    # composition in the project root, so those paths are rewritten to be
    # relative to scripts/ instead.
    page = page.replace(
        'data-composition-src="compositions/frames/',
        'data-composition-src="../compositions/frames/',
    )
    page = page.replace('src="/hyperframe.runtime.iife.js"', 'src="../hyperframe.runtime.iife.js"')
    out = ROOT / "scripts" / "_probe_generated.html"
    out.write_text(page)
    return out


def main():
    probe = build_probe_page()
    # The runtime bundle is served from the project root under this name.
    (ROOT / "hyperframe.runtime.iife.js").write_bytes(RUNTIME.read_bytes())

    httpd = socketserver.TCPServer(("", PORT), Handler)
    httpd.allow_reuse_address = True
    port = httpd.server_address[1]
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    time.sleep(0.5)

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page(viewport={"width": 1920, "height": 1080})
            logs = []
            page.on("console", lambda m: logs.append(f"{m.type}: {m.text}"))
            page.on("pageerror", lambda e: logs.append(f"pageerror: {e}"))
            page.goto(f"http://localhost:{port}/scripts/_probe_generated.html", wait_until="networkidle")
            page.wait_for_timeout(4000)

            times = [float(a) for a in sys.argv[1:]] or [0.0, 5.0]
            for t in times:
                page.evaluate(
                    """(t) => {
                        const p = window.__player;
                        if (p && typeof p.seek === 'function') p.seek(t);
                        else if (p && typeof p.renderSeek === 'function') p.renderSeek(t);
                    }""",
                    t,
                )
                page.wait_for_timeout(400)
                report = page.evaluate(
                """() => {
                    const out = { innerRoots: [], timelines: Object.keys(window.__timelines || {}) };
                    for (const el of document.querySelectorAll('[data-hf-inner-root]')) {
                        const cs = getComputedStyle(el);
                        const r = el.getBoundingClientRect();
                        out.innerRoots.push({
                            comp: el.getAttribute('data-hf-authored-id'),
                            compositionId: el.getAttribute('data-composition-id'),
                            authoredId: el.getAttribute('data-hf-authored-id'),
                            className: el.className,
                            visibility: cs.visibility,
                            opacity: cs.opacity,
                            transform: cs.transform,
                            rect: [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)],
                            childClip: (() => {
                                const c = el.querySelector('[data-start]');
                                if (!c) return null;
                                const cc = getComputedStyle(c);
                                const cr = c.getBoundingClientRect();
                                return {
                                    id: c.id,
                                    start: c.getAttribute('data-start'),
                                    duration: c.getAttribute('data-duration'),
                                    visibility: cc.visibility,
                                    transform: cc.transform,
                                    rect: [Math.round(cr.x), Math.round(cr.y), Math.round(cr.width), Math.round(cr.height)],
                                };
                            })(),
                        });
                    }
                    out.tlTimes = Object.fromEntries(Object.entries(window.__timelines || {}).map(([k, tl]) => [k, tl.time ? tl.time() : null]));
                    out.fields = [];
                    for (const el of document.querySelectorAll('#s03-scene .row__field')) {
                        const r = el.getBoundingClientRect();
                        out.fields.push({id: el.id, text: el.textContent, rect: [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)]});
                    }
                    const cur = document.getElementById('s03-cursor');
                    if (cur) { const r = cur.getBoundingClientRect(); out.cursor = {rect: [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)], tr: getComputedStyle(cur).transform}; }
                    return out;
                }"""
                )
                print(f"=== t={t} ===")
                print(json.dumps(report, indent=2))
            if logs:
                print("--- console ---")
                for line in logs[:30]:
                    print(line)
            browser.close()
    finally:
        httpd.shutdown()


if __name__ == "__main__":
    main()
