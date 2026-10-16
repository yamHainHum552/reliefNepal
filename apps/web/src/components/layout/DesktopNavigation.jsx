import Link from 'next/link';

const links = [['About', '/about'], ['Our Work', '/our%20work'], ['Impact', '/impact'], ['Stories', '/stories'], ['Get Involved', '/get-involved'], ['Transparency', '/transparency'], ['Contact', '/contact']];

export default function DesktopNavigation() {
  return <nav aria-label="Main navigation" className="hidden items-center gap-5 lg:flex">{links.map(([label, href]) => <Link key={href} className="text-sm font-medium text-slate-700 hover:text-forest-700" href={href}>{label}</Link>)}</nav>;
}
