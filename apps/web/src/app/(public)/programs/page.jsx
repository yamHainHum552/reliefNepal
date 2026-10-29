import ProgramsPageClient from './ProgramsPageClient';
import JsonLd from '../../../components/seo/JsonLd.jsx';
import { organizationSchema, breadcrumbSchema } from '../../../lib/seo.js';

export const metadata = {
  title: 'Program Areas | Relief Nepal',
  description:
    'Explore Relief Nepal\'s five core program areas: Protection, Health & Education, Disaster & Climate, WASH, and Livelihoods. See published projects and community partnerships for each program.',
  openGraph: {
    title: 'Program Areas | Relief Nepal',
    description:
      'Our program areas bring together partnerships, knowledge, and projects supporting community-led change across Nepal.',
    type: 'website',
    images: [
      {
        url: '/images/og-programs.jpg',
        width: 1200,
        height: 630,
        alt: 'Relief Nepal - Program areas and projects',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Program Areas | Relief Nepal',
    description:
      'Our program areas bring together partnerships, knowledge, and projects supporting community-led change.',
    images: ['/images/og-programs.jpg'],
  },
  alternates: {
    canonical: '/programs',
  },
};

export default function ProgramsPage() {
  return (
    <>
      <JsonLd key="programs-breadcrumb" data={breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Programs', url: '/programs' }])} />
      <JsonLd key="programs-org" data={organizationSchema} />
      <ProgramsPageClient />
    </>
  );
}