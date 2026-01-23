import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    category: z.enum(['Article', 'Commentary', 'Research', 'Core Ideas']),
    layout: z.enum(['default', 'simplified']).default('default'),
    sector: z.string().default('Economics'),
    author: z.string(),
    authorTitle: z.string().optional(),
    pubDate: z.coerce.date(),
    readTime: z.number().default(5),
    summary: z.string().optional(),
    thumbnail: z.string().optional(),
    mainImage: z.string().optional(),
    featured: z.boolean().default(false),
    color: z.string().optional(),
  }),
});

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    date: z.coerce.date(),
    category: z.enum(['Announcement', 'Event', 'Press Release', 'Update']),
    summary: z.string().optional(),
    thumbnail: z.string().optional(),
    mainImage: z.string().optional(),
  }),
});

const bios = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/bios' }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    role: z.string(),
    photo: z.string().optional(),
    linkedin: z.string().optional(),
    advisoryBoard: z.boolean().default(false),
  }),
});

const ecosystem = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/ecosystem' }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    country: z.string().default('UK'),
    types: z.array(z.string()).optional(),
    summary: z.string().optional(),
    logo: z.string().optional(),
    website: z.string().optional(),
    twitter: z.string().optional(),
    facebook: z.string().optional(),
    youtube: z.string().optional(),
    discord: z.string().optional(),
    status: z.enum(['Active', 'Inactive', 'Archived']).default('Active'),
  }),
});

export const collections = { articles, news, bios, ecosystem };
