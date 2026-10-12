export default function robots() {
  return { rules: [{ userAgent: '*', allow: '/', disallow: '/admin/' }], sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://reliefnepal.org.np'}/sitemap.xml` };
}
