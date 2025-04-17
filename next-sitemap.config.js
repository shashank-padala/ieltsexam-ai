/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.ieltsexam.ai',
  generateRobotsTxt: true,
  outDir: 'public',
  //  tell next‑sitemap to scan your app folder instead of pages/
  pagesDirectory: 'app',
  sourceDir:    'app',
  exclude: ['/my-profile', '/exams/**'],
  robotsTxtOptions: { /*…*/ },

  // manually inject all your dynamic “tips” URLs
  additionalPaths: async (config) => {
    // e.g. read your local data or query your CMS
    const slugs = await fetchTipSlugs();
    return slugs.map((slug) => ({
      loc: `/ielts-exam-tips/${slug}`,
      lastmod: new Date().toISOString(),
    }));
  },
}
