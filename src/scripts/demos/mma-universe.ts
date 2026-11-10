// MMA Universe — FightScore simulator: two rating distributions (Glicko-style mean ± RD)
// and the resulting win probability. Hovering moves fighter A's rating.
import { alpha, display, mono, mountCanvas, roundRect } from "./runtime";

const T = {
  fr: { title: "Simulateur FightScore", a: "Combattant A", b: "Combattant B", win: "victoire", hint: "survole pour simuler" },
  en: { title: "FightScore simulator", a: "Fighter A", b: "Fighter B", win: "win", hint: "hover to simulate" },
};

const MIN = 1350;
const MAX = 2050;
const Q = Math.LN10 / 400;

/** Glicko-1 expected score of A vs B, combining both rating deviations. */
function winProbability(ra: number, rda: number, rb: number, rdb: number) {
  const g = 1 / Math.sqrt(1 + (3 * Q * Q * (rda * rda + rdb * rdb)) / (Math.PI * Math.PI));
  return 1 / (1 + Math.pow(10, (-g * (ra - rb)) / 400));
}

export function mount(el: HTMLElement) {
  return mountCanvas(el, () => {
    let ra = 1760;
    let rb = 1690;
    let shown = 0.6;
    let used = false;

    const gauss = (x: number, mu: number, sd: number) => Math.exp(-((x - mu) ** 2) / (2 * sd * sd));

    return {
      pointermove() {
        used = true;
      },
      frame(st, dt) {
        const { ctx, w, h, colors: c, time } = st;
        const t = T[st.lang];
        const pad = Math.max(16, w * 0.05);
        const plotTop = 54;
        const plotBottom = h - 86;
        const plotH = plotBottom - plotTop;
        const xOf = (r: number) => pad + ((r - MIN) / (MAX - MIN)) * (w - pad * 2);

        // Ratings drift like weekly updates; the pointer takes over fighter A.
        const rda = 48 + Math.sin(time * 0.7) * 10;
        const rdb = 70 + Math.cos(time * 0.5) * 14;
        let goalA = 1760 + Math.sin(time * 0.45) * 90;
        if (st.pointer.inside) {
          goalA = MIN + ((st.pointer.x - pad) / (w - pad * 2)) * (MAX - MIN);
          goalA = Math.max(MIN + 60, Math.min(MAX - 60, goalA));
        }
        const goalB = 1700 + Math.cos(time * 0.35) * 60;
        const k = dt ? Math.min(1, dt * 4) : 1;
        ra += (goalA - ra) * k;
        rb += (goalB - rb) * k;
        const p = winProbability(ra, rda, rb, rdb);
        shown += (p - shown) * (dt ? Math.min(1, dt * 6) : 1);

        ctx.clearRect(0, 0, w, h);

        ctx.font = mono(11, 600);
        ctx.fillStyle = c.muted;
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
        ctx.fillText(t.title.toUpperCase(), pad, 28);
        if (!used) {
          ctx.textAlign = "right";
          ctx.fillText(`↔ ${t.hint}`, w - pad, 28);
        }

        // Axis ticks.
        ctx.strokeStyle = alpha(c.muted, 0.25);
        ctx.lineWidth = 1;
        ctx.font = mono(10, 500);
        ctx.fillStyle = alpha(c.muted, 0.8);
        ctx.textAlign = "center";
        for (let r = 1400; r <= 2000; r += 100) {
          const x = xOf(r);
          ctx.beginPath();
          ctx.moveTo(x, plotTop);
          ctx.lineTo(x, plotBottom);
          ctx.stroke();
          if (w > 360 || r % 200 === 0) ctx.fillText(String(r), x, plotBottom + 14);
        }

        const curve = (mu: number, sd: number, color: string) => {
          ctx.beginPath();
          ctx.moveTo(xOf(MIN), plotBottom);
          for (let r = MIN; r <= MAX; r += 6) {
            ctx.lineTo(xOf(r), plotBottom - gauss(r, mu, sd) * plotH * 0.92);
          }
          ctx.lineTo(xOf(MAX), plotBottom);
          ctx.closePath();
          const grad = ctx.createLinearGradient(0, plotTop, 0, plotBottom);
          grad.addColorStop(0, alpha(color, 0.45));
          grad.addColorStop(1, alpha(color, 0.03));
          ctx.fillStyle = grad;
          ctx.fill();
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.stroke();
          const x = xOf(mu);
          ctx.setLineDash([3, 4]);
          ctx.beginPath();
          ctx.moveTo(x, plotBottom);
          ctx.lineTo(x, plotBottom - plotH * 0.92);
          ctx.stroke();
          ctx.setLineDash([]);
        };
        curve(rb, rdb, c.accent2);
        curve(ra, rda, c.accent);

        const label = (name: string, r: number, rd: number, color: string, x: number, align: CanvasTextAlign) => {
          ctx.textAlign = align;
          ctx.font = mono(11, 600);
          ctx.fillStyle = color;
          ctx.fillText(`${name} · ${Math.round(r)} ±${Math.round(rd)}`, x, plotTop - 6);
        };
        label(t.a, ra, rda, c.accent, pad, "left");
        label(t.b, rb, rdb, c.accent2, w - pad, "right");

        // Win probability bar.
        const barY = h - 46;
        const barH = 26;
        const barW = w - pad * 2;
        roundRect(ctx, pad, barY, barW, barH, 13);
        ctx.fillStyle = c.accent2;
        ctx.fill();
        ctx.save();
        roundRect(ctx, pad, barY, barW, barH, 13);
        ctx.clip();
        ctx.fillStyle = c.accent;
        ctx.fillRect(pad, barY, barW * shown, barH);
        ctx.fillStyle = c.surface;
        ctx.fillRect(pad + barW * shown - 1.5, barY, 3, barH);
        ctx.restore();

        ctx.font = display(15, 800);
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "left";
        ctx.fillText(`${Math.round(shown * 100)}%`, pad + 12, barY + barH / 2 + 1);
        ctx.textAlign = "right";
        ctx.fillText(`${Math.round((1 - shown) * 100)}%`, pad + barW - 12, barY + barH / 2 + 1);
        ctx.font = mono(10, 500);
        ctx.fillStyle = c.muted;
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";
        ctx.fillText(`P(${t.win})`, w / 2, barY - 6);
      },
    };
  });
}
