import Link from 'next/link';
import { ArrowUpRight, HeartHandshake, Sprout, ShieldPlus } from 'lucide-react';

const icons = { 'Community resilience': ShieldPlus, 'Inclusive livelihoods': Sprout, 'Health and wellbeing': HeartHandshake };

export default function ProgramCard({ title, description, href = '/our-work/community-resilience' }) {
  const Icon = icons[title] || Sprout;
  return <Link href={href} className="group rounded-2xl border border-forest-100 bg-white p-6 transition hover:-translate-y-1 hover:shadow-md"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest-50 text-forest-700"><Icon /></span><h3 className="mt-5 text-lg font-semibold text-forest-900">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{description}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-forest-700">Explore <ArrowUpRight size={15} /></span></Link>;
}
