import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://reliefnepal.org.np';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'Relief Nepal | Community, dignity, hope', template: '%s | Relief Nepal' },
  description: 'Learn about Relief Nepal and its community-led work across Nepal.',
  alternates: { canonical: '/' },
  openGraph: { type: 'website', siteName: 'Relief Nepal', title: 'Relief Nepal', description: 'Working alongside communities across Nepal.' },
};

export default function RootLayout({ children }) {
  return <html lang="en"><body><main id="main-content">{children}</main></body></html>;
}
