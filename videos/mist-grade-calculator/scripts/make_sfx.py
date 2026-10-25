#!/usr/bin/env python3
"""
make_sfx.py — synthesise the launch film's sound effects.

The film's spec calls for:
  - six soft dry clicks, one per input field filled (Frame 3), each on a beat
  - a low settle as the number lands (Frame 4)
  - a tick per table row reveal (Frame 5)

All cues are synthesised from scratch with numpy — a short noise transient
through a resonant band-pass for the clicks (dry and close, like a mouse on a
desk) and a decaying sine stack for the settle (the number coming to rest).
No samples, no network, deterministic by construction.

Usage:
    .venv-bgm/bin/python scripts/make_sfx.py --output-dir assets/sfx
"""

import argparse
import json
import math
import os
from pathlib import Path

import numpy as np
import soundfile as sf

SR = 32000


def envelope(n, attack_s, decay_s, curve=3.0):
    """Fast attack, exponential decay — the shape of a dry UI transient."""
    a = max(1, int(attack_s * SR))
    env = np.zeros(n, dtype="float32")
    if a < n:
        env[:a] = np.linspace(0.0, 1.0, a, dtype="float32")
    rest = n - a
    if rest > 0:
        t = np.arange(rest, dtype="float32") / SR
        env[a:] = np.exp(-t / max(decay_s, 1e-4)) ** 1.0
    return env


def click(sr=SR, dur=0.045, freq=2600.0, q=9.0, seed=0):
    """A short dry click: filtered noise transient + a faint pitched tick."""
    rng = np.random.default_rng(seed)
    n = int(dur * sr)
    t = np.arange(n, dtype="float32") / sr

    # noise burst
    noise = rng.standard_normal(n).astype("float32")

    # band-pass the noise with an FFT-domain response — exact and fast enough
    # for a 45 ms buffer.
    spec = np.fft.rfft(noise)
    freqs = np.fft.rfftfreq(n, 1.0 / sr)
    resp = 1.0 / (1.0 + ((freqs - freq) / (freq * 0.55)) ** 2)
    band = np.fft.irfft(spec * resp, n).astype("float32")

    # pitched tick — a short sine at the filter centre, very quiet
    tick = np.sin(2 * math.pi * freq * 0.5 * t).astype("float32") * 0.18

    out = (band * 0.9 + tick).astype("float32")
    out *= envelope(n, 0.001, 0.016)
    peak = float(np.max(np.abs(out)))
    if peak > 1e-9:
        out = out / peak * 0.85
    return out


def tick(sr=SR, dur=0.07, freq=1750.0, seed=0):
    """A per-row reveal tick: quieter, rounder than the field click."""
    rng = np.random.default_rng(seed)
    n = int(dur * sr)
    t = np.arange(n, dtype="float32") / sr
    noise = rng.standard_normal(n).astype("float32")
    spec = np.fft.rfft(noise)
    freqs = np.fft.rfftfreq(n, 1.0 / sr)
    resp = 1.0 / (1.0 + ((freqs - freq) / (freq * 0.85)) ** 2)
    band = np.fft.irfft(spec * resp, n).astype("float32")
    tone = np.sin(2 * math.pi * freq * t).astype("float32") * 0.25
    out = (band * 0.55 + tone).astype("float32")
    out *= envelope(n, 0.002, 0.030)
    peak = float(np.max(np.abs(out)))
    if peak > 1e-9:
        out = out / peak * 0.6
    return out


def settle(sr=SR, dur=1.5):
    """A low settle as the answer lands: a small sine stack, soft and wide."""
    n = int(dur * sr)
    t = np.arange(n, dtype="float32") / sr
    out = np.zeros(n, dtype="float32")
    for f, g, d in ((55.0, 1.0, 0.55), (82.5, 0.42, 0.38), (110.0, 0.22, 0.26)):
        out += np.sin(2 * math.pi * f * t).astype("float32") * g * np.exp(-t / d)
    # a breath of filtered noise under it — the room, not a hiss
    rng = np.random.default_rng(7)
    noise = rng.standard_normal(n).astype("float32")
    spec = np.fft.rfft(noise)
    freqs = np.fft.rfftfreq(n, 1.0 / sr)
    resp = 1.0 / (1.0 + (freqs / 220.0) ** 4)
    body = np.fft.irfft(spec * resp, n).astype("float32") * np.exp(-t / 0.22)
    out += body * 0.35
    out *= envelope(n, 0.012, 0.7)
    peak = float(np.max(np.abs(out)))
    if peak > 1e-9:
        out = out / peak * 0.8
    return out


def swell(sr=SR, dur=1.2):
    """A single low swell for the colour flood into the ladder."""
    n = int(dur * sr)
    t = np.arange(n, dtype="float32") / sr
    out = np.zeros(n, dtype="float32")
    for f, g in ((44.0, 1.0), (66.0, 0.45), (88.0, 0.22)):
        out += np.sin(2 * math.pi * f * t).astype("float32") * g
    # rise then fall
    rise = np.clip(t / (dur * 0.55), 0, 1)
    fall = np.clip((dur - t) / (dur * 0.45), 0, 1)
    out *= (rise * fall).astype("float32")
    out *= envelope(n, 0.05, 0.5)
    peak = float(np.max(np.abs(out)))
    if peak > 1e-9:
        out = out / peak * 0.72
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--output-dir", default="assets/sfx")
    ap.add_argument("--meta", default="assets/sfx/sfx_meta.json")
    args = ap.parse_args()

    out_dir = Path(args.output_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    cues = []

    # --- Frame 3: six field clicks, each on a beat -----------------------
    # The six fields fill in turn across 0.9-5.2s. One click per field.
    field_times = [0.95, 1.67, 2.39, 3.11, 3.83, 4.55]
    for i, t in enumerate(field_times):
        name = f"field-{i + 1}.wav"
        sf.write(str(out_dir / name), click(seed=100 + i), SR)
        cues.append(
            {
                "frame": 3,
                "file": f"assets/sfx/{name}",
                "offset_s": round(t, 3),
                "duration_s": 0.12,
                "volume": 0.30,
            }
        )

    # --- Frame 4: the low settle as 126 lands --------------------------
    # The number lands at ~1.8s into the frame (0.6s + 1.2s count-up).
    sf.write(str(out_dir / "settle.wav"), settle(), SR)
    cues.append(
        {
            "frame": 4,
            "file": "assets/sfx/settle.wav",
            "offset_s": 1.78,
            "duration_s": 1.5,
            "volume": 0.42,
        }
    )

    # --- Frame 5: a tick per row reveal ---------------------------------
    # Six rows, 3 frames apart, from ~1.4s into the frame.
    row_times = [1.45, 1.55, 1.65, 1.75, 1.85, 1.95]
    for i, t in enumerate(row_times):
        name = f"row-{i + 1}.wav"
        sf.write(str(out_dir / name), tick(seed=200 + i), SR)
        cues.append(
            {
                "frame": 5,
                "file": f"assets/sfx/{name}",
                "offset_s": round(t, 3),
                "duration_s": 0.15,
                "volume": 0.22,
            }
        )

    # --- Frame 6: a single low swell on the colour flood ----------------
    sf.write(str(out_dir / "swell.wav"), swell(), SR)
    cues.append(
        {
            "frame": 6,
            "file": "assets/sfx/swell.wav",
            "offset_s": 0.05,
            "duration_s": 1.2,
            "volume": 0.34,
        }
    )

    meta_path = Path(args.meta)
    meta_path.parent.mkdir(parents=True, exist_ok=True)
    meta_path.write_text(json.dumps(cues, indent=2) + "\n", encoding="utf-8")
    print(f"[sfx] wrote {len(cues)} cue(s) to {out_dir}", flush=True)
    print(f"[sfx] meta → {meta_path}", flush=True)


if __name__ == "__main__":
    main()
