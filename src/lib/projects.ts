import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/ui';

export type Project = CollectionEntry<'projects'> & { slug: string };

/** Projets d'une langue, triés par `order`. L'id du content layer est `<lang>/<slug>`. */
export async function getProjects(lang: Lang): Promise<Project[]> {
  const all = await getCollection('projects', (p) => p.id.startsWith(`${lang}/`));
  return all
    .map((p) => ({ ...p, slug: p.id.slice(lang.length + 1) }))
    .sort((a, b) => a.data.order - b.data.order);
}

/** Slugs qui disposent d'une démo interactive (composant ProjectDemo). */
export const demoSlugs = ['geogame', 'mma-universe', 'dailylingua', 'artuniverse', 'tennistrackin', 'drvocal'];
