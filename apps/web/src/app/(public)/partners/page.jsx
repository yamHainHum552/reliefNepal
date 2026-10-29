import { permanentRedirect } from 'next/navigation';

export const metadata = { title: 'Our Network and Partners' };

export default function PartnersPage() {
  permanentRedirect('/network');
}
