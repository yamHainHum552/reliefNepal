'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({ name: z.string().min(2, 'Enter your name'), email: z.string().email('Enter a valid email address'), message: z.string().min(10, 'Please add a little more detail') });
const fieldClass = 'mt-1 min-h-11 w-full rounded-lg border border-forest-100 bg-white px-3 text-slate-900';

export default function ContactForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
  const onSubmit = () => window.alert('The contact form will be connected soon.');
  return <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5" noValidate>
    {['name', 'email', 'message'].map((field) => <div key={field}><label htmlFor={`contact-${field}`} className="text-sm font-medium capitalize">{field}</label>{field === 'message' ? <textarea id={`contact-${field}`} rows="5" aria-invalid={Boolean(errors[field])} className={fieldClass} {...register(field)} /> : <input id={`contact-${field}`} type={field === 'email' ? 'email' : 'text'} autoComplete={field === 'name' ? 'name' : 'email'} aria-invalid={Boolean(errors[field])} className={fieldClass} {...register(field)} />}{errors[field] && <p role="alert" className="mt-1 text-sm text-red-700">{errors[field].message}</p>}</div>)}
    <button className="min-h-11 justify-self-start rounded-full bg-forest-700 px-6 py-3 text-sm font-semibold text-white hover:bg-forest-900">Send message</button>
    <p className="text-xs text-slate-500">This form is a starter UI and does not submit or store personal information yet.</p>
  </form>;
}
