import { initThemeToggle } from './theme';
import { initReveal } from './reveal';
import { initTilt } from './tilt';
import { initKonami } from './konami';
import { initMobileMenu } from './menu';

export function init(konamiMessage: string): void {
  initThemeToggle();
  initReveal();
  initTilt();
  initMobileMenu();
  initKonami(konamiMessage);
  // Raccourci clavier affiché selon la plateforme
  const isMac = /Mac|iPhone|iPad/.test(navigator.platform);
  if (!isMac) document.querySelectorAll('[data-mod-key]').forEach((el) => (el.textContent = 'Ctrl K'));
}
