# Minimal Composition

The smallest renderable HyperFrames composition — a standalone (top-level) root with one clip and one tween:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <title>Minimal HyperFrames Composition</title>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
      body {
        margin: 0;
        background: #0b0f14;
        color: white;
        font-family: Inter, system-ui, sans-serif;
      }
      #root {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }
      .clip {
        position: absolute;
        inset: 0;
        display: grid;
        place-items: center;
      }
      h1 {
        margin: 0;
        font-size: 96px;
      }
    </style>
  </head>
  <body>
    <div
      id="root"
      data-composition-id="main"
      data-start="0"
      data-width="1920"
      data-height="1080"
      data-duration="5"
    >
      <section id="title-card" class="clip" data-start="0" data-duration="5">
        <h1 id="title">Hello HyperFrames</h1>
      </section>
    </div>
    <script>
      const tl = gsap.timeline({ paused: true });
      tl.from("#title", { y: 48, opacity: 0, duration: 0.6, ease: "power3.out" }, 0.2);
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
```

What the runtime actually requires:

- Root `<div>` with `data-composition-id`, `data-width`, `data-height`. Root `data-start="0"` is written above by convention and every shipped block has it, but the runtime stamps it when absent, so it is not required.
- A duration source: root `data-duration` (as above), or a GSAP timeline, or media, or an adapter that can infer one.
- Timed elements carry `data-start` plus a duration. That attribute alone is what makes an element a clip: `class="clip"` is a layout and tooling convention, and `data-track-index` is a Studio display lane. Neither is required, and a composition with no clips at all renders fine.
- A GSAP timeline created paused and registered on `window.__timelines["<composition-id>"]`.

Everything else in the skeleton is ordinary HTML and CSS: the `#root` box, `.clip` positioning, and fonts are yours to choose.

This pattern is **standalone** (top-level `index.html`) — no `<template>` wrapper around the root. For sub-compositions (files loaded by `data-composition-src`), see `sub-compositions.md`.

---

# Frame worker — product-launch delta

> The shared law is the core contract above (the packet builder prepends `../../hyperframes/references/frame-worker-core.md` to this file as `_role.md`) — read the two as one role. This file carries only what's specific to a product-launch frame; you run N-up, **one frame each** — your dispatch carries exactly one packet. Tempted to add a generic GSAP / timeline rule here? Wrong home — it belongs in the core contract or `hyperframes-core`.

## Your `focal:` / `roles:` — real captured media

- `focal:` — which candidate is the hero.
- `roles:` — each candidate's role: `cutout` foreground / `background` full-bleed / supporting — plus the real media available (each `public/<basename> — description`; a **`[video]`** tag marks a `.mp4` motion source that cannot be mounted by this sub-composition worker).
- **Asset paths are project-root relative everywhere.** This includes HTML attributes and CSS `url(...)` values such as `@font-face src`: use `assets/...` (or the supplied `capture/assets/...` path), never `../` or `../../`. Shared fonts are staged before dispatch so every parallel frame resolves the same local files; never fall back to a network `@import`.

## Placing candidates (product-launch constraint)

**Place each candidate by its `roles`** (the `focal` is the hero): a `cutout` is a foreground subject — respect the 83% keep-out, lay text around it, not over its face; a `background` is full-bleed and dimmed ~30–50% so foreground content stays legible. Frame files are sub-compositions. Audio remains orchestrator-owned: never author `<audio>` in a frame. An approved `[video]` candidate may be declared as a frame-local `<video data-frame-video="approved" data-start="..." data-duration="..." data-track-index="...">`; `assemble-index.mjs` hoists it to the host root and translates its timing. Give every approved video explicit host geometry with numeric `data-frame-video-x`, `data-frame-video-y`, `data-frame-video-width`, and `data-frame-video-height`; optionally set `data-frame-video-fit="cover|contain|fill|none|scale-down"` (default `cover`). The assembler converts only those values to host CSS: frame-local classes and inline styles do not cross the hoist boundary. Do not use this declaration for audio, unapproved URLs, or videos without explicit timing and geometry. If no approved video is supplied, use an explicitly supplied static still/key art (`[video-still]` or another image candidate) as `<img>`; do not extract a frame, fabricate a URL, or silently embed an unapproved clip.

When a frame showcases a captured website, use the supplied screenshot as the page. Do not rebuild the full site in HTML: even a close recreation can change the real layout, spacing, or branding. If the shot needs motion inside the page, overlay the supplied real assets at measured positions or rebuild only the moving component.

Brand text comes from your frame's `scene` / narrative — never from `frame.md` (a style spec, not the product's content). Place the named assets, and never invent new ones.

## Cross-frame handoffs

If the packet includes `handoff_in:` or `handoff_out:`, treat those values as a hard boundary contract. Start or end the named element at the exact x/y position, scale, opacity, and motion direction/speed provided; a field the packet states as unchanged is still binding, not optional. Do not restyle or reinterpret that boundary state. The neighboring frame is being built by another worker and will use the matching values.
