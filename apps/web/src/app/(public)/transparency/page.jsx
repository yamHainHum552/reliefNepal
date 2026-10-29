import JsonLd from '../../../components/seo/JsonLd.jsx';
import { breadcrumbSchema, organizationSchema, faqSchema } from '../../../lib/seo.js';

export const metadata = {
  title: 'Transparency & Public Resources | Relief Nepal',
  description:
    'Review Relief Nepal\'s annual reports, audited financial statements, and organizational policies. We are committed to transparency and accountability in all our operations.',
  openGraph: {
    title: 'Transparency & Public Resources | Relief Nepal',
    description:
      'Annual reports, audited statements, and organizational policies from Relief Nepal. Committed to transparency and accountability.',
    type: 'website',
    images: [
      {
        url: '/images/og-transparency.jpg',
        width: 1200,
        height: 630,
        alt: 'Relief Nepal - Transparency and public resources',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Transparency & Public Resources | Relief Nepal',
    description:
      'Annual reports, audited statements, and organizational policies from Relief Nepal.',
    images: ['/images/og-transparency.jpg'],
  },
  alternates: {
    canonical: '/transparency',
  },
};

export default function TransparencyPage() {
  return (
    <>
      <JsonLd key="transparency-breadcrumb" data={breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Transparency', url: '/transparency' }])} />
      <JsonLd key="transparency-org" data={organizationSchema} />
      <JsonLd
        key="transparency-faq"
        data={faqSchema([
          {
            question: 'What transparency documents does Relief Nepal publish?',
            answer: 'Relief Nepal publishes annual reports, audited financial statements, and organizational policies once approved for public release.',
          },
          {
            question: 'How often are financial reports published?',
            answer: 'Audited financial statements are published annually after the fiscal year audit is completed and approved by the board.',
          },
          {
            question: 'Can I request additional information not published here?',
            answer: 'Yes, you can contact Relief Nepal through the contact page to request additional public information in accordance with Nepal\'s Right to Information Act.',
          },
        ])}
      />
      <main className="bg-[#f7f8f5] px-5 py-20 text-[#183a2a] sm:py-28">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-forest-600">
            Accountability
          </p>
          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
            Transparency and public resources
          </h1>
          <p className="mt-5 max-w-2xl leading-7 text-slate-600">
            Reviewed annual reports, audited statements, and organizational
            policies will be published here. No financial figures or documents
            are shown until approved for public release.
          </p>
          <div className="mt-8 rounded-xl border border-dashed border-forest-200 bg-white p-6 text-sm text-slate-600">
            Public documents are being prepared.
          </div>
        </div>
      </main>
    </>
  );
}