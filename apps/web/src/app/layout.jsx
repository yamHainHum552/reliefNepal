import "./globals.css";
import Header from "../components/layout/Header.jsx";
import Marquee from "../components/layout/Marquee.jsx";
import JsonLd from "../components/seo/JsonLd.jsx";
import {
  defaultMetadata,
  organizationSchema,
  websiteSchema,
} from "../lib/seo.js";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://reliefnepal.org.np';

export const metadata = {
  metadataBase: new URL(siteUrl),
  ...defaultMetadata,
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': '/rss.xml',
    },
  },
  other: {
    'theme-color': '#087943',
    'color-scheme': 'light',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <JsonLd key="organization" data={organizationSchema} />
        <JsonLd key="website" data={websiteSchema} />
      </head>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-white focus:p-3"
        >
          Skip to content
        </a>
        <Header />
        <Marquee />
        <div id="main-content">{children}</div>
      </body>
    </html>
  );
}
