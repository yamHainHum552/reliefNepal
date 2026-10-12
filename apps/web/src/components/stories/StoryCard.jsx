import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function StoryCard({ title, summary, href = '/stories' }) {
  return <article className="overflow-hidden rounded-2xl border border-forest-100 bg-white"><div className="h-44 bg-[url('/images/community-placeholder.svg')] bg-cover bg-center" role="img" aria-label="Placeholder landscape illustration" /><div className="p-6"><p className="text-xs font-bold uppercase tracking-[0.15em] text-forest-600">Story placeholder</p><h3 className="mt-3 text-xl font-semibold text-forest-900">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{summary}</p><Link href={href} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-forest-700">Read story <ArrowUpRight size={15} /></Link></div></article>;
}
