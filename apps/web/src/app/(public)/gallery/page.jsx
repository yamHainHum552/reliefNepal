import { GalleryDirectory } from './gallery-browser.jsx';
import JsonLd from '../../../components/seo/JsonLd.jsx';
import { breadcrumbSchema, organizationSchema } from '../../../lib/seo.js';

export const metadata = {
  title: 'Project Gallery | Photos, Videos & Stories | Relief Nepal',
  description:
    'Explore Relief Nepal project galleries with field photographs, videos, and community stories. Browse visual documentation of our work across Protection, Health & Education, Disaster & Climate, WASH, and Livelihoods programs.',
  openGraph: {
    title: 'Project Gallery | Photos, Videos & Stories | Relief Nepal',
    description:
      'Browse visual documentation of Relief Nepal\'s work across all program areas. Field photographs, videos, and community stories.',
    type: 'website',
    images: [
      {
        url: '/images/og-gallery.jpg',
        width: 1200,
        height: 630,
        alt: 'Relief Nepal - Project gallery and field photos',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Project Gallery | Relief Nepal',
    description:
      'Explore Relief Nepal project galleries with field photographs, videos, and community stories.',
    images: ['/images/og-gallery.jpg'],
  },
  alternates: {
    canonical: '/gallery',
  },
};

export default function GalleryPage() {
  return (
    <>
      <JsonLd key="gallery-breadcrumb" data={breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Gallery', url: '/gallery' }])} />
      <JsonLd key="gallery-org" data={organizationSchema} />
      <GalleryDirectory />
    </>
  );
}