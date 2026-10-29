import AboutPageClient from './AboutPageClient';
import JsonLd from '../../../components/seo/JsonLd.jsx';
import { organizationSchema, breadcrumbSchema, faqSchema } from '../../../lib/seo.js';

export const metadata = {
  title: 'About Relief Nepal | Vision, Mission, Board & Structure',
  description:
    'Learn about Relief Nepal\'s vision for an equitable society, mission to empower marginalized communities, board members, organizational structure, and strategic priorities for 2026-2030 aligned with SDGs.',
  openGraph: {
    title: 'About Relief Nepal | Vision, Mission & Organization',
    description:
      'Non-profit organization established in 2008, working across Nepal for child protection, health, education, disaster resilience, WASH, and livelihoods.',
    type: 'website',
    images: [
      {
        url: '/images/og-about.jpg',
        width: 1200,
        height: 630,
        alt: 'Relief Nepal - About our organization',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Relief Nepal | Vision, Mission & Organization',
    description:
      'Non-profit organization established in 2008, working across Nepal for child protection, health, education, disaster resilience, WASH, and livelihoods.',
    images: ['/images/og-about.jpg'],
  },
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd key="about-breadcrumb" data={breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'About', url: '/about' }])} />
      <JsonLd key="about-org" data={organizationSchema} />
      <JsonLd
        key="about-faq"
        data={faqSchema([
          {
            question: 'When was Relief Nepal established?',
            answer: 'Relief Nepal was established in 2008 (2065 BS) and is headquartered in Sindhuli, Bagmati Province, Nepal.',
          },
          {
            question: 'What are Relief Nepal\'s main focus areas?',
            answer: 'Relief Nepal works across five core sectors: Child Protection, Education & Health, Disaster & Climate Resilience, WASH (Water, Sanitation & Hygiene), and Livelihoods.',
          },
          {
            question: 'Where does Relief Nepal operate?',
            answer: 'Relief Nepal operates across Bagmati, Madhesh, and Koshi provinces of Nepal, directly benefiting more than 15,000 people annually.',
          },
          {
            question: 'How is Relief Nepal governed?',
            answer: 'Relief Nepal is governed by a board of members with diverse expertise. The organization has four main departments: Program Development and Management, Administrative Department, Monitoring Evaluation and Knowledge Management, and Finance and Human Resource Management.',
          },
        ])}
      />
      <AboutPageClient />
    </>
  );
}