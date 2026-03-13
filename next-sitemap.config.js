/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://sriranjanaconstruction.lk', // Replace with your actual domain
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: 'weekly',
  priority: 0.7,
  exclude: ['/admin/*', '/api/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
  },
  transform: async (config, path) => {
    // Custom priority for important pages
const priorities = {
  '/': 1.0,
  '/services': 0.9,
  '/portfolio': 0.9,
  '/projects': 0.8,
  '/about': 0.8,
  '/contact': 0.8,
  '/reviews': 0.7,
  '/testimonials': 0.7,   
  '/walkthrough': 0.8,  
};

    return {
      loc: path,
      changefreq: config.changefreq,
      priority: priorities[path] || config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};