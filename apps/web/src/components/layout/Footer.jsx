import Link from 'next/link';
import Container from '../shared/Container.jsx';

export default function Footer() {
  return <footer className="bg-forest-900 py-12 text-white">
    <Container className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
      <div><p className="text-xl font-semibold">Relief Nepal</p><p className="mt-3 max-w-xs text-sm leading-6 text-white/70">Working alongside communities for a more resilient and equitable future.</p></div>
      <div><h2 className="font-semibold">Explore</h2><div className="mt-3 grid gap-2 text-sm text-white/75"><Link href="/about">About us</Link><Link href="/our%20work">Our work</Link><Link href="/stories">Stories</Link></div></div>
      <div><h2 className="font-semibold">Get involved</h2><div className="mt-3 grid gap-2 text-sm text-white/75"><Link href="/get-involved">Ways to help</Link><Link href="/partners">Partners</Link><Link href="/contact">Contact us</Link></div></div>
      <div><h2 className="font-semibold">Transparency</h2><p className="mt-3 text-sm leading-6 text-white/75">Public reports and organizational information will be published here.</p><Link className="mt-2 inline-block text-sm text-white underline" href="/transparency">View resources</Link></div>
    </Container>
    <Container className="mt-10 border-t border-white/15 pt-5 text-xs text-white/60">© {new Date().getFullYear()} Relief Nepal. Website content is being prepared.</Container>
  </footer>;
}
