import ProjectsListClient from './ProjectsListClient';
import JsonLd from '../../../components/seo/JsonLd.jsx';
import { organizationSchema, breadcrumbSchema } from '../../../lib/seo.js';

export const metadata = {
  title: 'Projects & Programs | Relief Nepal',
  description:
    'Explore Relief Nepal\'s current and past projects across child protection, health, education, disaster resilience, WASH, and livelihoods. Filter by program and search projects.',
  openGraph: {
    title: 'Projects & Programs | Relief Nepal',
    description:
      'Explore Relief Nepal\'s published work by program. Project details are shared here after review and approval.',
    type: 'website',
    images: [
      {
        url: '/images/og-projects.jpg',
        width: 1200,
        height: 630,
        alt: 'Relief Nepal - Projects and programs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects & Programs | Relief Nepal',
    description:
      'Explore Relief Nepal\'s published work by program. Project details are shared here after review and approval.',
    images: ['/images/og-projects.jpg'],
  },
  alternates: {
    canonical: '/projects',
  },
};

export default function ProjectsPage() {
  return (
    <>
      <JsonLd key="projects-breadcrumb" data={breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Projects', url: '/projects' }])} />
      <JsonLd key="projects-org" data={organizationSchema} />
      <ProjectsListClient />
    </>
  );
}