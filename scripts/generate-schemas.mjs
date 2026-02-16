/**
 * Generate JSON Schema files from Astro content collection Zod schemas.
 *
 * This script manually defines the Zod schemas based on content.config.ts
 * and converts them to JSON Schema format for use by the CMS.
 *
 * Note: Keep this file in sync with src/content.config.ts when schemas change.
 *
 * Output: public/schemas/{collectionName}.json
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { z } from 'zod';

// Get directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Null-tolerant optional string helper (matches content.config.ts)
const nullableStr = () => z.string().nullable().optional().transform(v => v ?? undefined);

// Define schemas (must match src/content.config.ts)
const schemas = {
  articles: z.object({
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

  news: z.object({
    title: z.string(),
    slug: z.string(),
    date: z.coerce.date(),
    category: z.enum(['Announcement', 'Event', 'Press Release', 'Update']),
    summary: nullableStr(),
    thumbnail: nullableStr(),
    mainImage: nullableStr(),
    registrationLink: nullableStr(),
  }),

  bios: z.object({
    name: z.string(),
    slug: z.string(),
    role: z.string(),
    photo: nullableStr(),
    linkedin: nullableStr(),
    twitter: nullableStr(),
    website: nullableStr(),
    advisoryBoard: z.boolean().default(false),
  }),

  ecosystem: z.object({
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

  localNews: z.object({
    heading: z.string(),
    slug: z.string(),
    text: z.string(),
    localGroup: z.string(),
    date: z.coerce.date(),
    link: nullableStr(),
    image: nullableStr(),
  }),

  localGroups: z.object({
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

  localEvents: z.object({
    title: z.string(),
    slug: z.string(),
    localGroup: z.string(),
    date: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    tag: z.string(),
    location: z.string(),
    description: z.string(),
    link: nullableStr(),
    image: nullableStr(),
    partnerEvent: z.boolean().optional(),
    archived: z.boolean().default(false),
  }),

  briefings: z.object({
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
};

// Ensure output directory exists
const schemasDir = join(projectRoot, 'public', 'schemas');
mkdirSync(schemasDir, { recursive: true });

let generatedCount = 0;
let errors = [];

// Generate JSON schema for each collection
for (const [name, zodSchema] of Object.entries(schemas)) {
  try {
    // Convert to JSON Schema
    const jsonSchema = zodToJsonSchema(zodSchema, {
      name: name,
      $refStrategy: 'none', // Don't use $ref, inline everything
    });

    // Write to file
    const outputPath = join(schemasDir, `${name}.json`);
    writeFileSync(outputPath, JSON.stringify(jsonSchema, null, 2), 'utf-8');

    console.log(`✓ Generated schema: ${name}.json`);
    generatedCount++;
  } catch (error) {
    console.error(`✗ Failed to generate schema for ${name}:`, error.message);
    errors.push({ collection: name, error: error.message });
  }
}

// Summary
console.log(`\n✓ Generated ${generatedCount} JSON schemas in public/schemas/`);

if (errors.length > 0) {
  console.error(`\n✗ ${errors.length} error(s) occurred:`);
  errors.forEach(({ collection, error }) => {
    console.error(`  - ${collection}: ${error}`);
  });
  process.exit(1);
}
