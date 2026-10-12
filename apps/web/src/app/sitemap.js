export default function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://reliefnepal.org.np';
  return ['', '/about', '/our-work', '/impact', '/stories', '/contact', '/transparency', '/partners', '/get-involved'].map((path) => ({ url: `${base}${path}`, lastModified: new Date() }));
}
