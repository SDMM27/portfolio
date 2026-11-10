// Hero name drawn with particles: they spring to the letter shapes, scatter away from the
// cursor (or finger) and burst on click. Under reduced motion they sit still on the letters.
import { display, mountCanvas, type DemoState } from "./demos/runtime";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number;
  ty: number;
  accent: boolean;
  phase: number;
}

const RADIUS = 90;

export function mountHero(el: HTMLElement, text: string) {
  return mountCanvas(el, (s: DemoState) => {
    let particles: Particle[] = [];
    let size = 3;
    let fontReady = false;

    const sample = (st: DemoState) => {
      const { w, h } = st;
      if (!w || !h) return;
      const off = document.createElement("canvas");
      off.width = w;
      off.height = h;
      const g = off.getContext("2d", { willReadFrequently: true })!;
      // Narrow screens stack the words so the letters stay big enough to read as particles.
      const lines = w < 640 && text.includes(" ") ? text.split(" ") : [text];
      let fontSize = Math.min((h * 0.78) / lines.length, 260);
      g.font = display(fontSize);
      const widest = Math.max(...lines.map((l) => g.measureText(l).width));
      if (widest > w * 0.92) fontSize *= (w * 0.92) / widest;
      g.font = display(fontSize);
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillStyle = "#000";
      lines.forEach((l, i) => g.fillText(l, w / 2, h / 2 + (i - (lines.length - 1) / 2) * fontSize * 0.92));

      const target = w < 640 ? 1300 : 2800;
      const data = g.getImageData(0, 0, w, h).data;
      let filled = 0;
      for (let i = 3; i < data.length; i += 16) if (data[i] > 128) filled++;
      const step = Math.max(2, Math.round(Math.sqrt((filled * 4) / target)));
      size = Math.max(1.6, step * 0.68);

      const targets: [number, number][] = [];
      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          if (data[(y * w + x) * 4 + 3] > 128) targets.push([x, y]);
        }
      }

      const intro = particles.length === 0 && !st.reduced;
      const next: Particle[] = targets.map(([tx, ty], i) => {
        const prev = particles[i];
        if (prev) return { ...prev, tx, ty };
        return {
          x: intro ? Math.random() * w : tx,
          y: intro ? Math.random() * h : ty,
          vx: 0,
          vy: 0,
          tx,
          ty,
          accent: Math.random() < 0.09,
          phase: Math.random() * Math.PI * 2,
        };
      });
      particles = next;
      if (st.reduced) for (const p of particles) ((p.x = p.tx), (p.y = p.ty));
    };

    const burst = (st: DemoState) => {
      for (const p of particles) {
        const dx = p.x - st.pointer.x;
        const dy = p.y - st.pointer.y;
        const d = Math.hypot(dx, dy) || 1;
        const f = Math.max(0, 1 - d / (RADIUS * 2.5)) * 18;
        p.vx += (dx / d) * f;
        p.vy += (dy / d) * f;
      }
    };

    document.fonts
      ?.load(display(100))
      .then(() => {
        fontReady = true;
        sample(s);
        el.classList.add("is-live");
      })
      .catch(() => {
        fontReady = true;
        sample(s);
        el.classList.add("is-live");
      });

    return {
      resize(st) {
        if (fontReady) sample(st);
      },
      pointerdown(st) {
        if (!st.reduced) burst(st);
      },
      frame(st, dt) {
        const { ctx, w, h, colors: c, pointer } = st;
        ctx.clearRect(0, 0, w, h);
        if (!particles.length) return;
        const step = dt > 0 ? dt * 60 : 0;
        const ink = new Path2D();
        const acc = new Path2D();
        for (const p of particles) {
          if (step > 0) {
            const wob = Math.sin(st.time * 1.6 + p.phase) * 0.6;
            p.vx += (p.tx + wob - p.x) * 0.05 * step;
            p.vy += (p.ty - wob - p.y) * 0.05 * step;
            if (pointer.inside) {
              const dx = p.x - pointer.x;
              const dy = p.y - pointer.y;
              const d2 = dx * dx + dy * dy;
              if (d2 < RADIUS * RADIUS) {
                const d = Math.sqrt(d2) || 1;
                const f = (1 - d / RADIUS) * 3.2 * step;
                p.vx += (dx / d) * f;
                p.vy += (dy / d) * f;
              }
            }
            const damp = Math.pow(0.84, step);
            p.vx *= damp;
            p.vy *= damp;
            p.x += p.vx * step;
            p.y += p.vy * step;
          }
          (p.accent ? acc : ink).rect(p.x - size / 2, p.y - size / 2, size, size);
        }
        ctx.fillStyle = c.ink;
        ctx.fill(ink);
        ctx.fillStyle = c.accent;
        ctx.fill(acc);
      },
    };
  });
}
