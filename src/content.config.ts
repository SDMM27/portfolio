import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z
    .object({
      title: z.string(),
      tagline: z.string(),
      // 'done' : projet terminé mais pas hébergé (anciens dépôts), ni « en ligne » ni « en développement ».
      status: z.enum(['live', 'wip', 'done']),
      featured: z.boolean(),
      order: z.number(),
      year: z.string(),
      stack: z.array(z.string()),
      links: z.object({
        live: z.url().optional(),
        repo: z.url().optional(),
        extra: z.url().optional()
      }),
      role: z.string().optional(),
      highlights: z.array(z.string()).min(3).max(4),
      goal: z.string().optional(),
      currentStage: z.string().optional(),
      next: z.array(z.string()).optional()
    })
    .refine((p) => p.status !== 'wip' || (p.goal && p.currentStage && p.next?.length), {
      message: 'Un projet wip doit définir goal, currentStage et next.'
    })
});

export const collections = { projects };
