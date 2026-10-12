import { ArrowRight } from 'lucide-react';
import Container from '../../components/shared/Container.jsx';
import SectionHeading from '../../components/shared/SectionHeading.jsx';
import PrimaryButton from '../../components/shared/PrimaryButton.jsx';
import PageHero from '../../components/home/PageHero.jsx';
import ProgramCard from '../../components/home/ProgramCard.jsx';
import ImpactStat from '../../components/impact/ImpactStat.jsx';
import StoryCard from '../../components/stories/StoryCard.jsx';
import NewsletterForm from '../../components/forms/NewsletterForm.jsx';

const programs = [
  { title: 'Community resilience', description: 'Placeholder overview of community-led approaches to prepare for and respond to change.' },
  { title: 'Inclusive livelihoods', description: 'Placeholder overview of work that supports equitable and sustainable opportunities.' },
  { title: 'Health and wellbeing', description: 'Placeholder overview of initiatives that support healthier, more connected communities.' },
];

export default function HomePage() {
  return <>
    <PageHero />
    <section id="impact" className="py-16 sm:py-20"><Container><SectionHeading eyebrow="Our impact" title="Progress worth measuring" description="Verified impact figures will be published here once reviewed and approved." centered /><div className="mt-9 grid gap-4 sm:grid-cols-3"><ImpactStat label="People reached" /><ImpactStat label="Communities supported" /><ImpactStat label="Programs underway" /></div></Container></section>
    <section className="bg-white py-16 sm:py-20"><Container><div className="flex flex-wrap items-end justify-between gap-6"><SectionHeading eyebrow="Our work" title="Working together for lasting change" description="Discover our thematic areas. Program details are being prepared." /><PrimaryButton href="/our-work">All our work <ArrowRight size={16} className="ml-2" /></PrimaryButton></div><div className="mt-9 grid gap-5 md:grid-cols-3">{programs.map((program) => <ProgramCard key={program.title} {...program} />)}</div></Container></section>
    <section className="py-16 sm:py-20"><Container className="grid items-center gap-10 lg:grid-cols-2"><div className="min-h-72 rounded-3xl bg-[url('/images/community-placeholder.svg')] bg-cover bg-center" role="img" aria-label="Illustrated placeholder for a community story" /><div><SectionHeading eyebrow="A story from the field" title="Community voices belong at the center" description="This space is reserved for a verified story shared with permission. We will add it when approved content is available." /><a href="/stories" className="mt-6 inline-flex items-center gap-2 font-semibold text-forest-700">Read more stories <ArrowRight size={17} /></a></div></Container></section>
    <section className="bg-forest-50 py-16 sm:py-20"><Container className="grid gap-8 lg:grid-cols-2 lg:items-center"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-forest-600">Get involved</p><h2 className="mt-3 text-3xl font-semibold text-forest-900">Help communities shape what comes next.</h2><p className="mt-4 max-w-lg leading-7 text-slate-600">Learn how to support locally led work. Giving options and active appeals will be listed after they are verified.</p></div><div className="rounded-2xl bg-white p-7 shadow-sm"><p className="text-sm font-semibold text-forest-800">Stay connected</p><p className="mb-4 mt-1 text-sm text-slate-600">Newsletter sign-up is shown as a preview; submissions are not stored yet.</p><NewsletterForm /></div></Container></section>
    <section className="py-16 sm:py-20"><Container><SectionHeading eyebrow="Updates" title="Stories and updates" description="The latest verified news, field stories, and organizational updates will appear here." /><div className="mt-8 grid gap-5 md:grid-cols-2"><StoryCard title="Stories are on the way" summary="We are preparing stories and updates with the care and context they deserve." /><StoryCard title="Updates are on the way" summary="News and media will be published here as verified content becomes available." /></div></Container></section>
  </>;
}
