'use client';

export default function Error({ reset }) { return <section className="px-5 py-24 text-center"><h1 className="text-3xl font-semibold text-forest-900">Something went wrong</h1><p className="mt-3 text-slate-600">Please try again.</p><button className="mt-6 rounded-full bg-forest-700 px-6 py-3 font-semibold text-white" onClick={() => reset()}>Try again</button></section>; }
