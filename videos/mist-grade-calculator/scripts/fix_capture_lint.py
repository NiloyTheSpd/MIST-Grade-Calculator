#!/usr/bin/env python3
"""Clear the HyperFrames lint findings in the captured page.

The capture is a reference artifact, not a rendered composition: the film's
frames are hand-built under compositions/frames/. The linter still reads it,
so it must be seek-safe.

Two findings are fixed here:

1. The root composition wrapper carries no `data-composition-id`. The
   linter needs a stable id on the entry composition.

2. Six CSS transitions run on the browser clock and cannot be seeked
   deterministically across render workers. Each one is a hover-state
   transition on the captured site. The visual state (the hover colour,
   the border colour) is kept; the *timing* is removed, so the swap is
   instant and identical on every worker.
"""
import pathlib
import re

PAGE = pathlib.Path(__file__).resolve().parent.parent / "capture" / "extracted" / "page.html"

# Each entry is (needle, replacement). The needles are the exact declarations
# the linter reported, so a miss here is a real miss, not a silent no-op.
TRANSITIONS = [
    (
        "transition-duration:.01ms!important",
        "transition-duration:0s!important",
    ),
    (
        "transition:background-color var(--dur-short) var(--ease-out),color var(--dur-short) var(--ease-out)",
        "transition:none",
    ),
    (
        "transition:background-color var(--dur-short) var(--ease-out),transform var(--dur-micro) var(--ease-out)",
        "transition:none",
    ),
    (
        "transition:background-color var(--dur-short) linear",
        "transition:none",
    ),
    (
        "transition:border-color var(--dur-short) var(--ease-out),background-color var(--dur-short) var(--ease-out)",
        "transition:none",
    ),
    (
        "transition:border-color var(--dur-short) var(--ease-out)",
        "transition:none",
    ),
]

ROOT_OLD = '<div id="root">'
ROOT_NEW = '<div id="root" data-composition-id="captured-mist-site">'


def main():
    src = PAGE.read_text(encoding="utf-8")

    if "data-composition-id" not in src.split("<body>")[1].split("<div id=\"__root_app_container\">")[0]:
        assert ROOT_OLD in src, "root wrapper not found"
        src = src.replace(ROOT_OLD, ROOT_NEW, 1)

    for old, new in TRANSITIONS:
        assert old in src, f"declaration not found: {old}"
        src = src.replace(old, new)

    PAGE.write_text(src, encoding="utf-8")

    # Nothing left on the browser clock.
    remaining = [
        m.group(0)
        for m in re.finditer(r"transition(?:-[a-z-]+)?\s*:[^;}]*", src)
        if "none" not in m.group(0) and "0s" not in m.group(0)
    ]
    print("remaining timed transitions:", remaining or "none")
    print("root has composition id:", 'data-composition-id="captured-mist-site"' in src)


if __name__ == "__main__":
    main()
