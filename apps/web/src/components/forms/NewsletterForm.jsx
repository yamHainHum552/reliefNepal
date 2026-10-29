'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiRequest } from '../../lib/api/client.js';

const schema = z.object({
  email: z.string().trim().email('Enter a valid email address').max(254),
  consent: z.literal(true, { errorMap: () => ({ message: 'Please confirm your email preferences' }) }),
  website: z.string().max(200).optional(),
});

export default function NewsletterForm() {
  const [status, setStatus] = useState({ state: 'idle', message: '' });
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  async function onSubmit(values) {
    setStatus({ state: 'idle', message: '' });
    try {
      await apiRequest('/inquiries/newsletter', { method: 'POST', body: JSON.stringify(values) });
      reset();
      setStatus({ state: 'success', message: 'Thank you. You are subscribed to email updates.' });
    } catch (error) {
      setStatus({ state: 'error', message: error.message });
    }
  }

  return <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3" noValidate>
    <div>
      <label className="sr-only" htmlFor="newsletter-email">Email address</label>
      <input id="newsletter-email" type="email" autoComplete="email" placeholder="Your email address" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'newsletter-error' : undefined} className="min-h-12 w-full rounded-full border border-forest-100 px-5 text-sm text-slate-900" {...register('email')} />
      {errors.email && <p id="newsletter-error" role="alert" className="mt-1 text-sm text-red-700">{errors.email.message}</p>}
    </div>
    <label className="flex items-start gap-2 text-sm text-slate-600"><input type="checkbox" className="mt-1 accent-forest-700" aria-invalid={Boolean(errors.consent)} {...register('consent')} /><span>I agree to receive email updates and understand I can unsubscribe.</span></label>
    {errors.consent && <p role="alert" className="text-sm text-red-700">{errors.consent.message}</p>}
    <label className="sr-only" aria-hidden="true">Leave this field empty<input tabIndex={-1} autoComplete="off" className="hidden" {...register('website')} /></label>
    <button disabled={isSubmitting} className="min-h-12 rounded-full bg-forest-700 px-6 text-sm font-semibold text-white hover:bg-forest-900 disabled:cursor-wait disabled:opacity-60">{isSubmitting ? 'Submitting…' : 'Subscribe'}</button>
    {status.message && <p role={status.state === 'error' ? 'alert' : 'status'} className={`text-sm ${status.state === 'error' ? 'text-red-700' : 'text-forest-700'}`}>{status.message}</p>}
  </form>;
}
