// DailyLingua — one word cascading through languages, with the daily mission filling up.
import { alpha, display, mono, mountCanvas, roundRect } from "./runtime";

const WORDS: [string, string][] = [
  ["fr", "curiosité"],
  ["en", "curiosity"],
  ["es", "curiosidad"],
  ["de", "Neugier"],
  ["it", "curiosità"],
  ["pt", "curiosidade"],
  ["nl", "nieuwsgierigheid"],
  ["ru", "любопытство"],
  ["ja", "好奇心"],
  ["pl", "ciekawość"],
  ["sv", "nyfikenhet"],
  ["ko", "호기심"],
  ["el", "περιέργεια"],
  ["tr", "merak"],
];

const T = {
  fr: { mission: "Mission du jour", streak: "jours d'affilée" },
  en: { mission: "Daily mission", streak: "day streak" },
};

const SCRAMBLE = 0.55;
const HOLD = 1.5;

export function mount(el: HTMLElement) {
  return mountCanvas(el, () => {
    let index = 0;
    let since = HOLD; // start fully revealed
    let progress = 0;

    const glyphs = (word: string) => Array.from(new Set(Array.from(word + "aeiourstnl")));

    return {
      pointerdown() {
        index = (index + 1) % WORDS.length;
        since = 0;
      },
      frame(st, dt) {
        const { ctx, w, h, colors: c } = st;
        const t = T[st.lang];
        const speed = st.pointer.inside ? 2.2 : 1;
        since += dt * speed;
        if (since > SCRAMBLE + HOLD) {
          index = (index + 1) % WORDS.length;
          since = 0;
        }
        progress = (index + Math.min(1, since / (SCRAMBLE + HOLD))) / WORDS.length;
        const [code, word] = WORDS[index];
        const chars = Array.from(word);

        ctx.clearRect(0, 0, w, h);
        const pad = Math.max(16, w * 0.05);

        // Language chips, scrolled so the active one stays visible.
        ctx.font = mono(11, 600);
        ctx.textBaseline = "middle";
        const chipW = 38;
        const gap = 6;
        const total = WORDS.length * (chipW + gap);
        const offset = Math.max(0, Math.min(total - (w - pad * 2), index * (chipW + gap) - (w - pad * 2) / 2 + chipW / 2));
        WORDS.forEach(([lc], i) => {
          const x = pad + i * (chipW + gap) - offset;
          if (x < pad - chipW || x > w - pad) return;
          const active = i === index;
          roundRect(ctx, x, 18, chipW, 24, 12);
          ctx.fillStyle = active ? c.accent : alpha(c.ink, 0.06);
          ctx.fill();
          ctx.fillStyle = active ? c.accentInk : c.muted;
          ctx.textAlign = "center";
          ctx.fillText(lc.toUpperCase(), x + chipW / 2, 30.5);
        });
        // Fade the chip row edges.
        for (const [x0, x1] of [[0, pad + 10], [w, w - pad - 10]]) {
          const g = ctx.createLinearGradient(x0, 0, x1, 0);
          g.addColorStop(0, c.surface2);
          g.addColorStop(1, alpha(c.surface2, 0));
          ctx.fillStyle = g;
          ctx.fillRect(Math.min(x0, x1), 14, Math.abs(x1 - x0), 32);
        }

        // The word, scrambling into place letter by letter.
        const pool = glyphs(word);
        const reveal = st.reduced ? 1 : Math.min(1, since / SCRAMBLE);
        const shown = chars
          .map((ch, i) => {
            if (ch === " " || i / chars.length < reveal) return ch;
            return pool[Math.floor((st.time * 30 + i * 7) % pool.length)];
          })
          .join("");
        let size = Math.min(64, h * 0.24);
        ctx.font = display(size, 800);
        const maxW = w - pad * 2;
        const measured = ctx.measureText(word).width;
        if (measured > maxW) {
          size *= maxW / measured;
          ctx.font = display(size, 800);
        }
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = c.ink;
        ctx.fillText(shown, w / 2, h * 0.5);
        ctx.font = mono(12, 500);
        ctx.fillStyle = c.accent;
        ctx.fillText(`/${code}/`, w / 2, h * 0.5 + size * 0.62 + 8);

        // Mission bar + streak.
        const barY = h - 38;
        ctx.font = mono(11, 600);
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = c.muted;
        ctx.fillText(t.mission.toUpperCase(), pad, barY - 10);
        ctx.textAlign = "right";
        ctx.fillText(`🔥 12 ${t.streak}`, w - pad, barY - 10);
        roundRect(ctx, pad, barY, w - pad * 2, 10, 5);
        ctx.fillStyle = alpha(c.ink, 0.08);
        ctx.fill();
        roundRect(ctx, pad, barY, Math.max(10, (w - pad * 2) * progress), 10, 5);
        ctx.fillStyle = c.live;
        ctx.fill();
      },
    };
  });
}
