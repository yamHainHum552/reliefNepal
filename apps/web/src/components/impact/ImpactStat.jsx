export default function ImpactStat({ value = 'To be verified', label }) {
  return <div className="rounded-2xl border border-forest-100 bg-white p-6 text-center"><p className="text-2xl font-semibold text-forest-800">{value}</p><p className="mt-2 text-sm text-slate-600">{label}</p></div>;
}
