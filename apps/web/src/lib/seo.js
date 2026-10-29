/**
 * SEO Configuration & Utilities
 * Centralized SEO constants and helper functions
 */

export const siteConfig = {
  name: 'Relief Nepal',
  description: 'A non-profit organization dedicated to improving the well-being of underserved children, families, and communities across Nepal through community-led development.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://reliefnepal.org.np',
  ogImage: '/images/og-default.jpg',
  twitterHandle: '@reliefnepal',
  organization: {
    name: 'Relief Nepal',
    legalName: 'Relief Nepal',
    url: 'https://reliefnepal.org.np',
    logo: '/images/logo.jpg',
    sameAs: [
      'https://www.facebook.com/reliefnepal',
      'https://twitter.com/reliefnepal',
      'https://www.linkedin.org/company/relief-nepal',
      'https://www.youtube.com/@reliefnepal',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+977-047-520915',
      contactType: 'customer service',
      availableLanguage: ['Nepali', 'English'],
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Sindhuli, Bagmati Province',
      addressLocality: 'Sindhuli',
      addressRegion: 'Bagmati Province',
      addressCountry: 'NP',
    },
    foundingDate: '2008',
    areaServed: 'NP',
  },
};

export const defaultMetadata = {
  title: {
    default: 'Relief Nepal | Community, dignity, hope',
    template: '%s | Relief Nepal',
  },
  description: siteConfig.description,
  keywords: [
    'Relief Nepal',
    'non-profit Nepal',
    'community development Nepal',
    'child protection Nepal',
    'humanitarian aid Nepal',
    'disaster relief Nepal',
    'WASH Nepal',
    'livelihoods Nepal',
    'Sindhuli NGO',
    'Bagmati Province NGO',
  ],
  authors: [{ name: 'Relief Nepal' }],
  creator: 'Relief Nepal',
  publisher: 'Relief Nepal',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    siteName: 'Relief Nepal',
    title: 'Relief Nepal | Community, dignity, hope',
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: 'Relief Nepal - Building self-reliant, equitable communities across Nepal',
      },
    ],
    locale: 'en_NP',
    alternateLocale: ['ne_NP'],
  },
  twitter: {
    card: 'summary_large_image',
    site: siteConfig.twitterHandle,
    creator: siteConfig.twitterHandle,
    title: 'Relief Nepal | Community, dignity, hope',
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': '/rss.xml',
    },
  },
  icons: {
    icon: '/icons/favicon.ico',
    shortcut: '/icons/favicon-16x16.png',
    apple: '/icons/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export function generatePageMetadata({
  title,
  description,
  path,
  image,
  type = 'website',
  noIndex = false,
  noFollow = false,
  publishedTime,
  modifiedTime,
  authors,
  section,
  tags,
}) {
  const url = `${siteConfig.url}${path}`;
  const ogImage = image || siteConfig.ogImage;

  return {
    title,
    description: description || siteConfig.description,
    keywords: tags?.join(', ') || defaultMetadata.keywords.join(', '),
    robots: {
      index: !noIndex,
      follow: !noFollow,
      googleBot: {
        index: !noIndex,
        follow: !noFollow,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type,
      siteName: 'Relief Nepal',
      title,
      description: description || siteConfig.description,
      url,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_NP',
      alternateLocale: ['ne_NP'],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(authors && { authors }),
      ...(section && { section }),
      ...(tags && { tags }),
    },
    twitter: {
      card: 'summary_large_image',
      site: siteConfig.twitterHandle,
      creator: siteConfig.twitterHandle,
      title,
      description: description || siteConfig.description,
      images: [ogImage],
    },
    alternates: {
      canonical: url,
    },
  };
}

export function generateJsonLd(data) {
  return {
    '@context': 'https://schema.org',
    ...data,
  };
}

export const organizationSchema = generateJsonLd({
  '@type': 'NonprofitOrganization',
  name: siteConfig.organization.name,
  legalName: siteConfig.organization.legalName,
  url: siteConfig.organization.url,
  logo: siteConfig.organization.logo,
  sameAs: siteConfig.organization.sameAs,
  contactPoint: siteConfig.organization.contactPoint,
  address: siteConfig.organization.address,
  foundingDate: siteConfig.organization.foundingDate,
  areaServed: siteConfig.organization.areaServed,
  description: siteConfig.description,
  missionStatement: 'To improve the well-being of underserved children, families, and communities through community-led development.',
  knowsAbout: [
    'Child Protection',
    'Health & Education',
    'Disaster & Climate Resilience',
    'WASH (Water, Sanitation & Hygiene)',
    'Livelihoods',
    'Humanitarian Aid',
    'Community Development',
  ],
});

export const websiteSchema = generateJsonLd({
  '@type': 'WebSite',
  name: siteConfig.name,
  url: siteConfig.url,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
  publisher: {
    '@type': 'Organization',
    name: siteConfig.organization.name,
    logo: {
      '@type': 'ImageObject',
      url: siteConfig.organization.logo,
    },
  },
});

export function breadcrumbSchema(items) {
  return generateJsonLd({
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.url}`,
    })),
  });
}

export function articleSchema({
  headline,
  description,
  image,
  datePublished,
  dateModified,
  authorName,
  publisherName = 'Relief Nepal',
  publisherLogo = siteConfig.organization.logo,
  mainEntityOfPage,
}) {
  return generateJsonLd({
    '@type': 'Article',
    headline,
    description,
    image: image ? [image] : [siteConfig.ogImage],
    datePublished,
    dateModified,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: publisherName,
      logo: {
        '@type': 'ImageObject',
        url: publisherLogo,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': mainEntityOfPage || `${siteConfig.url}`,
    },
  });
}

export function projectSchema({
  name,
  description,
  image,
  url,
  startDate,
  endDate,
  location,
  program,
  status,
}) {
  return generateJsonLd({
    '@type': 'Project',
    name,
    description,
    image,
    url,
    startDate,
    endDate,
    location: {
      '@type': 'Place',
      name: location,
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'NP',
      },
    },
    projectStatus: status,
    about: program,
    organizer: {
      '@type': 'Organization',
      name: siteConfig.organization.name,
      url: siteConfig.organization.url,
    },
  });
}

export function eventSchema({
  name,
  description,
  startDate,
  endDate,
  location,
  image,
  url,
  eventStatus = 'EventScheduled',
  eventAttendanceMode = 'OfflineEventAttendanceMode',
}) {
  return generateJsonLd({
    '@type': 'Event',
    name,
    description,
    startDate,
    endDate,
    eventStatus,
    eventAttendanceMode,
    location: {
      '@type': 'Place',
      name: location,
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'NP',
      },
    },
    image,
    url,
    organizer: {
      '@type': 'Organization',
      name: siteConfig.organization.name,
      url: siteConfig.organization.url,
    },
  });
}

export function faqSchema(faqs) {
  return generateJsonLd({
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  });
}