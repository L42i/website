import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const people = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/data/people' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    status: z.enum(['current', 'past']),
    order: z.number(),
    img: z.string().optional(),
    website: z.string().url().optional(),
    has_page: z.boolean().default(false),
  }),
});

export const collections = { people };