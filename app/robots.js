import { siteConfig } from '@/data/site';

export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/'] }],
    sitemap: `${siteConfig.domain}/sitemap.xml`,
    host: siteConfig.domain,
  };
}
