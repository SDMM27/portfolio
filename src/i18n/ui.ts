export const languages = ['fr', 'en'] as const;
export type Lang = (typeof languages)[number];
export const defaultLang: Lang = 'fr';

export function isLang(value: string | undefined): value is Lang {
  return value === 'fr' || value === 'en';
}

/** Segment d'URL de la section projets, propre à chaque langue. */
export const segments = { projects: { fr: 'projets', en: 'projects' } } as const;

const fr = {
  siteTitle: 'Sacha Don — Développeur IA & full-stack',
  siteDescription:
    'Portfolio de Sacha Don, développeur IA et full-stack : GeoGame, MMA Universe, DailyLingua et projets en cours (ArtUniverse, TennisTrackin, Dr Vocal).',
  skip: 'Aller au contenu',
  nav: { projects: 'Projets', stack: 'Stack', path: 'Parcours', contact: 'Contact' },
  menu: 'Menu',
  primaryNav: 'Navigation principale',
  langSwitch: 'Passer en anglais',
  langSwitchShort: 'EN',
  themeToggle: 'Basculer entre thème clair et sombre',
  palette: {
    open: 'Ouvrir la palette de commandes',
    label: 'Palette de commandes',
    placeholder: 'Rechercher une page, un projet, une action…',
    empty: 'Aucun résultat',
    hint: '↑↓ naviguer · ↵ ouvrir · Échap fermer',
    close: 'Fermer',
    groups: { go: 'Aller à', projects: 'Projets', actions: 'Actions' },
    switchLang: 'Passer en anglais',
    toggleTheme: 'Changer de thème',
    openGithub: 'Ouvrir GitHub'
  },
  hero: {
    pitch: 'Développeur IA & full-stack — je construis des produits complets, du modèle de données à l’app mobile.',
    ctaProjects: 'Voir les projets',
    ctaGithub: 'GitHub'
  },
  sections: {
    featured: 'Projets phares',
    featuredLead: 'Trois produits en ligne, trois chantiers en cours. Chaque carte mène à une étude de cas.',
    others: 'Autres projets',
    stack: 'Stack',
    stackLead: 'Ce que j’utilise vraiment, regroupé par terrain de jeu.',
    path: 'Parcours',
    contact: 'Contact'
  },
  stackGroups: { ml: 'IA / ML', web: 'Web', mobile: 'Mobile', data: 'Data / Infra' },
  path: {
    title: 'Formation Développeur IA, 2026',
    lead: 'Je me forme au métier de développeur IA en parallèle de projets personnels que je mène jusqu’en production. La formation couvre la donnée, le machine learning, le deep learning, les LLM et le MLOps.',
    modulesTitle: 'Modules',
    modules: [
      'Nettoyage de données',
      'Analyse exploratoire (EDA)',
      'Clustering',
      'Méthodes d’ensemble',
      'Séries temporelles',
      'Deep learning, des CNN à YOLO',
      'LLM et garde-fous',
      'Pipelines Airflow / DuckDB',
      'Docker',
      'MLOps'
    ],
    note: 'Projet fil rouge : NutriScope, réalisé en binôme avec Clément Welsch.'
  },
  contact: {
    lead: 'Un projet, une question, une mission ? Pour l’instant, le plus simple est GitHub.',
    github: 'Profil GitHub',
    linkedin: 'LinkedIn',
    email: 'E-mail',
    todo: 'à venir'
  },
  footer: { built: 'Fait avec Astro et Tailwind. Essayez Ctrl/Cmd + K.', top: 'Haut de page' },
  project: {
    live: 'En ligne',
    wip: 'En développement',
    done: 'Terminé',
    try: 'Essayer',
    repo: 'Code source',
    readCase: 'Étude de cas',
    notTestable: 'Pas encore testable — objectif :',
    goal: 'Objectif',
    stage: 'Où en est le projet',
    next: 'Prochaines étapes',
    notTestableTitle: 'Pas encore testable',
    back: 'Tous les projets',
    prev: 'Projet précédent',
    following: 'Projet suivant',
    stack: 'Stack',
    highlights: 'Chiffres et faits marquants',
    privateRepo: 'Dépôt privé',
    accountNote: 'La démo demande de créer un compte.',
    caseTitle: 'Étude de cas'
  },
  notFound: { title: 'Page introuvable', text: 'Cette page n’existe pas (ou plus).', home: 'Retour à l’accueil' },
};

const en: typeof fr = {
  siteTitle: 'Sacha Don — AI & full-stack developer',
  siteDescription:
    'Portfolio of Sacha Don, AI and full-stack developer: GeoGame, MMA Universe, DailyLingua and works in progress (ArtUniverse, TennisTrackin, Dr Vocal).',
  skip: 'Skip to content',
  nav: { projects: 'Projects', stack: 'Stack', path: 'Background', contact: 'Contact' },
  menu: 'Menu',
  primaryNav: 'Main navigation',
  langSwitch: 'Switch to French',
  langSwitchShort: 'FR',
  themeToggle: 'Toggle between light and dark theme',
  palette: {
    open: 'Open the command palette',
    label: 'Command palette',
    placeholder: 'Search a page, a project, an action…',
    empty: 'No results',
    hint: '↑↓ navigate · ↵ open · Esc close',
    close: 'Close',
    groups: { go: 'Go to', projects: 'Projects', actions: 'Actions' },
    switchLang: 'Switch to French',
    toggleTheme: 'Toggle theme',
    openGithub: 'Open GitHub'
  },
  hero: {
    pitch: 'AI & full-stack developer — I build complete products, from the data model to the mobile app.',
    ctaProjects: 'See the projects',
    ctaGithub: 'GitHub'
  },
  sections: {
    featured: 'Featured projects',
    featuredLead: 'Three products online, three works in progress. Each card leads to a case study.',
    others: 'Other projects',
    stack: 'Stack',
    stackLead: 'What I actually use, grouped by playground.',
    path: 'Background',
    contact: 'Contact'
  },
  stackGroups: { ml: 'AI / ML', web: 'Web', mobile: 'Mobile', data: 'Data / Infra' },
  path: {
    title: 'AI Developer training, 2026',
    lead: 'I am training as an AI developer alongside personal projects that I take all the way to production. The program covers data, machine learning, deep learning, LLMs and MLOps.',
    modulesTitle: 'Modules',
    modules: [
      'Data cleaning',
      'Exploratory data analysis (EDA)',
      'Clustering',
      'Ensemble methods',
      'Time series',
      'Deep learning, from CNNs to YOLO',
      'LLMs and guardrails',
      'Airflow / DuckDB pipelines',
      'Docker',
      'MLOps'
    ],
    note: 'Capstone project: NutriScope, built as a pair with Clément Welsch.'
  },
  contact: {
    lead: 'A project, a question, a job? For now the easiest way is GitHub.',
    github: 'GitHub profile',
    linkedin: 'LinkedIn',
    email: 'Email',
    todo: 'coming soon'
  },
  footer: { built: 'Built with Astro and Tailwind. Try Ctrl/Cmd + K.', top: 'Back to top' },
  project: {
    live: 'Live',
    wip: 'In development',
    done: 'Completed',
    try: 'Try it',
    repo: 'Source code',
    readCase: 'Case study',
    notTestable: 'Not testable yet — goal:',
    goal: 'Goal',
    stage: 'Where the project stands',
    next: 'Next steps',
    notTestableTitle: 'Not testable yet',
    back: 'All projects',
    prev: 'Previous project',
    following: 'Next project',
    stack: 'Stack',
    highlights: 'Numbers and key facts',
    privateRepo: 'Private repository',
    accountNote: 'The demo requires creating an account.',
    caseTitle: 'Case study'
  },
  notFound: { title: 'Page not found', text: 'This page does not exist (or no longer does).', home: 'Back to home' },
};

export const ui = { fr, en } as const;

export function useUi(lang: Lang) {
  return ui[lang];
}

export const homeUrl = (lang: Lang, hash = '') => `/${lang}/${hash}`;
export const projectUrl = (lang: Lang, slug: string) => `/${lang}/${segments.projects[lang]}/${slug}`;

export const stackData: Record<'ml' | 'web' | 'mobile' | 'data', string[]> = {
  ml: ['Python', 'PyTorch', 'scikit-learn', 'YOLO (Ultralytics)', 'CLIP', 'faster-whisper', 'LLM (API Claude)', 'Glicko'],
  web: ['TypeScript', 'React', 'Next.js', 'Vite', 'Tailwind CSS', 'Astro', 'Vercel Functions', 'Playwright', 'Vitest'],
  mobile: ['Expo', 'React Native', 'Expo Router', 'PWA'],
  data: ['PostgreSQL', 'pgvector', 'Supabase', 'Firebase / Firestore', 'DuckDB', 'Parquet', 'Airflow', 'Docker', 'GitHub Actions']
};
