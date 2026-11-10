// Shared canvas runtime for the project mini-demos and the hero.
// Handles DPR-aware sizing, theme colors, pointer state, and pausing when offscreen or
// when the visitor prefers reduced motion (a single static frame is drawn instead).

export interface Palette {
  bg: string;
  surface: string;
  surface2: string;
  ink: string;
  muted: string;
  line: string;
  accent: string;
  accentInk: string;
  accent2: string;
  live: string;
  wip: string;
}

export interface Pointer {
  x: number;
  y: number;
  inside: boolean;
  down: boolean;
}

export interface DemoState {
  el: HTMLElement;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  w: number;
  h: number;
  dpr: number;
  pointer: Pointer;
  colors: Palette;
  reduced: boolean;
  time: number;
  lang: "fr" | "en";
}

export interface DemoHooks {
  frame(s: DemoState, dt: number): void;
  resize?(s: DemoState): void;
  theme?(s: DemoState): void;
  pointerdown?(s: DemoState, e: PointerEvent): void;
  pointermove?(s: DemoState, e: PointerEvent): void;
  pointerup?(s: DemoState, e: PointerEvent): void;
  destroy?(): void;
}

const VARS: Record<keyof Palette, string> = {
  bg: "--bg",
  surface: "--surface",
  surface2: "--surface-2",
  ink: "--ink",
  muted: "--muted",
  line: "--line",
  accent: "--accent",
  accentInk: "--accent-ink",
  accent2: "--accent-2",
  live: "--live",
  wip: "--wip",
};

export function readPalette(): Palette {
  const cs = getComputedStyle(document.documentElement);
  const out = {} as Palette;
  for (const key of Object.keys(VARS) as (keyof Palette)[]) {
    out[key] = cs.getPropertyValue(VARS[key]).trim() || "#888888";
  }
  return out;
}

/** Applies an alpha to a #rgb / #rrggbb color; other formats are returned unchanged. */
export function alpha(color: string, a: number): string {
  let hex = color.replace("#", "");
  if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
  if (!/^[0-9a-f]{6}$/i.test(hex)) return color;
  const n = parseInt(hex, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const pageLang = (): "fr" | "en" =>
  document.documentElement.lang.toLowerCase().startsWith("en") ? "en" : "fr";

export const mono = (size: number, weight = 500) =>
  `${weight} ${size}px "JetBrains Mono", ui-monospace, monospace`;

export const display = (size: number, weight = 800) =>
  `${weight} ${size}px "Bricolage Grotesque", ui-sans-serif, system-ui, sans-serif`;

export function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

export function mountCanvas(
  el: HTMLElement,
  setup: (s: DemoState) => DemoHooks,
): () => void {
  const canvas = document.createElement("canvas");
  canvas.style.cssText = "display:block;width:100%;height:100%;touch-action:pan-y;";
  el.appendChild(canvas);
  const ctx = canvas.getContext("2d")!;

  const s: DemoState = {
    el,
    canvas,
    ctx,
    w: 0,
    h: 0,
    dpr: 1,
    pointer: { x: -9999, y: -9999, inside: false, down: false },
    colors: readPalette(),
    reduced: prefersReducedMotion(),
    time: 0,
    lang: pageLang(),
  };
  const hooks = setup(s);

  let visible = false;
  let raf = 0;
  let last = 0;

  const drawOnce = () => {
    if (s.w > 0 && s.h > 0) hooks.frame(s, 0);
  };

  const tick = (now: number) => {
    const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
    last = now;
    s.time += dt;
    hooks.frame(s, dt);
    raf = requestAnimationFrame(tick);
  };

  const sync = () => {
    const shouldRun = visible && !document.hidden && !s.reduced && s.w > 0;
    if (shouldRun && !raf) {
      last = 0;
      raf = requestAnimationFrame(tick);
    } else if (!shouldRun && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };

  const resize = () => {
    const w = el.clientWidth;
    const h = el.clientHeight;
    if (!w || !h) return;
    s.w = w;
    s.h = h;
    s.dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * s.dpr);
    canvas.height = Math.round(h * s.dpr);
    ctx.setTransform(s.dpr, 0, 0, s.dpr, 0, 0);
    hooks.resize?.(s);
    if (!raf) drawOnce();
    sync();
  };

  const onTheme = () => {
    s.colors = readPalette();
    hooks.theme?.(s);
    if (!raf) drawOnce();
  };

  const local = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    s.pointer.x = e.clientX - r.left;
    s.pointer.y = e.clientY - r.top;
  };
  const onDown = (e: PointerEvent) => {
    local(e);
    s.pointer.down = true;
    s.pointer.inside = true;
    hooks.pointerdown?.(s, e);
    if (!raf) drawOnce();
  };
  const onMove = (e: PointerEvent) => {
    local(e);
    s.pointer.inside = true;
    hooks.pointermove?.(s, e);
    if (!raf) drawOnce();
  };
  const onUp = (e: PointerEvent) => {
    s.pointer.down = false;
    hooks.pointerup?.(s, e);
  };
  const onLeave = (e: PointerEvent) => {
    s.pointer.inside = false;
    s.pointer.down = false;
    s.pointer.x = s.pointer.y = -9999;
    hooks.pointerup?.(s, e);
    if (!raf) drawOnce();
  };

  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointerleave", onLeave);
  canvas.addEventListener("pointercancel", onLeave);

  const ro = new ResizeObserver(resize);
  ro.observe(el);

  const io = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      sync();
    },
    { rootMargin: "100px" },
  );
  io.observe(el);

  const mo = new MutationObserver(onTheme);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "lang"] });
  const dark = window.matchMedia("(prefers-color-scheme: dark)");
  dark.addEventListener("change", onTheme);
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const onMotion = () => {
    s.reduced = motion.matches;
    sync();
    if (!raf) drawOnce();
  };
  motion.addEventListener("change", onMotion);
  document.addEventListener("visibilitychange", sync);

  // Fonts may land after the first frame; redraw once they are ready.
  document.fonts?.ready.then(() => {
    hooks.resize?.(s);
    if (!raf) drawOnce();
  });

  resize();

  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    io.disconnect();
    mo.disconnect();
    dark.removeEventListener("change", onTheme);
    motion.removeEventListener("change", onMotion);
    document.removeEventListener("visibilitychange", sync);
    window.removeEventListener("pointerup", onUp);
    hooks.destroy?.();
    canvas.remove();
  };
}
