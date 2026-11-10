// Lazily mounts each [data-demo] element when it approaches the viewport,
// so a demo's code (and the globe's map data) only loads when needed.

type Loader = () => Promise<{ mount: (el: HTMLElement) => () => void }>;

const LOADERS: Record<string, Loader> = {
  geogame: () => import("./geogame"),
  "mma-universe": () => import("./mma-universe"),
  dailylingua: () => import("./dailylingua"),
  artuniverse: () => import("./artuniverse"),
  tennistrackin: () => import("./tennistrackin"),
  drvocal: () => import("./drvocal"),
};

export function initDemos(root: ParentNode = document) {
  const pending = root.querySelectorAll<HTMLElement>("[data-demo]:not([data-demo-ready])");
  if (!pending.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        io.unobserve(el);
        const load = LOADERS[el.dataset.demo ?? ""];
        if (!load) continue;
        load()
          .then(({ mount }) => {
            mount(el);
            el.dataset.demoReady = "true";
          })
          .catch((err) => console.error(`Demo "${el.dataset.demo}" failed to load`, err));
      }
    },
    { rootMargin: "300px" },
  );
  pending.forEach((el) => io.observe(el));
}
