'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Menu, X } from 'lucide-react';
import { navigationGroups } from './navigation-links.js';

export default function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(null);
  return (
    <div className="lg:hidden">
      <button
        type="button"
        className="rounded p-2 text-slate-700"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <Menu />}
      </button>
      {open && (
        <nav
          aria-label="Mobile navigation"
          className="absolute left-0 right-0 top-full z-20 max-h-[80vh] overflow-y-auto border-t border-forest-100 bg-white px-6 py-4 shadow-lg"
        >
          {navigationGroups.map((group) => (
            <section key={group.label} className="border-b border-forest-100">
              <div className="flex items-center justify-between">
                <Link
                  onClick={() => setOpen(false)}
                  className="py-3 text-sm font-semibold text-slate-700"
                  href={group.href}
                >
                  {group.label}
                </Link>
                {group.links.length > 0 && (
                  <button
                    type="button"
                    className="p-3 text-slate-700"
                    aria-label={`${expanded === group.label ? 'Collapse' : 'Expand'} ${group.label}`}
                    aria-expanded={expanded === group.label}
                    onClick={() =>
                      setExpanded(expanded === group.label ? null : group.label)
                    }
                  >
                    <ChevronDown
                      size={18}
                      className={`transition ${expanded === group.label ? 'rotate-180' : ''}`}
                    />
                  </button>
                )}
              </div>
              {expanded === group.label && (
                <div className="pb-3 pl-4">
                  {group.links.map(([label, href]) => (
                    <Link
                      onClick={() => setOpen(false)}
                      key={label}
                      className="block py-2 text-sm text-slate-600 hover:text-forest-700"
                      href={href}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </section>
          ))}
        </nav>
      )}
    </div>
  );
}
