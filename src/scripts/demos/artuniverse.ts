// ArtUniverse — a viewfinder scans a procedurally painted (original) canvas, extracts an
// embedding and "recognizes" it, then suggests similar works.
import { alpha, mono, mountCanvas, roundRect, type DemoState } from "./runtime";

const T = {
  fr: { scanning: "Analyse de l'œuvre…", match: "Œuvre reconnue", similar: "Œuvres proches", vec: "embedding · 512 d" },
  en: { scanning: "Analysing artwork…", match: "Artwork recognized", similar: "Similar works", vec: "embedding · 512 d" },
};

const PALETTES = [
  ["#1d3557", "#e9c46a", "#e76f51", "#f4ede1", "#2a9d8f"],
  ["#2b2d42", "#d90429", "#edf2f4", "#8d99ae", "#f2a541"],
  ["#283618", "#dda15e", "#bc6c25", "#fefae0", "#606c38"],
  ["#22223b", "#9a8c98", "#c9ada7", "#f2e9e4", "#4a4e69"],
];

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Paints an abstract, brush-stroke composition into a fresh canvas. */
function paint(seed: number, w: number, h: number, dpr: number): HTMLCanvasElement {
  const cv = document.createElement("canvas");
  cv.width = Math.max(1, Math.round(w * dpr));
  cv.height = Math.max(1, Math.round(h * dpr));
  const g = cv.getContext("2d")!;
  g.scale(dpr, dpr);
  const r = rng(seed);
  const pal = PALETTES[seed % PALETTES.length];

  const bg = g.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, pal[3]);
  bg.addColorStop(1, pal[1]);
  g.fillStyle = bg;
  g.fillRect(0, 0, w, h);

  // Large colour fields, then gestural strokes on top.
  for (let i = 0; i < 6; i++) {
    g.globalAlpha = 0.35 + r() * 0.4;
    g.fillStyle = pal[Math.floor(r() * pal.length)];
    g.beginPath();
    g.ellipse(r() * w, r() * h, w * (0.15 + r() * 0.35), h * (0.1 + r() * 0.3), r() * Math.PI, 0, Math.PI * 2);
    g.fill();
  }
  g.lineCap = "round";
  for (let i = 0; i < 70; i++) {
    g.globalAlpha = 0.25 + r() * 0.6;
    g.strokeStyle = pal[Math.floor(r() * pal.length)];
    g.lineWidth = 2 + r() * Math.min(w, h) * 0.07;
    const x = r() * w;
    const y = r() * h;
    const a = r() * Math.PI * 2;
    const len = Math.min(w, h) * (0.15 + r() * 0.5);
    g.beginPath();
    g.moveTo(x, y);
    g.bezierCurveTo(
      x + Math.cos(a) * len * 0.4 + (r() - 0.5) * 40,
      y + Math.sin(a) * len * 0.4 + (r() - 0.5) * 40,
      x + Math.cos(a + 0.6) * len * 0.8,
      y + Math.sin(a + 0.6) * len * 0.8,
      x + Math.cos(a + 0.3) * len,
      y + Math.sin(a + 0.3) * len,
    );
    g.stroke();
  }
  g.globalAlpha = 1;
  return cv;
}

export function mount(el: HTMLElement) {
  return mountCanvas(el, () => {
    let seed = 7;
    let phase: "scan" | "match" = "scan";
    let phaseT = 0;
    let art: HTMLCanvasElement | null = null;
    let thumbs: HTMLCanvasElement[] = [];
    let points: [number, number][] = [];
    let vec: number[] = [];
    let artKey = "";

    const layout = (st: DemoState) => {
      const ph = st.h * 0.78;
      const pw = Math.min(st.w * 0.46, ph * 0.8);
      const px = st.w < 420 ? (st.w - pw) / 2 : st.w * 0.08;
      const py = (st.h - ph) / 2;
      return { px, py, pw, ph };
    };

    const regenerate = (st: DemoState) => {
      const { pw, ph } = layout(st);
      const key = `${seed}:${Math.round(pw)}:${Math.round(ph)}:${st.dpr}`;
      if (key === artKey) return;
      artKey = key;
      art = paint(seed, pw, ph, st.dpr);
      thumbs = [1, 2, 3].map((k) => paint(seed + k * 4, 40, 50, st.dpr));
      const r = rng(seed * 13);
      points = Array.from({ length: 34 }, () => [r(), r()]);
      vec = Array.from({ length: 24 }, () => r() * 2 - 1);
    };

    return {
      resize: regenerate,
      pointerdown() {
        seed += 1;
        phase = "scan";
        phaseT = 0;
      },
      frame(st, dt) {
        regenerate(st);
        phaseT += dt;
        if (phase === "scan" && phaseT > 2.4) {
          phase = "match";
          phaseT = 0;
        } else if (phase === "match" && phaseT > 3.2) {
          seed += 1;
          phase = "scan";
          phaseT = 0;
          regenerate(st);
        }
        const scanned = st.reduced ? 1 : phase === "scan" ? Math.min(1, phaseT / 2.2) : 1;
        const showMatch = st.reduced || phase === "match";
        const matchT = st.reduced ? 1 : Math.min(1, phaseT / 0.5);

        const { ctx, w, h, colors: c } = st;
        const t = T[st.lang];
        const { px, py, pw, ph } = layout(st);
        ctx.clearRect(0, 0, w, h);

        // Frame + painting.
        ctx.save();
        ctx.shadowColor = alpha("#000000", 0.25);
        ctx.shadowBlur = 18;
        ctx.shadowOffsetY = 8;
        ctx.fillStyle = "#b08d57";
        ctx.fillRect(px - 8, py - 8, pw + 16, ph + 16);
        ctx.restore();
        ctx.strokeStyle = "#8a6a3a";
        ctx.lineWidth = 2;
        ctx.strokeRect(px - 3, py - 3, pw + 6, ph + 6);
        if (art) ctx.drawImage(art, px, py, pw, ph);

        // Feature points revealed by the scan line.
        const lineY = py + ph * scanned;
        for (const [fx, fy] of points) {
          const y = py + fy * ph;
          if (y > lineY) continue;
          ctx.beginPath();
          ctx.arc(px + fx * pw, y, 2.4, 0, Math.PI * 2);
          ctx.fillStyle = alpha("#ffffff", 0.9);
          ctx.fill();
          ctx.strokeStyle = alpha(c.accent, 0.9);
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        if (phase === "scan" && !st.reduced) {
          const grad = ctx.createLinearGradient(0, lineY - 28, 0, lineY);
          grad.addColorStop(0, alpha(c.accent, 0));
          grad.addColorStop(1, alpha(c.accent, 0.45));
          ctx.fillStyle = grad;
          ctx.fillRect(px, Math.max(py, lineY - 28), pw, Math.min(28, lineY - py));
          ctx.fillStyle = c.accent;
          ctx.fillRect(px - 4, lineY - 1, pw + 8, 2);
        }

        // Viewfinder corners, breathing while scanning.
        const m = 18 + (phase === "scan" && !st.reduced ? Math.sin(st.time * 6) * 3 : 0);
        const L = 16;
        ctx.strokeStyle = showMatch ? c.live : c.accent;
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        const x0 = px - m;
        const y0 = py - m;
        const x1 = px + pw + m;
        const y1 = py + ph + m;
        ctx.beginPath();
        for (const [x, y, sx, sy] of [[x0, y0, 1, 1], [x1, y0, -1, 1], [x0, y1, 1, -1], [x1, y1, -1, -1]]) {
          ctx.moveTo(x, y + sy * L);
          ctx.lineTo(x, y);
          ctx.lineTo(x + sx * L, y);
        }
        ctx.stroke();
        ctx.lineCap = "butt";

        // Result panel (to the right, or overlaid on narrow screens).
        const narrow = w < 420;
        const cw = narrow ? w - 32 : Math.min(w * 0.38, 260);
        const chH = narrow ? 104 : Math.min(h - 40, 180);
        const cx = narrow ? 16 : w - cw - Math.max(16, w * 0.05);
        const baseY = narrow ? h - chH - 12 : (h - chH) / 2;
        if (!showMatch) {
          if (!narrow) {
            ctx.font = mono(11, 600);
            ctx.fillStyle = c.muted;
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.fillText(t.scanning, cx, h / 2);
          }
          return;
        }
        const ease = 1 - Math.pow(1 - matchT, 3);
        const cy = baseY + (1 - ease) * 20;
        ctx.globalAlpha = ease;
        roundRect(ctx, cx, cy, cw, chH, 14);
        ctx.fillStyle = alpha(c.surface, 0.96);
        ctx.fill();
        ctx.strokeStyle = c.line;
        ctx.lineWidth = 1;
        ctx.stroke();

        const ix = cx + 14;
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
        ctx.font = mono(10, 600);
        ctx.fillStyle = c.live;
        ctx.fillText(`● ${t.match.toUpperCase()}`, ix, cy + 22);
        ctx.font = mono(20, 700);
        ctx.fillStyle = c.ink;
        ctx.fillText(`${(0.9 + ((seed * 37) % 9) / 100).toFixed(2)}`, ix, cy + 48);
        ctx.font = mono(10, 500);
        ctx.fillStyle = c.muted;
        ctx.fillText("cos sim", ix + 62, cy + 48);

        // Embedding bars.
        const by = cy + 58;
        const bw = (cw - 28) / vec.length;
        vec.forEach((v, i) => {
          const bh = Math.abs(v) * 16 * ease;
          ctx.fillStyle = v > 0 ? c.accent : c.accent2;
          ctx.fillRect(ix + i * bw, by + 16 - (v > 0 ? bh : 0), Math.max(1, bw - 2), bh);
        });
        if (narrow) {
          ctx.globalAlpha = 1;
          return;
        }
        ctx.font = mono(9, 500);
        ctx.fillStyle = c.muted;
        ctx.fillText(t.vec, ix, by + 46);

        ctx.font = mono(10, 600);
        ctx.fillStyle = c.muted;
        ctx.fillText(t.similar.toUpperCase(), ix, by + 70);
        thumbs.forEach((th, i) => {
          const tx = ix + i * 46;
          const ty = by + 78;
          if (ty + 40 > cy + chH) return;
          ctx.drawImage(th, tx, ty, 38, Math.min(46, cy + chH - ty - 10));
        });
        ctx.globalAlpha = 1;
      },
    };
  });
}
