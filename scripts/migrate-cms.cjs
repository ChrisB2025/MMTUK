/**
 * CMS Migration Script
 * Converts Webflow CSV exports to Markdown files for Astro/Decap CMS
 */

const fs = require('fs');
const path = require('path');

const cmsDir = path.join(__dirname, '../../CMS');
const contentDir = path.join(__dirname, '../src/content');

// Parse CSV string to array of objects
function parseCSV(csvText) {
  const lines = csvText.split('\n');
  if (lines.length < 2) return [];

  // Parse header, handling quoted fields
  const header = parseCSVLine(lines[0]);
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = parseCSVLine(line);
    const obj = {};
    for (let j = 0; j < header.length; j++) {
      obj[header[j]] = values[j] || '';
    }
    data.push(obj);
  }

  return data;
}

// Parse a single CSV line handling quoted fields
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// Convert HTML to simple Markdown
function htmlToMarkdown(html) {
  if (!html) return '';

  return html
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
    .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n')
    .replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n')
    .replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n')
    .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
    .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
    .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
    .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
    .replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (match, content) => {
      return content.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n') + '\n';
    })
    .replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (match, content) => {
      let index = 0;
      return content.replace(/<li[^>]*>(.*?)<\/li>/gi, () => {
        index++;
        return `${index}. $1\n`;
      }) + '\n';
    })
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// Generate a safe slug from a string
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Parse date from Webflow format
function parseDate(dateStr) {
  if (!dateStr) return new Date().toISOString();
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

// Migrate articles
function migrateArticles() {
  const csvPath = path.join(cmsDir, "MMT UK _ The UK's MMT think tank - Articles.csv");
  if (!fs.existsSync(csvPath)) {
    console.log('Articles CSV not found:', csvPath);
    return;
  }

  const csv = fs.readFileSync(csvPath, 'utf-8');
  const data = parseCSV(csv);
  const outputDir = path.join(contentDir, 'articles');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const seen = new Set();
  data.forEach((item) => {
    if (item.Draft === 'true' || item.Archived === 'true') return;

    let slug = item.Slug || slugify(item.Title);
    // Ensure unique slugs
    if (seen.has(slug)) {
      slug = slug + '-' + Math.random().toString(36).substr(2, 6);
    }
    seen.add(slug);

    const category = item.Category || 'Article';
    const validCategories = ['Article', 'Commentary', 'Research'];
    const normalizedCategory = validCategories.includes(category) ? category : 'Article';

    const frontmatter = {
      title: item.Title || 'Untitled',
      slug: slug,
      category: normalizedCategory,
      sector: item.Sector || 'Economics',
      author: item.Author || 'MMT UK',
      authorTitle: item['Author job title'] || '',
      pubDate: parseDate(item['Publication date']),
      readTime: parseInt(item['Read time']) || 5,
      summary: htmlToMarkdown(item['Post Summary'] || item['Executive summary'] || ''),
      thumbnail: item['Thumbnail image'] || '',
      mainImage: item['Main Image'] || '',
      featured: item['Featured?'] === 'true',
      color: item.Color || '',
    };

    const body = htmlToMarkdown(item['Post Body'] || '');

    const markdown = `---
title: "${frontmatter.title.replace(/"/g, '\\"')}"
slug: "${frontmatter.slug}"
category: "${frontmatter.category}"
sector: "${frontmatter.sector}"
author: "${frontmatter.author}"
authorTitle: "${frontmatter.authorTitle}"
pubDate: ${frontmatter.pubDate}
readTime: ${frontmatter.readTime}
summary: "${frontmatter.summary.replace(/"/g, '\\"').replace(/\n/g, ' ')}"
thumbnail: "${frontmatter.thumbnail}"
mainImage: "${frontmatter.mainImage}"
featured: ${frontmatter.featured}
color: "${frontmatter.color}"
---

${body}
`;

    const filePath = path.join(outputDir, `${slug}.md`);
    fs.writeFileSync(filePath, markdown);
    console.log('Created:', filePath);
  });
}

// Migrate news
function migrateNews() {
  const csvPath = path.join(cmsDir, "MMT UK _ The UK's MMT think tank - News.csv");
  if (!fs.existsSync(csvPath)) {
    console.log('News CSV not found:', csvPath);
    return;
  }

  const csv = fs.readFileSync(csvPath, 'utf-8');
  const data = parseCSV(csv);
  const outputDir = path.join(contentDir, 'news');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const seen = new Set();
  data.forEach((item) => {
    if (item.Draft === 'true' || item.Archived === 'true') return;

    let slug = item.Slug || slugify(item.Name || item.Title || 'news');
    if (seen.has(slug)) {
      slug = slug + '-' + Math.random().toString(36).substr(2, 6);
    }
    seen.add(slug);

    const categoryMap = {
      'Announcement': 'Announcement',
      'Event': 'Event',
      'Press Release': 'Press Release',
      'Update': 'Update',
    };
    const category = categoryMap[item.Category] || 'Announcement';

    const frontmatter = {
      title: item.Name || item.Title || 'Untitled',
      slug: slug,
      date: parseDate(item['News date']),
      category: category,
      summary: htmlToMarkdown(item['News summary'] || ''),
      thumbnail: item['News thumbnail'] || '',
      mainImage: item['News main image'] || '',
    };

    const body = htmlToMarkdown(item['News body'] || '');

    const markdown = `---
title: "${frontmatter.title.replace(/"/g, '\\"')}"
slug: "${frontmatter.slug}"
date: ${frontmatter.date}
category: "${frontmatter.category}"
summary: "${frontmatter.summary.replace(/"/g, '\\"').replace(/\n/g, ' ')}"
thumbnail: "${frontmatter.thumbnail}"
mainImage: "${frontmatter.mainImage}"
---

${body}
`;

    const filePath = path.join(outputDir, `${slug}.md`);
    fs.writeFileSync(filePath, markdown);
    console.log('Created:', filePath);
  });
}

// Migrate bios
function migrateBios() {
  const csvPath = path.join(cmsDir, "MMT UK _ The UK's MMT think tank - Bios.csv");
  if (!fs.existsSync(csvPath)) {
    console.log('Bios CSV not found:', csvPath);
    return;
  }

  const csv = fs.readFileSync(csvPath, 'utf-8');
  const data = parseCSV(csv);
  const outputDir = path.join(contentDir, 'bios');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const seen = new Set();
  data.forEach((item) => {
    if (item.Draft === 'true' || item.Archived === 'true') return;

    let slug = item.Slug || slugify(item.Name || 'bio');
    if (seen.has(slug)) {
      slug = slug + '-' + Math.random().toString(36).substr(2, 6);
    }
    seen.add(slug);

    const frontmatter = {
      name: item.Name || 'Unknown',
      slug: slug,
      role: item.Role || item['Role / Title'] || '',
      photo: item.Photo || item['Bio Photo'] || '',
      linkedin: item.Linkedin || item.LinkedIn || '',
      advisoryBoard: item['Advisory Board?'] === 'true' || item['Advisory board'] === 'true',
    };

    const body = htmlToMarkdown(item['Bio description'] || item.Description || '');

    const markdown = `---
name: "${frontmatter.name.replace(/"/g, '\\"')}"
slug: "${frontmatter.slug}"
role: "${frontmatter.role.replace(/"/g, '\\"')}"
photo: "${frontmatter.photo}"
linkedin: "${frontmatter.linkedin}"
advisoryBoard: ${frontmatter.advisoryBoard}
---

${body}
`;

    const filePath = path.join(outputDir, `${slug}.md`);
    fs.writeFileSync(filePath, markdown);
    console.log('Created:', filePath);
  });
}

// Migrate ecosystem profiles
function migrateEcosystem() {
  const csvPath = path.join(cmsDir, "MMT UK _ The UK's MMT think tank - Ecosystems Profiles.csv");
  if (!fs.existsSync(csvPath)) {
    console.log('Ecosystem CSV not found:', csvPath);
    return;
  }

  const csv = fs.readFileSync(csvPath, 'utf-8');
  const data = parseCSV(csv);
  const outputDir = path.join(contentDir, 'ecosystem');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const seen = new Set();
  data.forEach((item) => {
    if (item.Draft === 'true' || item.Archived === 'true') return;

    let slug = item.Slug || slugify(item.Name || 'ecosystem');
    if (seen.has(slug)) {
      slug = slug + '-' + Math.random().toString(36).substr(2, 6);
    }
    seen.add(slug);

    const statusMap = {
      'Active': 'Active',
      'Inactive': 'Inactive',
      'Archived': 'Archived',
    };
    const status = statusMap[item.Status] || 'Active';

    const types = item.Types ? item.Types.split(',').map(t => t.trim()).filter(Boolean) : [];

    const frontmatter = {
      name: item.Name || 'Unknown',
      slug: slug,
      country: item.Country || 'UK',
      types: types,
      summary: item.Summary || item['Ecosystem summary'] || '',
      logo: item.Logo || item['Ecosystem logo'] || '',
      website: item.Website || item['Website URL'] || '',
      twitter: item.Twitter || item['X'] || '',
      facebook: item.Facebook || '',
      youtube: item.YouTube || item.Youtube || '',
      discord: item.Discord || '',
      status: status,
    };

    const body = htmlToMarkdown(item.Description || item['Ecosystem description'] || '');

    const markdown = `---
name: "${frontmatter.name.replace(/"/g, '\\"')}"
slug: "${frontmatter.slug}"
country: "${frontmatter.country}"
types: [${frontmatter.types.map(t => `"${t}"`).join(', ')}]
summary: "${(frontmatter.summary || '').replace(/"/g, '\\"').replace(/\n/g, ' ')}"
logo: "${frontmatter.logo}"
website: "${frontmatter.website}"
twitter: "${frontmatter.twitter}"
facebook: "${frontmatter.facebook}"
youtube: "${frontmatter.youtube}"
discord: "${frontmatter.discord}"
status: "${frontmatter.status}"
---

${body}
`;

    const filePath = path.join(outputDir, `${slug}.md`);
    fs.writeFileSync(filePath, markdown);
    console.log('Created:', filePath);
  });
}

// Main
console.log('Starting CMS migration...\n');
console.log('=== Migrating Articles ===');
migrateArticles();
console.log('\n=== Migrating News ===');
migrateNews();
console.log('\n=== Migrating Bios ===');
migrateBios();
console.log('\n=== Migrating Ecosystem ===');
migrateEcosystem();
console.log('\nMigration complete!');
