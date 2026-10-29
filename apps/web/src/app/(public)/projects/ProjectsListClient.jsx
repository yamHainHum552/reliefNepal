'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Search } from 'lucide-react';
import { apiRequest } from '../../../lib/api/client.js';
import styles from './projects.module.css';

export default function ProjectsListClient() {
  const [projects, setProjects] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [query, setQuery] = useState('');
  const [programId, setProgramId] = useState('');
  const [state, setState] = useState('loading');

  useEffect(() => {
    let active = true;
    apiRequest('/projects')
      .then((data) => {
        if (!active) return;
        setProjects(Array.isArray(data) ? data : []);
        setState('ready');
      })
      .catch(() => active && setState('error'));
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    apiRequest('/programs')
      .then((data) => {
        if (active) setPrograms(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (active) setPrograms([]);
      });
    return () => {
      active = false;
    };
  }, []);

  const visibleProjects = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesProgram =
        !programId || String(project.program_id) === String(programId);
      const searchable =
        `${project.title || ''} ${project.summary || ''} ${project.status || ''} ${project.program?.name || ''}`.toLowerCase();
      return matchesProgram && (!normalized || searchable.includes(normalized));
    });
  }, [projects, query, programId]);

  const selectedProgram = programs.find(
    (program) => String(program.id) === String(programId),
  );
  const countForProgram = (id) =>
    projects.filter((project) => String(project.program_id) === String(id))
      .length;

  return (
    <main className={styles.page}>
      <div className={styles.documentLayout}>
        <article className={styles.documentContent}>
          <header className={styles.hero} id="projects-overview">
            <p className={styles.eyebrow}>
              Relief Nepal &middot; Programs & projects
            </p>
            <h1>Projects shaped with communities</h1>
            <p>
              Explore Relief Nepal&rsquo;s published work by program. Project
              details are shared here after review and approval.
            </p>
          </header>

          <section
            className={styles.content}
            aria-labelledby="projects-heading"
          >
            <div className={styles.toolbar}>
              <div>
                <p className={styles.eyebrow}>Project directory</p>
                <h2 id="projects-heading">
                  {selectedProgram?.name || 'Current and past projects'}
                </h2>
                {state === 'ready' && (
                  <p className={styles.resultCount} aria-live="polite">
                    {visibleProjects.length}{' '}
                    {visibleProjects.length === 1 ? 'project' : 'projects'}
                  </p>
                )}
              </div>
              <label className={styles.search}>
                <Search size={19} aria-hidden="true" />
                <span className={styles.srOnly}>Search projects</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search projects"
                  type="search"
                />
              </label>
            </div>

            {state === 'loading' && (
              <p className={styles.message} role="status">
                Loading published projects&hellip;
              </p>
            )}
            {state === 'error' && (
              <p className={styles.message} role="alert">
                Project information is temporarily unavailable. Please try again
                later.
              </p>
            )}
            {state === 'ready' && visibleProjects.length === 0 && (
              <p className={styles.message}>
                {query || programId
                  ? 'No published projects match the selected category and search.'
                  : 'Published projects will be listed here as approved content becomes available.'}
              </p>
            )}
            {state === 'ready' && visibleProjects.length > 0 && (
              <div className={styles.grid}>
                {visibleProjects.map((project, index) => (
                  <article
                    className={styles.card}
                    key={project.id || project.slug}
                    style={{ animationDelay: `${Math.min(index * 45, 270)}ms` }}
                  >
                    {project.banner_url && (
                      <Image
                        src={project.banner_url}
                        alt=""
                        className={styles.banner}
                        width={600}
                        height={380}
                        unoptimized
                      />
                    )}
                    <div className={styles.cardTop}>
                      <span className={styles.badge}>{project.status}</span>
                      <span className={styles.cardMark} aria-hidden="true">
                        RN
                      </span>
                    </div>
                    {project.program?.name && (
                      <p className={styles.program}>{project.program.name}</p>
                    )}
                    <h3>{project.title}</h3>
                    <p>
                      {project.summary ||
                        'Further project details will be added as verified information becomes available.'}
                    </p>
                    <Link
                      href={`/projects/${project.slug}`}
                      className={styles.link}
                    >
                      Project details
                      <ArrowUpRight size={17} aria-hidden="true" />
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </section>
        </article>

        <aside className={styles.contentsPanel} aria-label="Project categories">
          <p className={styles.contentsTitle}>On this page</p>
          <nav aria-label="Filter projects by program">
            <button
              type="button"
              aria-pressed={!programId}
              className={!programId ? styles.categoryActive : ''}
              onClick={() => setProgramId('')}
            >
              <span>All projects</span>
              <span>{projects.length}</span>
            </button>
            {programs.map((program) => (
              <button
                key={program.id}
                type="button"
                aria-pressed={String(programId) === String(program.id)}
                className={
                  String(programId) === String(program.id)
                    ? styles.categoryActive
                    : ''
                }
                onClick={() => setProgramId(String(program.id))}
              >
                <span>{program.name}</span>
                <span>{countForProgram(program.id)}</span>
              </button>
            ))}
          </nav>
        </aside>
      </div>
    </main>
  );
}