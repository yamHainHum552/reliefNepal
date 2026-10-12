import { FileText, Download } from 'lucide-react';

export default function ReportCard({ title, period = 'Details to be confirmed', href = '#' }) {
  return <article className="flex items-center gap-4 rounded-xl border border-forest-100 bg-white p-5"><FileText className="shrink-0 text-forest-700" /><div className="min-w-0 flex-1"><h3 className="font-semibold text-forest-900">{title}</h3><p className="mt-1 text-sm text-slate-500">{period}</p></div><a href={href} aria-label={`Download ${title}`} className="rounded-full p-2 text-forest-700 hover:bg-forest-50"><Download size={18} /></a></article>;
}
