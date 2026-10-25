#!/usr/bin/env node
// build-packets.mjs — local frame-packet builder for this project.
//
// The product-launch-video skill's own frame-packets.mjs points at
// `../hyperframes/references/frame-worker-core.md`, which the installed
// hyperframes layout no longer ships (the contract moved into
// `hyperframes-core/references/`). This script reuses the skill's core
// packet logic unchanged, but assembles the worker role from the files that
// actually exist: the hyperframes-core contract set plus the
// product-launch-video delta.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, join } from "node:path";
import {
  buildFramePackets,
} from "/home/thespd/.agents/skills/product-launch-video/scripts/lib/frame-packets-core.mjs";

const PROJECT = resolve(
  process.argv[2] ??
    "/home/thespd/Projects/MIST-Grade-Calculator/videos/mist-grade-calculator",
);

const SKILL = "/home/thespd/.agents/skills/product-launch-video";
const CORE = "/home/thespd/.agents/skills/hyperframes-core";
const ANIM = "/home/thespd/.agents/skills/hyperframes-animation";

const CORE_CONTRACT = [
  "core/references/minimal-composition.md",
  "core/references/sub-compositions.md",
  "core/references/composition-patterns.md",
  "core/references/data-attributes.md",
  "core/references/determinism-rules.md",
  "core/references/tracks-and-clips.md",
].map((p) => resolve(CORE, p.replace("core/", "")));

const DELTA = resolve(SKILL, "sub-agents/frame-worker.md");

const role = `${CORE_CONTRACT.map((p) => readFileSync(p, "utf8").trim()).join("\n\n---\n\n")}\n\n---\n\n${readFileSync(DELTA, "utf8").trim()}\n`;

const outDir = join(PROJECT, ".hyperframes", "frame-packets");
mkdirSync(outDir, { recursive: true });
const rolePath = join(outDir, "_role.md");
writeFileSync(rolePath, role);
console.log(`✓ role payload: ${rolePath} (${Buffer.byteLength(role)} bytes)`);

const packets = buildFramePackets({
  projectDir: PROJECT,
  storyboardPath: join(PROJECT, "STORYBOARD.md"),
  outDir,
  animationDir: ANIM,
  corePath: CORE_CONTRACT[0],
  deltaPath: DELTA,
  extraSections: (block) => {
    // The shared contract references a core file that does not exist here, so
    // the role is rebuilt above; nothing extra is needed per frame.
    return "";
  },
});

for (const p of packets) console.log(`✓ ${p.frameId} → ${p.path} (${p.bytes} bytes)`);
console.log(`✓ ${packets.length} packet(s)`);
