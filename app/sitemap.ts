// app/sitemap.ts
import { MetadataRoute } from 'next';
import fs from 'fs/promises';
import path from 'path';

const baseUrl = 'https://www.ieltsexam.ai';
const lastModified = new Date();

async function walkArticles(dir: string, urlPrefix: string): Promise<MetadataRoute.SitemapItem[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  let urls: MetadataRoute.SitemapItem[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const subdir = path.join(dir, entry.name);
    const files  = await fs.readdir(subdir);

    // if this folder has a page.tsx, emit it
    if (files.includes('page.tsx') || files.includes('page.js')) {
      urls.push({
        url: `${baseUrl}${urlPrefix}/${entry.name}`,
        lastModified,
      });
    }

    // recurse into it for deeper nesting
    urls = urls.concat(
      await walkArticles(subdir, `${urlPrefix}/${entry.name}`)
    );
  }

  return urls;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1) PUBLIC top‑level routes
  const staticPaths = [
    '',
    '/about',
    '/privacy-policy',
    '/login',
    '/signup',
    '/ielts-mock-tests',
    '/ielts-exam-tips',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
  }));

  // 2) Pillar pages + nested articles under /ielts-exam-tips
  const tipsDir = path.join(process.cwd(), 'app', 'ielts-exam-tips');
  const pillars = await fs.readdir(tipsDir, { withFileTypes: true });

  const pillarUrls = pillars
    .filter((d) => d.isDirectory())
    .map((d) => ({
      url: `${baseUrl}/ielts-exam-tips/${d.name}`,
      lastModified,
    }));

  // 3) Walk each pillar folder for article slugs
  const articleUrls = await Promise.all(
    pillars
      .filter((d) => d.isDirectory())
      .map((d) =>
        walkArticles(
          path.join(tipsDir, d.name),
          `/ielts-exam-tips/${d.name}`
        )
      )
  ).then((arrays) => arrays.flat());

  return [...staticPaths, ...pillarUrls, ...articleUrls];
}
