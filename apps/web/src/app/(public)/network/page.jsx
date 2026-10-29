import NetworkExplorer from '../../../components/networks/NetworkExplorer.jsx';
import JsonLd from '../../../components/seo/JsonLd.jsx';
import { breadcrumbSchema, organizationSchema } from '../../../lib/seo.js';

export const metadata = {
  title: 'Our Network & Partners | Relief Nepal',
  description:
    'Meet the local organizations and resource partners working alongside Relief Nepal. Explore our network of district partners and resource providers across Nepal.',
  openGraph: {
    title: 'Our Network & Partners | Relief Nepal',
    description:
      'Explore Relief Nepal\'s network of local district partners and resource providers working together for community-led development.',
    type: 'website',
    images: [
      {
        url: '/images/og-network.jpg',
        width: 1200,
        height: 630,
        alt: 'Relief Nepal - Our network of partners',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Network & Partners | Relief Nepal',
    description:
      'Explore Relief Nepal\'s network of local district partners and resource providers.',
    images: ['/images/og-network.jpg'],
  },
  alternates: {
    canonical: '/network',
  },
};

export default function NetworkPage() {
  return (
    <>
      <JsonLd key="network-breadcrumb" data={breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Our Network', url: '/network' }])} />
      <JsonLd key="network-org" data={organizationSchema} />
      <NetworkExplorer />
    </>
  );
}