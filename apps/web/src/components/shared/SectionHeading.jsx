export default function SectionHeading({ eyebrow, title, description, centered = false }) {
  return <div className={`max-w-2xl ${centered ? 'mx-auto text-center' : ''}`}>
    {eyebrow && <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-forest-600">{eyebrow}</p>}
    <h2 className="text-3xl font-semibold leading-tight text-forest-900 sm:text-4xl">{title}</h2>
    {description && <p className="mt-4 text-base leading-7 text-slate-600">{description}</p>}
  </div>;
}
