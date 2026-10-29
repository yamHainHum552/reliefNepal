import Link from 'next/link';
import { navigationGroups } from './navigation-links.js';

export default function DesktopNavigation() {
  return (
    <nav
      aria-label="Main navigation"
      className="hidden items-center gap-3 lg:flex"
    >
      {navigationGroups.map((group) => (
        <div key={group.label} className="group relative py-6">
          <Link
            className="whitespace-nowrap text-sm font-semibold text-slate-700 hover:text-forest-700 focus:text-forest-700"
            href={group.href}
          >
            {group.label}
          </Link>
          {group.links.length > 0 && (
            <div className="invisible absolute left-0 top-full z-40 min-w-60 translate-y-1 rounded-xl border border-forest-100 bg-white p-2 opacity-0 shadow-xl transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
              {group.links.map(([label, href]) => (
                <Link
                  key={label}
                  className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-forest-50 hover:text-forest-800 focus:bg-forest-50"
                  href={href}
                >
                  {label}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}
