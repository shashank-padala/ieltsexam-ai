/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.ieltsexam.ai',
  generateRobotsTxt: true,
  // Exclude protected pages from sitemap
  exclude: ['/my-profile', '/exams/**'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        // Disallow crawling of protected paths
        disallow: ['/my-profile', '/exams'],
      },
    ],
  },
};
