/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.ieltsexam.ai',
  generateRobotsTxt: true,
  outDir: 'public',
  //  tell next‑sitemap to scan your app folder instead of pages/
  pagesDirectory: 'app',
  sourceDir:    'app',
  exclude: ['/my-profile', '/exams/**'],
  robotsTxtOptions: { /*…*/ }
}
