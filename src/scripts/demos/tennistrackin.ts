// TennisTrackin — rear-camera view of a simulated rally with YOLO-style detections,
// ball trail and the bounce map the pipeline turns into stats.
import { alpha, mono, mountCanvas, roundRect, type DemoState } from "./runtime";

const T = {
  fr: { rally: "échange", shots: "coups", bounces: "rebonds" },
  en: { rally: "rally", shots: "shots", bounces: "bounces" },
};

const SHOT = 1.15;
const BOUNCE_AT = 0.68;
const K = 0.55; // perspective strength (net sits ~40% down the court, like a rear broadcast cam)

interface Shot {
  from: [number, number];
  bounce: [number, number];
  to: [number, number];
}

export function mount(el: HTMLElement) {
  return mountCanvas(el, (s: DemoState) => {
    let shot: Shot;
    let shotT = 0;
    let towardFar = true;
    let rally = 1;
    let frameNo = 1200;
    const trail: [number, number][] = [];
    const bounces: { u: number; v: number; age: number }[] = [];
    const near = { u: 0.1, goal: 0.1 };
    const far = { u: -0.2, goal: -0.2 };

    const newShot = () => {
      const fromPlayer = towardFar ? near : far;
      const toV = towardFar ? 1.06 : -0.06;
      const fromV = towardFar ? -0.06 : 1.06;
      const bounceV = towardFar ? 0.62 + Math.random() * 0.33 : 0.05 + Math.random() * 0.33;
      const bounceU = (Math.random() * 2 - 1) * 0.68;
      const toU = Math.max(-0.95, Math.min(0.95, bounceU * 1.3));
      shot = { from: [fromPlayer.u, fromV], bounce: [bounceU, bounceV], to: [toU, toV] };
      (towardFar ? far : near).goal = toU;
      shotT = 0;
    };
    newShot();

    const project = (st: DemoState, u: number, v: number, z = 0) => {
      const top = st.h * 0.27;
      const bottom = st.h * 0.82;
      const p = (1 / (1 + K * v) - 1 / (1 + K)) / (1 - 1 / (1 + K));
      const y = top + (bottom - top) * p;
      const unit = Math.min(st.w, st.h * 1.5);
      const half = unit * (0.16 + 0.17 * p);
      const scale = 0.45 + p * 0.55;
      return { x: st.w / 2 + u * half, y: y - z * 70 * scale, scale };
    };

    const ballAt = (t: number): [number, number, number] => {
      if (t < BOUNCE_AT) {
        const k = t / BOUNCE_AT;
        const u = shot.from[0] + (shot.bounce[0] - shot.from[0]) * k;
        const v = shot.from[1] + (shot.bounce[1] - shot.from[1]) * k;
        return [u, v, 0.35 + Math.sin(Math.PI * k) * 0.9 - 0.35 * k];
      }
      const k = (t - BOUNCE_AT) / (1 - BOUNCE_AT);
      const u = shot.bounce[0] + (shot.to[0] - shot.bounce[0]) * k;
      const v = shot.bounce[1] + (shot.to[1] - shot.bounce[1]) * k;
      return [u, v, Math.sin(Math.PI * k * 0.75) * 0.55];
    };

    const box = (x: number, y: number, bw: number, bh: number, label: string, color: string) => {
      const { ctx } = s;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x, y, bw, bh);
      ctx.font = mono(9, 600);
      const tw = ctx.measureText(label).width + 8;
      ctx.fillStyle = color;
      ctx.fillRect(x - 0.75, y - 14, tw, 14);
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(label, x + 3, y - 6.5);
    };

    const player = (st: DemoState, u: number, v: number, conf: string) => {
      const p = project(st, u, v);
      const hgt = 46 * p.scale * Math.min(1.2, st.h / 260);
      const wd = hgt * 0.42;
      const { ctx, colors: c } = st;
      ctx.fillStyle = alpha(c.ink, 0.85);
      roundRect(ctx, p.x - wd / 2, p.y - hgt, wd, hgt * 0.78, wd / 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(p.x, p.y - hgt - wd * 0.3, wd * 0.36, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, wd * 0.8, wd * 0.22, 0, 0, Math.PI * 2);
      ctx.fillStyle = alpha("#000000", 0.18);
      ctx.fill();
      const pad = 5 * p.scale + 2;
      box(p.x - wd / 2 - pad, p.y - hgt - wd * 0.7 - pad, wd + pad * 2, hgt + wd * 0.7 + pad * 1.4, `player ${conf}`, c.accent2);
    };

    return {
      frame(st, dt) {
        const { ctx, w, h, colors: c } = st;
        const t = T[st.lang];
        if (dt > 0) {
          shotT += dt / SHOT;
          frameNo += 1;
          if (shotT >= 1) {
            towardFar = !towardFar;
            rally += 1;
            if (rally > 12) {
              rally = 1;
              bounces.length = 0;
            }
            newShot();
          }
          for (const pl of [near, far]) pl.u += (pl.goal - pl.u) * Math.min(1, dt * 2.2);
          bounces.forEach((b) => (b.age += dt));
        }
        const prevT = shotT - dt / SHOT;
        if (dt > 0 && prevT < BOUNCE_AT && shotT >= BOUNCE_AT) {
          bounces.push({ u: shot.bounce[0], v: shot.bounce[1], age: 0 });
          if (bounces.length > 14) bounces.shift();
        }

        ctx.clearRect(0, 0, w, h);

        // Court surface and lines.
        const corner = (u: number, v: number) => project(st, u, v);
        const quad = (u0: number, u1: number, v0: number, v1: number) => {
          const a = corner(u0, v0), b = corner(u1, v0), d = corner(u1, v1), e = corner(u0, v1);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.lineTo(d.x, d.y);
          ctx.lineTo(e.x, e.y);
          ctx.closePath();
        };
        quad(-1.25, 1.25, -0.18, 1.12);
        ctx.fillStyle = alpha(c.accent2, 0.1);
        ctx.fill();
        quad(-1, 1, 0, 1);
        ctx.fillStyle = alpha(c.accent2, 0.2);
        ctx.fill();
        const line = (u0: number, v0: number, u1: number, v1: number, wdt = 1.4) => {
          const a = corner(u0, v0), b = corner(u1, v1);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = alpha(c.ink, 0.7);
          ctx.lineWidth = wdt;
          ctx.stroke();
        };
        line(-1, 0, 1, 0);
        line(-1, 1, 1, 1);
        for (const u of [-1, -0.75, 0.75, 1]) line(u, 0, u, 1);
        for (const v of [0.231, 0.769]) line(-0.75, v, 0.75, v);
        line(0, 0.231, 0, 0.769);

        // Bounce heatmap.
        for (const b of bounces) {
          const p = corner(b.u, b.v);
          const r = 7 * p.scale;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fillStyle = alpha(c.accent, Math.max(0.25, 0.75 - b.age * 0.04));
          ctx.fill();
        }

        // Far player is behind the net, near player in front.
        player(st, far.u, 1.06, "0.94");
        const n1 = corner(-1.12, 0.5), n2 = corner(1.12, 0.5);
        ctx.fillStyle = alpha(c.ink, 0.12);
        ctx.fillRect(n1.x, n1.y - 22 * n1.scale, n2.x - n1.x, 22 * n1.scale);
        ctx.strokeStyle = alpha(c.ink, 0.75);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(n1.x, n1.y - 22 * n1.scale);
        ctx.lineTo(n2.x, n2.y - 22 * n2.scale);
        ctx.stroke();

        // Ball, shadow and trail.
        const [bu, bv, bz] = ballAt(Math.min(1, shotT));
        const shadow = corner(bu, bv);
        const ball = project(st, bu, bv, bz);
        if (dt > 0) {
          trail.push([ball.x, ball.y]);
          if (trail.length > 18) trail.shift();
        }
        trail.forEach(([x, y], i) => {
          ctx.beginPath();
          ctx.arc(x, y, 1 + (i / trail.length) * 3 * ball.scale, 0, Math.PI * 2);
          ctx.fillStyle = alpha(c.accent, (i / trail.length) * 0.5);
          ctx.fill();
        });
        ctx.beginPath();
        ctx.ellipse(shadow.x, shadow.y, 5 * ball.scale, 2 * ball.scale, 0, 0, Math.PI * 2);
        ctx.fillStyle = alpha("#000000", 0.2);
        ctx.fill();
        const br = 4.5 * ball.scale + 1;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, br, 0, Math.PI * 2);
        ctx.fillStyle = "#d7f205";
        ctx.fill();
        ctx.strokeStyle = alpha("#000000", 0.35);
        ctx.lineWidth = 1;
        ctx.stroke();
        const conf = (0.82 + Math.abs(Math.sin(st.time * 3.1)) * 0.15).toFixed(2);
        box(ball.x - br - 4, ball.y - br - 4, br * 2 + 8, br * 2 + 8, `ball ${conf}`, c.accent);

        player(st, near.u, -0.06, "0.97");

        // HUD.
        ctx.font = mono(10, 600);
        ctx.textBaseline = "alphabetic";
        ctx.textAlign = "left";
        ctx.fillStyle = c.muted;
        ctx.fillText(`● REC  frame ${String(frameNo).padStart(5, "0")}`, 14, 22);
        ctx.textAlign = "right";
        ctx.fillText(`${t.rally} ${rally} · ${bounces.length} ${t.bounces}`, w - 14, 22);
      },
    };
  });
}
