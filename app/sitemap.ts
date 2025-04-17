// app/sitemap.ts
import { MetadataRoute } from 'next';
import fs from 'fs/promises';
import path from 'path';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.ieltsexam.ai';

  // 1) PUBLIC top‑level routes (no /my‑profile, no /exams)
  const staticPaths = [
    '',                  // home
    '/about',
    '/privacy-policy',
    '/login',
    '/signup',
    '/ielts-mock-exams',
    '/ielts-exam-tips'
    // …any other fully public pages
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  // 2) Auto‑discover your article folders under ielts-exam-tips
  const tipsDir = path.join(process.cwd(), 'app', 'ielts-exam-tips');
  const entries = await fs.readdir(tipsDir, { withFileTypes: true });

  const tipUrls = entries
    .filter((e) => e.isDirectory())
    .map((dir) => ({
      url: `${baseUrl}/ielts-exam-tips/${dir.name}`,
      lastModified: new Date(),
    }));

  return [...staticPaths, ...tipUrls];
}
