// DrVocal — wake word, live waveform, transcription and the action it triggers,
// with the fully local pipeline lighting up stage by stage.
import { alpha, mono, mountCanvas, roundRect } from "./runtime";

const SCRIPT = {
  fr: [
    ["« Dr Vocal… mets Daft Punk »", "▶ Spotify · lecture : Daft Punk"],
    ["« Dr Vocal… rejoins le salon Raid »", "🔊 Discord · salon vocal : Raid"],
    ["« Dr Vocal… note : racheter des piles »", "📝 Note enregistrée · notes/2026-11-10.txt"],
    ["« Dr Vocal… baisse le son »", "▶ Spotify · volume 40 %"],
  ],
  en: [
    ["“Dr Vocal… play Daft Punk”", "▶ Spotify · playing: Daft Punk"],
    ["“Dr Vocal… join the Raid channel”", "🔊 Discord · voice channel: Raid"],
    ["“Dr Vocal… note: buy batteries”", "📝 Note saved · notes/2026-11-10.txt"],
    ["“Dr Vocal… turn it down”", "▶ Spotify · volume 40%"],
  ],
};

const STAGES = ["wake word", "VAD", "whisper", "intent", "action"];
const LOCAL = { fr: "100 % local · aucune donnée envoyée", en: "100% local · nothing leaves the PC" };

// Phase timeline (seconds): idle → wake → listen → think → act.
const PHASES: [string, number][] = [
  ["idle", 0.9],
  ["wake", 0.5],
  ["listen", 2.1],
  ["think", 0.45],
  ["act", 1.9],
];

export function mount(el: HTMLElement) {
  return mountCanvas(el, () => {
    let line = 0;
    let phase = 0;
    let phaseT = 0;
    let level = 0;

    return {
      frame(st, dt) {
        const { ctx, w, h, colors: c, time } = st;
        if (st.reduced) {
          phase = 4;
          phaseT = 99;
        } else {
          phaseT += dt;
          if (phaseT > PHASES[phase][1]) {
            phaseT = 0;
            phase = (phase + 1) % PHASES.length;
            if (phase === 0) line = (line + 1) % SCRIPT.fr.length;
          }
        }
        const name = PHASES[phase][0];
        const [said, done] = SCRIPT[st.lang][line];
        const talking = name === "listen" || (st.pointer.inside && name !== "act");
        level += ((talking ? 1 : name === "wake" ? 0.35 : 0.08) - level) * Math.min(1, dt * 8 || 1);

        ctx.clearRect(0, 0, w, h);
        const pad = Math.max(16, w * 0.05);
        const midY = h * 0.38;

        // Wake orb.
        const orbX = pad + 22;
        const awake = name !== "idle";
        if (name === "wake") {
          const k = phaseT / PHASES[1][1];
          ctx.beginPath();
          ctx.arc(orbX, midY, 18 + k * 26, 0, Math.PI * 2);
          ctx.strokeStyle = alpha(c.accent, 1 - k);
          ctx.lineWidth = 3;
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(orbX, midY, 18, 0, Math.PI * 2);
        ctx.fillStyle = awake ? c.accent : alpha(c.ink, 0.12);
        ctx.fill();
        ctx.fillStyle = awake ? c.accentInk : c.muted;
        ctx.font = mono(13, 700);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("DV", orbX, midY + 1);

        // Waveform.
        const x0 = orbX + 36;
        const span = w - pad - x0;
        const bars = Math.max(18, Math.floor(span / 7));
        const bw = span / bars;
        for (let i = 0; i < bars; i++) {
          const k = i / bars;
          const env = Math.sin(Math.PI * k);
          const n =
            Math.sin(time * 9 + i * 0.55) * 0.5 +
            Math.sin(time * 13.7 + i * 1.3) * 0.3 +
            Math.sin(time * 4.1 + i * 0.21) * 0.2;
          const amp = 3 + Math.abs(n) * env * level * h * 0.22;
          ctx.fillStyle = talking ? alpha(c.accent, 0.55 + env * 0.45) : alpha(c.muted, 0.45);
          roundRect(ctx, x0 + i * bw, midY - amp, Math.max(2, bw - 3), amp * 2, 2);
          ctx.fill();
        }

        // Transcript then action.
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
        const textY = h * 0.66;
        const maxChars = Math.max(18, Math.floor((w - pad * 2) / 7.6));
        const fit = (str: string) => (str.length > maxChars ? str.slice(0, maxChars - 1) + "…" : str);
        if (name === "listen" || name === "think" || name === "act") {
          const k = name === "listen" ? Math.min(1, phaseT / (PHASES[2][1] * 0.85)) : 1;
          const typed = fit(said).slice(0, Math.ceil(fit(said).length * k));
          ctx.font = mono(13, 500);
          ctx.fillStyle = c.ink;
          ctx.fillText(typed + (name === "listen" && Math.floor(time * 3) % 2 ? "▍" : ""), pad, textY);
        } else {
          ctx.font = mono(12, 500);
          ctx.fillStyle = c.muted;
          ctx.fillText("…", pad, textY);
        }
        if (name === "act") {
          const k = Math.min(1, phaseT / 0.3);
          ctx.globalAlpha = k;
          ctx.font = mono(12, 600);
          ctx.fillStyle = c.live;
          ctx.fillText(fit(done), pad, textY + 22);
          ctx.globalAlpha = 1;
        }

        // Pipeline stages.
        const lit = name === "idle" ? -1 : name === "wake" ? 0 : name === "listen" ? (phaseT < 0.4 ? 1 : 2) : name === "think" ? 3 : 4;
        const chipY = h - 36;
        ctx.font = mono(10, 600);
        const widths = STAGES.map((sname) => ctx.measureText(sname).width + 16);
        const gap = 14;
        const total = widths.reduce((a, b) => a + b, 0) + gap * (STAGES.length - 1);
        const scale = Math.min(1, (w - pad * 2) / total);
        ctx.save();
        ctx.translate(pad, chipY);
        ctx.scale(scale, scale);
        let x = 0;
        STAGES.forEach((sname, i) => {
          const on = i <= lit;
          roundRect(ctx, x, 0, widths[i], 22, 11);
          ctx.fillStyle = i === lit ? c.accent : on ? alpha(c.accent, 0.18) : alpha(c.ink, 0.06);
          ctx.fill();
          ctx.fillStyle = i === lit ? c.accentInk : on ? c.accent : c.muted;
          ctx.textBaseline = "middle";
          ctx.fillText(sname, x + 8, 11.5);
          if (i < STAGES.length - 1) {
            ctx.fillStyle = alpha(c.muted, 0.6);
            ctx.fillText("›", x + widths[i] + 3, 11.5);
          }
          x += widths[i] + gap;
        });
        ctx.restore();
        ctx.textBaseline = "alphabetic";
        ctx.font = mono(10, 500);
        ctx.fillStyle = c.muted;
        ctx.textAlign = "left";
        ctx.fillText(LOCAL[st.lang], pad, 24);
      },
    };
  });
}
