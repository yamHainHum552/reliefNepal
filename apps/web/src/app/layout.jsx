import './globals.css';
import Header from '../components/layout/Header.jsx';
import Footer from '../components/layout/Footer.jsx';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://reliefnepal.org.np';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'Relief Nepal | Community, dignity, hope', template: '%s | Relief Nepal' },
  description: 'Learn about Relief Nepal and its community-led work across Nepal.',
  alternates: { canonical: '/' },
  openGraph: { type: 'website', siteName: 'Relief Nepal', title: 'Relief Nepal', description: 'Working alongside communities across Nepal.' },
};

export default function RootLayout({ children }) {
  return <html lang="en"><body><a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-white focus:p-3">Skip to content</a><Header /><main id="main-content">{children}</main><Footer /></body></html>;
}
