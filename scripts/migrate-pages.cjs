/**
 * Page Migration Script for MMT UK Webflow to Astro
 *
 * This script helps extract main content from Webflow HTML pages
 * and outputs the content ready to be wrapped in Astro layouts.
 *
 * Usage: node scripts/migrate-pages.js <page-name>
 * Example: node scripts/migrate-pages.js about-us
 */

const fs = require('fs');
const path = require('path');

const webflowDir = path.join(__dirname, '../../');
const astroDir = path.join(__dirname, '../');

// Pages to migrate and their metadata
const pageConfig = {
  'about-us': { title: 'About Us', description: 'Learn about MMT UK and our team.' },
  'research': { title: 'Research', description: 'Explore MMT UK research and publications.' },
  'library': { title: 'Library', description: 'Browse our library of MMT resources.' },
  'briefings': { title: 'Briefings', description: 'Read our policy briefings.' },
  'news': { title: 'News', description: 'Latest news from MMT UK.' },
  'community': { title: 'Community', description: 'Join the MMT UK community.' },
  'ecosystem': { title: 'Ecosystem', description: 'Explore the MMT ecosystem.' },
  'education': { title: 'Education', description: 'MMT educational resources.' },
  'job-guarantee': { title: 'Job Guarantee', description: 'Learn about the Job Guarantee proposal.' },
  'local-group': { title: 'Local Groups', description: 'Find local MMT groups.' },
  'join': { title: 'Join', description: 'Join MMT UK.' },
  'donate': { title: 'Donate', description: 'Support MMT UK.' },
  'donations': { title: 'Donations', description: 'Thank you for your support.' },
  'founders': { title: 'Founders', description: 'Meet our founding members.' },
  'search': { title: 'Search', description: 'Search MMT UK.' },
  'privacy-policy': { title: 'Privacy Policy', description: 'Our privacy policy.' },
  'terms-of-engagement': { title: 'Terms of Engagement', description: 'Our terms of engagement.' },
  'cookie-preferences': { title: 'Cookie Preferences', description: 'Manage your cookie preferences.' },
  '404': { title: 'Not Found', description: 'Page not found.' },
  '401': { title: 'Unauthorized', description: 'Unauthorized access.' },
};

function extractMainContent(html) {
  // Find <main class="main-wrapper"> ... </main>
  const mainMatch = html.match(/<main class="main-wrapper">([\s\S]*?)<\/main>/);
  if (!mainMatch) {
    console.error('Could not find main-wrapper content');
    return null;
  }

  let content = mainMatch[1];

  // Fix relative image paths to absolute paths
  content = content.replace(/src="images\//g, 'src="/images/');
  content = content.replace(/srcset="images\//g, 'srcset="/images/');

  // Fix relative links to remove .html extension
  content = content.replace(/href="([^"#]+)\.html"/g, 'href="/$1"');
  content = content.replace(/href="index\.html"/g, 'href="/"');

  return content.trim();
}

function generateAstroPage(pageName, content, config) {
  return `---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="${config.title}" description="${config.description}" currentPage="${pageName}">
${content}
</BaseLayout>
`;
}

function migratePage(pageName) {
  const config = pageConfig[pageName];
  if (!config) {
    console.error(`Unknown page: ${pageName}`);
    console.log('Available pages:', Object.keys(pageConfig).join(', '));
    return;
  }

  const htmlPath = path.join(webflowDir, `${pageName}.html`);
  if (!fs.existsSync(htmlPath)) {
    console.error(`File not found: ${htmlPath}`);
    return;
  }

  const html = fs.readFileSync(htmlPath, 'utf-8');
  const content = extractMainContent(html);

  if (!content) {
    console.error(`Failed to extract content from ${pageName}`);
    return;
  }

  const astroContent = generateAstroPage(pageName, content, config);
  const outputPath = path.join(astroDir, 'src', 'pages', `${pageName}.astro`);

  fs.writeFileSync(outputPath, astroContent);
  console.log(`Created: ${outputPath}`);
}

// Main
const pageName = process.argv[2];
if (!pageName) {
  console.log('Usage: node scripts/migrate-pages.js <page-name>');
  console.log('       node scripts/migrate-pages.js --all');
  console.log('\nAvailable pages:', Object.keys(pageConfig).join(', '));
  process.exit(1);
}

if (pageName === '--all') {
  Object.keys(pageConfig).forEach(page => {
    try {
      migratePage(page);
    } catch (err) {
      console.error(`Error migrating ${page}:`, err.message);
    }
  });
} else {
  migratePage(pageName);
}
