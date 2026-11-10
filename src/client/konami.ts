const CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

function swapAccent(ms: number): void {
  const root = document.documentElement;
  const cs = getComputedStyle(root);
  const a = cs.getPropertyValue('--accent');
  const b = cs.getPropertyValue('--accent-2');
  root.style.setProperty('--accent', b);
  root.style.setProperty('--accent-2', a);
  setTimeout(() => {
    root.style.removeProperty('--accent');
    root.style.removeProperty('--accent-2');
  }, ms);
}

export function initKonami(message: string): void {
  let pos = 0;
  addEventListener('keydown', (e) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    pos = key === CODE[pos] ? pos + 1 : key === CODE[0] ? 1 : 0;
    if (pos < CODE.length) return;
    pos = 0;
    const toast = document.createElement('div');
    toast.className =
      'toast rounded-full border border-line bg-surface px-5 py-3 font-mono text-sm text-ink shadow-lg';
    toast.setAttribute('role', 'status');
    toast.textContent = message;
    document.body.append(toast);
    requestAnimationFrame(() => toast.classList.add('is-visible'));
    swapAccent(2800);
    setTimeout(() => {
      toast.classList.remove('is-visible');
      setTimeout(() => toast.remove(), 400);
    }, 3200);
  });
}
