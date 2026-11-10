export function initMobileMenu(): void {
  const btn = document.querySelector<HTMLButtonElement>('[data-menu-button]');
  const panel = document.getElementById('mobile-nav');
  if (!btn || !panel) return;
  const set = (open: boolean) => {
    btn.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
  };
  btn.addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true'));
  panel.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('a')) set(false);
  });
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.hidden) {
      set(false);
      btn.focus();
    }
  });
}
