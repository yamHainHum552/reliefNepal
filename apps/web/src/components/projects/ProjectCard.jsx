import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function ProjectCard({ title, summary, href = '/projects/sample-project', status = 'Project details coming soon' }) {
  return <article className="rounded-2xl border border-forest-100 bg-white p-6 shadow-sm"><p className="text-xs font-bold uppercase tracking-[0.15em] text-forest-600">{status}</p><h3 className="mt-3 text-xl font-semibold text-forest-900">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{summary}</p><Link className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-forest-700" href={href}>Learn more <ArrowUpRight size={16} /></Link></article>;
}
