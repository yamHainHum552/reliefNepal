'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactInquirySchema } from '@relief-nepal/shared/schemas/project';
const fieldClass =
  'mt-1 min-h-11 w-full rounded-lg border border-forest-100 bg-white px-3 text-slate-900';

export default function ContactForm() {
  const [status, setStatus] = useState({ state: 'idle', message: '' });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(contactInquirySchema) });

  async function onSubmit(values) {
    setStatus({ state: 'idle', message: '' });
    if (values.website) {
      reset();
      setStatus({
        state: 'success',
        message:
          'Thank you for contacting us. Your message has been sent to the Relief Nepal team.',
      });
      return;
    }

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
    if (!serviceId || !templateId || !publicKey) {
      setStatus({
        state: 'error',
        message:
          'The contact form is not configured yet. Please email info@reliefnepal.org.np.',
      });
      return;
    }

    try {
      const response = await fetch(
        'https://api.emailjs.com/api/v1.0/email/send',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            service_id: serviceId,
            template_id: templateId,
            user_id: publicKey,
            template_params: {
              from_name: values.name.trim(),
              reply_to: values.email.trim(),
              email: values.email.trim(),
              subject: values.subject?.trim() || 'Website contact form',
              message: values.message.trim(),
              time: new Date().toLocaleString(),
            },
          }),
        },
      );
      if (!response.ok) throw new Error('EmailJS rejected the message.');
      reset();
      setStatus({
        state: 'success',
        message:
          'Thank you for contacting us. Your message has been sent to the Relief Nepal team.',
      });
    } catch {
      setStatus({
        state: 'error',
        message:
          'We could not send your message. Please try again or email info@reliefnepal.org.np.',
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5" noValidate>
      <div>
        <label htmlFor="contact-name" className="text-sm font-medium">
          Name
        </label>
        <input
          id="contact-name"
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'contact-name-error' : undefined}
          className={fieldClass}
          {...register('name')}
        />
        {errors.name && (
          <p
            id="contact-name-error"
            role="alert"
            className="mt-1 text-sm text-red-700"
          >
            {errors.name.message}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="contact-email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'contact-email-error' : undefined}
          className={fieldClass}
          {...register('email')}
        />
        {errors.email && (
          <p
            id="contact-email-error"
            role="alert"
            className="mt-1 text-sm text-red-700"
          >
            {errors.email.message}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="contact-subject" className="text-sm font-medium">
          Subject <span className="text-slate-500">(optional)</span>
        </label>
        <input
          id="contact-subject"
          aria-invalid={Boolean(errors.subject)}
          className={fieldClass}
          {...register('subject')}
        />
      </div>
      <div>
        <label htmlFor="contact-message" className="text-sm font-medium">
          Message
        </label>
        <textarea
          id="contact-message"
          rows="5"
          aria-invalid={Boolean(errors.message)}
          aria-describedby={
            errors.message ? 'contact-message-error' : undefined
          }
          className={`${fieldClass} py-3`}
          {...register('message')}
        />
        {errors.message && (
          <p
            id="contact-message-error"
            role="alert"
            className="mt-1 text-sm text-red-700"
          >
            {errors.message.message}
          </p>
        )}
      </div>
      <label className="sr-only" aria-hidden="true">
        Leave this field empty
        <input
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          {...register('website')}
        />
      </label>
      <button
        disabled={isSubmitting}
        className="min-h-11 justify-self-start rounded-full bg-forest-700 px-6 py-3 text-sm font-semibold text-white hover:bg-forest-900 disabled:cursor-wait disabled:opacity-60"
      >
        {isSubmitting ? 'Sending…' : 'Send message'}
      </button>
      {status.message && (
        <p
          role={status.state === 'error' ? 'alert' : 'status'}
          className={`text-sm ${status.state === 'error' ? 'text-red-700' : 'text-forest-700'}`}
        >
          {status.message}
        </p>
      )}
      <p className="text-xs text-slate-500">
        Your message is sent directly to the Relief Nepal team by email.
      </p>
    </form>
  );
}
