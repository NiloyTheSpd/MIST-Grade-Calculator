#!/usr/bin/env python3
"""
make_bgm.py — generate the launch film's music bed with MusicGen (facebook/musicgen-small).

Runs on CPU inside .venv-bgm. Generates one seed clip (<=30 s, under the decoder's
positional limit), then crossfade-loops it up to the target length with a short fade-in
and a longer fade-out, so the bed covers the full 30 s cut with no silent tail.

Usage:
    .venv-bgm/bin/python scripts/make_bgm.py --output assets/bgm/track.wav \
        --duration 30 --seed 20261025 --prompt "<mood prompt>"
"""

import argparse
import math
import os
import sys
import traceback
from pathlib import Path

import numpy as np
import soundfile as sf

TOKEN_RATE = 50          # MusicGen audio tokens per second
CROSSFADE_S = 0.3
FADE_IN_S = 0.08
FADE_OUT_S = 0.5


def apply_fade(arr, sr, fade_in_s=FADE_IN_S, fade_out_s=FADE_OUT_S):
    """Short fade in, longer fade out — a bed, not a hit."""
    n_in = min(int(round(fade_in_s * sr)), arr.shape[0] // 2)
    n_out = min(int(round(fade_out_s * sr)), arr.shape[0] // 2)
    if n_in > 1:
        arr[:n_in] *= np.linspace(0.0, 1.0, n_in, dtype="float32")
    if n_out > 1:
        arr[-n_out:] *= np.linspace(1.0, 0.0, n_out, dtype="float32")
    return arr


def loop_crossfade(seed, target_len, xf):
    """Loop the seed to the target length, crossfading each seam so no edge clicks."""
    if seed.shape[0] >= target_len:
        return seed[:target_len]
    xf = min(xf, seed.shape[0] // 2)
    if xf < 1:
        reps = int(math.ceil(target_len / seed.shape[0]))
        return np.tile(seed, reps)[:target_len]
    t = np.linspace(0.0, 1.0, xf, dtype="float32")
    fade_out = np.cos(t * (math.pi / 2))
    fade_in = np.sin(t * (math.pi / 2))
    out = seed.copy()
    while out.shape[0] < target_len:
        tail = out[-xf:] * fade_out
        head = seed[:xf] * fade_in
        out = np.concatenate([out[:-xf], tail + head, seed[xf:]])
    return out[:target_len]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--output", required=True)
    ap.add_argument("--duration", type=float, default=30.0)
    ap.add_argument("--seed-duration", type=float, default=30.0)
    ap.add_argument("--seed", type=int, default=20261025)
    ap.add_argument("--device", default="auto", choices=["auto", "cuda", "cpu"])
    ap.add_argument("--prompt", required=True)
    args = ap.parse_args()

    import torch
    from transformers import MusicgenForConditionalGeneration, AutoProcessor

    torch.manual_seed(args.seed)
    torch.set_grad_enabled(False)

    device = "cuda" if torch.cuda.is_available() else "cpu"
    if args.device != "auto":
        device = args.device
    if device == "cuda" and not torch.cuda.is_available():
        print("[musicgen] cuda requested but unavailable — falling back to cpu", flush=True)
        device = "cpu"

    out_path = Path(args.output)
    out_path.parent.mkdir(parents=True, exist_ok=True)

    processor = AutoProcessor.from_pretrained("facebook/musicgen-small")
    model = MusicgenForConditionalGeneration.from_pretrained(
        "facebook/musicgen-small", torch_dtype=torch.float16 if device == "cuda" else torch.float32
    )
    model = model.to(device)
    model.eval()

    sr = int(model.config.audio_encoder.sampling_rate)
    gen_s = min(args.seed_duration, args.duration)
    tokens = max(1, int(math.ceil(gen_s * TOKEN_RATE)))
    print(f"[musicgen] seed dur={gen_s:.2f}s tokens={tokens} sr={sr} device={device}", flush=True)
    print(f"[musicgen] prompt: {args.prompt}", flush=True)

    inputs = processor(text=[args.prompt], padding=True, return_tensors="pt").to(device)
    audio = model.generate(**inputs, max_new_tokens=tokens)
    seed = audio[0, 0].detach().cpu().numpy().astype("float32")

    peak = float(np.max(np.abs(seed)))
    if peak > 1e-6:
        seed = seed * (0.89 / peak)

    want = max(1, int(round(args.duration * sr)))
    if seed.shape[0] >= want:
        final = seed[:want].copy()
    else:
        final = loop_crossfade(seed, want, int(round(CROSSFADE_S * sr)))

    if final.shape[0] < want:
        final = np.pad(final, (0, want - final.shape[0]))
    else:
        final = final[:want]

    final = apply_fade(final, sr)
    peak = float(np.max(np.abs(final)))
    if peak > 1.0:
        final = final / peak

    sf.write(str(out_path), final, sr)
    print(f"[musicgen] wrote {out_path} samples={final.shape[0]} sr={sr} "
          f"dur={final.shape[0] / sr:.2f}s", flush=True)


if __name__ == "__main__":
    try:
        main()
    except Exception:
        traceback.print_exc()
        sys.exit(1)
