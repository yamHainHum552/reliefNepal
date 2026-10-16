'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const links = [['About', '/about'], ['Our Work', '/our%20work'], ['Impact', '/impact'], ['Stories', '/stories'], ['Get Involved', '/get-involved'], ['Transparency', '/transparency'], ['Contact', '/contact']];

export default function MobileNavigation() {
  const [open, setOpen] = useState(false);
  return <div className="lg:hidden">
    <button type="button" className="rounded p-2" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
    {open && <nav aria-label="Mobile navigation" className="absolute left-0 right-0 top-full z-20 border-t border-forest-100 bg-ivory px-6 py-4 shadow-lg">{links.map(([label, href]) => <Link onClick={() => setOpen(false)} key={href} className="block border-b border-forest-100 py-3 text-sm font-medium" href={href}>{label}</Link>)}</nav>}
  </div>;
}
