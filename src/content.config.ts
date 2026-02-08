import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    category: z.enum(['Article', 'Commentary', 'Research', 'Core Ideas', 'Core Insights', 'But what about...?']),
    layout: z.enum(['default', 'simplified', 'rebuttal']).default('default'),
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
    registrationLink: z.string().optional(),
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
    twitter: z.string().optional(),
    website: z.string().optional(),
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

const localNews = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/localNews' }),
  schema: z.object({
    heading: z.string(),
    slug: z.string(),
    text: z.string(),
    localGroup: z.string(),
    date: z.coerce.date(),
    link: z.string().optional(),
    image: z.string().optional(),
  }),
});

const localGroups = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/localGroups' }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    title: z.string(),
    tagline: z.string(),
    headerImage: z.string(),
    leaderName: z.string().optional(),
    leaderIntro: z.string().optional(),
    discordLink: z.string().optional(),
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
    link: z.string().optional(),
    image: z.string().optional(),
  }),
});

const briefings = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/briefings' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    author: z.string(),
    authorTitle: z.string().optional(),
    pubDate: z.coerce.date(),
    readTime: z.number().default(5),
    summary: z.string().optional(),
    thumbnail: z.string().optional(),
    mainImage: z.string().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    // Source attribution fields
    sourceUrl: z.string().optional(),
    sourceTitle: z.string().optional(),
    sourceAuthor: z.string().optional(),
    sourcePublication: z.string().optional(),
    sourceDate: z.coerce.date().optional(),
  }),
});

export const collections = { articles, news, bios, ecosystem, localNews, localGroups, localEvents, briefings };
