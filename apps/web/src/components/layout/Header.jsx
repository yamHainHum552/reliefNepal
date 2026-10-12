import Link from 'next/link';
import { Leaf } from 'lucide-react';
import Container from '../shared/Container.jsx';
import PrimaryButton from '../shared/PrimaryButton.jsx';
import DesktopNavigation from './DesktopNavigation.jsx';
import MobileNavigation from './MobileNavigation.jsx';

export default function Header() {
  return <header className="sticky top-0 z-30 border-b border-forest-100 bg-ivory/95 backdrop-blur">
    <Container className="relative flex h-20 items-center justify-between gap-6">
      <Link href="/" aria-label="Relief Nepal home" className="flex items-center gap-2 text-forest-900"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-forest-700 text-white"><Leaf size={21} /></span><span className="text-lg font-bold leading-tight">Relief Nepal<span className="block text-[10px] font-medium uppercase tracking-[0.2em] text-forest-600">Community. Dignity. Hope.</span></span></Link>
      <DesktopNavigation />
      <div className="hidden lg:block"><PrimaryButton href="/get-involved">Support our work</PrimaryButton></div>
      <MobileNavigation />
    </Container>
  </header>;
}
