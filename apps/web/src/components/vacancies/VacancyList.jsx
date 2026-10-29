'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiRequest } from '../../lib/api/client.js';

function displayDate(value) {
  if (!value) return null;
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Kathmandu',
  }).format(new Date(`${value}T00:00:00+05:45`));
}

export default function VacancyList() {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    apiRequest('/vacancies')
      .then((items) => {
        if (active) setVacancies(Array.isArray(items) ? items : []);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="mx-auto max-w-5xl px-5 py-12 sm:py-16">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.18em] text-forest-600">
            Work with us
          </p>
          <h2 className="mt-2 text-2xl font-bold text-forest-900">
            Current openings
          </h2>
        </div>
        <p className="text-sm text-slate-500">
          {vacancies.length} {vacancies.length === 1 ? 'position' : 'positions'}
        </p>
      </div>

      {loading && (
        <p className="rounded-xl bg-white p-6 text-sm text-slate-600">
          Loading current openings…
        </p>
      )}
      {!loading && error && (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-white p-6 text-sm text-red-800"
        >
          {error}
        </p>
      )}
      {!loading && !error && vacancies.length === 0 && (
        <div className="rounded-2xl border border-forest-100 bg-white p-8 text-center">
          <h3 className="font-semibold text-forest-900">
            There are no open vacancies right now.
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Please check back for future opportunities with Relief Nepal.
          </p>
        </div>
      )}

      <div className="grid gap-4">
        {vacancies.map((vacancy) => (
          <article
            key={vacancy.id}
            className="rounded-2xl border border-forest-100 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-forest-900">
                  <Link
                    className="hover:underline"
                    href={`/vacancies/${encodeURIComponent(vacancy.slug)}`}
                  >
                    {vacancy.title}
                  </Link>
                </h3>
                <p className="mt-2 text-sm capitalize text-slate-600">
                  {vacancy.job_type.replaceAll('-', ' ')} · {vacancy.job_level}{' '}
                  level
                </p>
              </div>
              <Link
                className="rounded-lg bg-forest-800 px-4 py-2 text-sm font-semibold text-white hover:bg-forest-900"
                href={`/vacancies/${encodeURIComponent(vacancy.slug)}`}
              >
                View vacancy
              </Link>
            </div>
            <dl className="mt-5 grid gap-4 border-t border-forest-50 pt-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Location
                </dt>
                <dd className="mt-1 font-medium text-slate-800">
                  {vacancy.location}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Open positions
                </dt>
                <dd className="mt-1 font-medium text-slate-800">
                  {vacancy.number_of_vacancies}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Salary
                </dt>
                <dd className="mt-1 font-medium text-slate-800">Negotiable</dd>
              </div>
              {vacancy.application_deadline && (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Apply by
                  </dt>
                  <dd className="mt-1 font-medium text-slate-800">
                    {displayDate(vacancy.application_deadline)}
                  </dd>
                </div>
              )}
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
