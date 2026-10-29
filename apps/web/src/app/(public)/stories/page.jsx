import JsonLd from '../../../components/seo/JsonLd.jsx';
import { breadcrumbSchema, organizationSchema, faqSchema } from '../../../lib/seo.js';

export const metadata = {
  title: 'Community Stories & Updates | Relief Nepal',
  description:
    'Read stories of change from communities Relief Nepal works with. Community stories shared with consent, highlighting impact across our programs in protection, health, education, disaster resilience, WASH, and livelihoods.',
  openGraph: {
    title: 'Community Stories & Updates | Relief Nepal',
    description:
      'Stories of change from communities Relief Nepal works with. Shared with community consent and reviewed context.',
    type: 'website',
    images: [
      {
        url: '/images/og-stories.jpg',
        width: 1200,
        height: 630,
        alt: 'Relief Nepal - Community stories of change',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Community Stories & Updates | Relief Nepal',
    description:
      'Stories of change from communities Relief Nepal works with. Shared with community consent.',
    images: ['/images/og-stories.jpg'],
  },
  alternates: {
    canonical: '/stories',
  },
};

export default function StoriesPage() {
  return (
    <>
      <JsonLd key="stories-breadcrumb" data={breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Stories', url: '/stories' }])} />
      <JsonLd key="stories-org" data={organizationSchema} />
      <JsonLd
        key="stories-faq"
        data={faqSchema([
          {
            question: 'How are community stories collected and shared?',
            answer: 'Stories are shared with full community consent and reviewed context. Relief Nepal follows ethical storytelling practices ensuring dignity and agency of community members.',
          },
          {
            question: 'Can I share a story from my community?',
            answer: 'If you have a story of change from your community related to Relief Nepal\'s work, please contact us through the contact page to discuss sharing it.',
          },
          {
            question: 'Where can I find the latest updates from Relief Nepal?',
            answer: 'The latest updates and stories are published on this page. You can also check the Notices section for official announcements.',
          },
        ])}
      />
      <main className="bg-[#f7f8f5] px-5 py-20 text-[#183a2a] sm:py-28">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-forest-600">
            Stories and media
          </p>
          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
            Community stories
          </h1>
          <p className="mt-5 max-w-2xl leading-7 text-slate-600">
            Stories will be shared here with community consent and reviewed
            context. New publications are being prepared.
          </p>
        </div>
      </main>
    </>
  );
}