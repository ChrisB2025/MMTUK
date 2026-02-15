import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Null-tolerant optional string: accepts string | null | undefined,
// coerces null to undefined so Zod's .optional() is satisfied.
const nullableStr = () => z.string().nullable().optional().transform(v => v ?? undefined);

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    category: z.enum(['Article', 'Commentary', 'Research', 'Core Ideas', 'Core Insights', 'But what about...?']),
    layout: z.enum(['default', 'simplified', 'rebuttal']).default('default'),
    sector: z.string().default('Economics'),
    author: z.string(),
    authorTitle: nullableStr(),
    pubDate: z.coerce.date(),
    readTime: z.number().default(5),
    summary: nullableStr(),
    thumbnail: nullableStr(),
    mainImage: nullableStr(),
    featured: z.boolean().default(false),
    color: nullableStr(),
  }),
});

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    date: z.coerce.date(),
    category: z.enum(['Announcement', 'Event', 'Press Release', 'Update']),
    summary: nullableStr(),
    thumbnail: nullableStr(),
    mainImage: nullableStr(),
    registrationLink: nullableStr(),
  }),
});

const bios = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/bios' }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    role: z.string(),
    photo: nullableStr(),
    linkedin: nullableStr(),
    twitter: nullableStr(),
    website: nullableStr(),
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
    summary: nullableStr(),
    logo: nullableStr(),
    website: nullableStr(),
    twitter: nullableStr(),
    facebook: nullableStr(),
    youtube: nullableStr(),
    discord: nullableStr(),
    status: z.enum(['Active', 'Inactive', 'Archived']).default('Active'),
  }),
});

const localNews = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/localNews' }),
  schema: z.object({
    heading: z.string(),
    slug: z.string(),
    text: z.string(),
    localGroup: z.string(),
    date: z.coerce.date(),
    link: nullableStr(),
    image: nullableStr(),
  }),
});

const localGroups = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/localGroups' }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    title: z.string(),
    tagline: z.string(),
    headerImage: z.string().default(''),
    leaderName: nullableStr(),
    leaderIntro: nullableStr(),
    discordLink: nullableStr(),
    active: z.boolean().default(true),
  }),
});

const localEvents = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/localEvents' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    localGroup: z.string(),
    date: z.coerce.date(),
    tag: z.string(),
    location: z.string(),
    description: z.string(),
    link: nullableStr(),
    image: nullableStr(),
    partnerEvent: z.boolean().optional(),
  }),
});

const briefings = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/briefings' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    author: z.string(),
    authorTitle: nullableStr(),
    pubDate: z.coerce.date(),
    readTime: z.number().default(5),
    summary: nullableStr(),
    thumbnail: nullableStr(),
    mainImage: nullableStr(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    // Source attribution fields
    sourceUrl: nullableStr(),
    sourceTitle: nullableStr(),
    sourceAuthor: nullableStr(),
    sourcePublication: nullableStr(),
    sourceDate: z.coerce.date().optional(),
  }),
});

export const collections = { articles, news, bios, ecosystem, localNews, localGroups, localEvents, briefings };
