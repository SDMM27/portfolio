// GeoGame — a draggable orthographic globe playing a tiny "find the city" round on its own.
import { geoDistance, geoGraticule10, geoOrthographic, geoPath } from "d3-geo";
import type { GeoPermissibleObjects } from "d3-geo";
import { feature } from "topojson-client";
import landTopo from "world-atlas/land-110m.json";
import { alpha, mono, mountCanvas, roundRect, type DemoState } from "./runtime";

type LonLat = [number, number];

const CITIES: { fr: string; en: string; at: LonLat }[] = [
  { fr: "Tokyo", en: "Tokyo", at: [139.69, 35.69] },
  { fr: "Rio de Janeiro", en: "Rio de Janeiro", at: [-43.2, -22.9] },
  { fr: "Le Caire", en: "Cairo", at: [31.24, 30.04] },
  { fr: "Sydney", en: "Sydney", at: [151.21, -33.87] },
  { fr: "Reykjavik", en: "Reykjavik", at: [-21.9, 64.15] },
  { fr: "New York", en: "New York", at: [-74.0, 40.71] },
  { fr: "Nairobi", en: "Nairobi", at: [36.82, -1.29] },
  { fr: "Paris", en: "Paris", at: [2.35, 48.86] },
  { fr: "Lima", en: "Lima", at: [-77.04, -12.05] },
  { fr: "Bombay", en: "Mumbai", at: [72.88, 19.08] },
];

const T = {
  fr: { find: "Trouve", score: "Score", hint: "glisse pour tourner", found: "Trouvé" },
  en: { find: "Find", score: "Score", hint: "drag to spin", found: "Found" },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const topo = landTopo as any;
const land = feature(topo, topo.objects.land) as unknown as GeoPermissibleObjects;
const graticule = geoGraticule10();
const sphere = { type: "Sphere" } as GeoPermissibleObjects;

const wrap = (deg: number) => ((((deg + 180) % 360) + 360) % 360) - 180;

export function mount(el: HTMLElement) {
  return mountCanvas(el, (s: DemoState) => {
    const projection = geoOrthographic().clipAngle(90).precision(0.5);
    const path = geoPath(projection, s.ctx);

    let rot: [number, number] = [-10, -30];
    let phase: "search" | "seek" | "found" | "manual" = "search";
    let phaseT = 0;
    let target = 0;
    let score = 0;
    let idle = 0;
    let interacted = false;
    let drag: { x: number; y: number; rot: [number, number]; moved: boolean } | null = null;
    let burst = 0;

    // A drag on a card that is also a link must not navigate.
    const swallowClick = (e: MouseEvent) => {
      if (drag?.moved || justDragged) {
        e.preventDefault();
        e.stopPropagation();
        justDragged = false;
      }
    };
    let justDragged = false;
    s.el.addEventListener("click", swallowClick, true);

    const radius = () => Math.min(s.w, s.h) * 0.4;
    const center = (): LonLat => [-rot[0], -rot[1]];

    const nextTarget = () => {
      target = (target + 1 + Math.floor(Math.random() * 3)) % CITIES.length;
      phase = "search";
      phaseT = 0;
    };

    const succeed = () => {
      score += 100;
      burst = 1;
      phase = "found";
      phaseT = 0;
    };

    const step = (dt: number) => {
      phaseT += dt;
      burst = Math.max(0, burst - dt * 1.4);
      const goal = CITIES[target].at;

      if (phase === "manual") {
        if (!drag) idle += dt;
        if (geoDistance(center(), goal) < 0.22) succeed();
        else if (idle > 2.5) phase = "search";
        return;
      }
      if (phase === "search") {
        rot[0] = wrap(rot[0] + dt * 22);
        rot[1] += (-20 - rot[1]) * Math.min(1, dt * 1.5);
        if (phaseT > 1.6) {
          phase = "seek";
          phaseT = 0;
        }
      } else if (phase === "seek") {
        const k = Math.min(1, dt * 2.6);
        rot[0] = wrap(rot[0] + wrap(-goal[0] - rot[0]) * k);
        rot[1] += (-goal[1] - rot[1]) * k;
        if (geoDistance(center(), goal) < 0.03) succeed();
      } else if (phase === "found" && phaseT > 1.3) {
        nextTarget();
      }
    };

    const drawPin = (p: [number, number], color: string, size: number) => {
      const { ctx } = s;
      ctx.beginPath();
      ctx.arc(p[0], p[1], size, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    };

    const chip = (text: string, x: number, y: number, fg: string, bg: string, align: "left" | "right") => {
      const { ctx } = s;
      ctx.font = mono(12, 600);
      const tw = ctx.measureText(text).width;
      const w = tw + 20;
      const left = align === "left" ? x : x - w;
      roundRect(ctx, left, y, w, 26, 13);
      ctx.fillStyle = bg;
      ctx.fill();
      ctx.fillStyle = fg;
      ctx.textBaseline = "middle";
      ctx.textAlign = "left";
      ctx.fillText(text, left + 10, y + 13.5);
    };

    return {
      pointerdown(st, e) {
        drag = { x: e.clientX, y: e.clientY, rot: [...rot] as [number, number], moved: false };
        st.canvas.setPointerCapture?.(e.pointerId);
      },
      pointermove(_st, e) {
        if (!drag) return;
        const dx = e.clientX - drag.x;
        const dy = e.clientY - drag.y;
        if (!drag.moved && Math.hypot(dx, dy) > 5) {
          drag.moved = true;
          interacted = true;
          phase = "manual";
        }
        if (!drag.moved) return;
        const k = 180 / (Math.PI * radius());
        rot = [wrap(drag.rot[0] + dx * k), Math.max(-75, Math.min(75, drag.rot[1] - dy * k))];
        idle = 0;
      },
      pointerup() {
        if (drag?.moved) justDragged = true;
        drag = null;
        idle = 0;
      },
      destroy() {
        s.el.removeEventListener("click", swallowClick, true);
      },
      frame(st, dt) {
        if (dt > 0) step(dt);
        const { ctx, w, h, colors: c } = st;
        const r = radius();
        const cx = w / 2;
        const cy = h / 2 + 8;
        projection.scale(r).translate([cx, cy]).rotate([rot[0], rot[1], 0]);

        ctx.clearRect(0, 0, w, h);

        const glow = ctx.createRadialGradient(cx, cy, r * 0.6, cx, cy, r * 1.35);
        glow.addColorStop(0, alpha(c.accent, 0.18));
        glow.addColorStop(1, alpha(c.accent, 0));
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, w, h);

        ctx.beginPath();
        path(sphere);
        ctx.fillStyle = c.surface;
        ctx.fill();

        ctx.beginPath();
        path(graticule);
        ctx.strokeStyle = alpha(c.muted, 0.22);
        ctx.lineWidth = 0.6;
        ctx.stroke();

        ctx.beginPath();
        path(land);
        ctx.fillStyle = alpha(c.ink, 0.86);
        ctx.fill();

        ctx.beginPath();
        path(sphere);
        ctx.strokeStyle = c.line;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        const view = center();
        CITIES.forEach((city, i) => {
          if (geoDistance(view, city.at) > Math.PI / 2 - 0.05) return;
          const p = projection(city.at);
          if (!p) return;
          if (i === target) {
            const pulse = (st.time * 1.2) % 1;
            ctx.beginPath();
            ctx.arc(p[0], p[1], 6 + pulse * 16, 0, Math.PI * 2);
            ctx.strokeStyle = alpha(c.accent, 0.7 * (1 - pulse));
            ctx.lineWidth = 2;
            ctx.stroke();
            drawPin(p, c.accent, 5.5);
          } else {
            drawPin(p, alpha(c.surface, 0.95), 3.2);
            drawPin(p, alpha(c.muted, 0.9), 2);
          }
        });

        // Aim reticle at the center of the view.
        const ok = phase === "found";
        ctx.strokeStyle = ok ? c.live : alpha(c.accent, 0.9);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, 13, 0, Math.PI * 2);
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          ctx.moveTo(cx + dx * 9, cy + dy * 9);
          ctx.lineTo(cx + dx * 19, cy + dy * 19);
        }
        ctx.stroke();

        if (burst > 0) {
          ctx.beginPath();
          ctx.arc(cx, cy, 14 + (1 - burst) * r * 0.5, 0, Math.PI * 2);
          ctx.strokeStyle = alpha(c.live, burst * 0.8);
          ctx.lineWidth = 3;
          ctx.stroke();
          ctx.font = mono(15, 700);
          ctx.textAlign = "center";
          ctx.fillStyle = alpha(c.live, Math.min(1, burst * 2));
          ctx.fillText("+100", cx, cy - 28 - (1 - burst) * 18);
        }

        const t = T[st.lang];
        const name = CITIES[target][st.lang];
        chip(ok ? `✓ ${t.found} : ${name}` : `${t.find} : ${name}`, 14, 14, ok ? "#fff" : c.ink, ok ? c.live : alpha(c.surface, 0.92), "left");
        chip(`${t.score} ${score}`, w - 14, 14, c.accent, alpha(c.surface, 0.92), "right");
        if (!interacted) {
          ctx.font = mono(11, 500);
          ctx.fillStyle = alpha(c.muted, 0.9);
          ctx.textAlign = "center";
          ctx.fillText(`↔ ${t.hint}`, cx, h - 14);
        }
      },
    };
  });
}
