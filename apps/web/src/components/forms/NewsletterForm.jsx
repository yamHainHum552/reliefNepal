'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({ email: z.string().email('Enter a valid email address') });

export default function NewsletterForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
  const onSubmit = () => window.alert('Newsletter sign-up will be available soon.');
  return <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 sm:flex-row" noValidate><div className="flex-1"><label className="sr-only" htmlFor="newsletter-email">Email address</label><input id="newsletter-email" type="email" autoComplete="email" placeholder="Your email address" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'newsletter-error' : undefined} className="min-h-12 w-full rounded-full border border-forest-100 px-5 text-sm text-slate-900" {...register('email')} />{errors.email && <p id="newsletter-error" role="alert" className="mt-1 text-sm text-red-700">{errors.email.message}</p>}</div><button className="min-h-12 rounded-full bg-forest-700 px-6 text-sm font-semibold text-white hover:bg-forest-900">Subscribe</button></form>;
}
