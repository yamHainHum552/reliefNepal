'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Camera,
  Image as ImageIcon,
  Music2,
  Play,
  Search,
  X,
} from 'lucide-react';
import { apiRequest } from '../../../lib/api/client.js';
import styles from './gallery.module.css';

const mediaFilters = [
  { value: 'all', label: 'All media' },
  { value: 'photo', label: 'Photos' },
  { value: 'video', label: 'Videos' },
  { value: 'audio', label: 'Audio stories' },
];

function youtubeId(value) {
  if (!value) return '';
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, '');
    if (host === 'youtu.be') return url.pathname.slice(1).split('/')[0];
    if (host.endsWith('youtube.com') || host === 'youtube-nocookie.com') {
      if (url.pathname === '/watch') return url.searchParams.get('v') || '';
      const match = url.pathname.match(/\/(?:embed|shorts)\/([^/?]+)/);
      return match?.[1] || '';
    }
  } catch {
    return '';
  }
  return '';
}

function makeProjectGroups(items) {
  const groups = new Map();
  items.forEach((item) => {
    const project = item.project;
    if (!project?.id || !project.slug) return;
    if (!groups.has(project.id)) groups.set(project.id, { project, items: [] });
    groups.get(project.id).items.push(item);
  });
  return [...groups.values()].sort((a, b) =>
    a.project.title.localeCompare(b.project.title),
  );
}

function mediaSummary(items) {
  const counts = { photo: 0, video: 0, audio: 0 };
  items.forEach((item) => {
    if (counts[item.media_type] !== undefined) counts[item.media_type] += 1;
  });
  return counts;
}

function CoverImage({ project, items }) {
  const cover =
    project.banner_url ||
    items.find((item) => item.media_type === 'photo')?.media_url ||
    items.find((item) => item.thumbnail_url)?.thumbnail_url ||
    (() => {
      const video = items.find((item) => item.media_type === 'video');
      const id = youtubeId(video?.media_url);
      return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : '';
    })();

  return cover ? <img src={cover} alt="" loading="lazy" /> : null;
}

function LoadingState() {
  return (
    <div className={styles.message} role="status">
      Loading project galleries…
    </div>
  );
}

function GalleryLoadError({ message, onRetry }) {
  return (
    <div className={`${styles.message} ${styles.messageError}`} role="alert">
      <p>{message || 'The gallery could not be loaded. Please try again.'}</p>
      <button className={styles.retryButton} onClick={onRetry} type="button">
        Try again
      </button>
    </div>
  );
}

export function GalleryDirectory() {
  const [items, setItems] = useState([]);
  const [state, setState] = useState('loading');
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const loadGallery = useCallback(async () => {
    setState('loading');
    setError('');
    try {
      const data = await apiRequest('/gallery');
      setItems(Array.isArray(data) ? data : []);
      setState('ready');
    } catch (loadError) {
      setError(loadError.message);
      setState('error');
    }
  }, []);

  useEffect(() => {
    loadGallery();
  }, [loadGallery]);

  const projects = useMemo(() => makeProjectGroups(items), [items]);
  const normalizedSearch = search.trim().toLowerCase();
  const visibleProjects = projects.filter(({ project }) =>
    [project.title, project.program?.name, project.location]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(normalizedSearch)),
  );
  const counts = mediaSummary(items);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Relief Nepal · Field stories</p>
            <h1>Every project has a story.</h1>
            <p className={styles.heroText}>
              Explore the people, places, and progress behind our work across
              Nepal. Each collection brings together moments from a project.
            </p>
            <div className={styles.stats} aria-label="Gallery totals">
              <div className={styles.stat}>
                <strong>{state === 'ready' ? projects.length : '—'}</strong>
                <span>project collections</span>
              </div>
              <div className={styles.stat}>
                <strong>{state === 'ready' ? counts.photo : '—'}</strong>
                <span>photographs</span>
              </div>
              <div className={styles.stat}>
                <strong>
                  {state === 'ready' ? counts.video + counts.audio : '—'}
                </strong>
                <span>videos and audio stories</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.content} aria-labelledby="gallery-collections">
        <div className={styles.toolbar}>
          <div>
            <h2 className={styles.sectionTitle} id="gallery-collections">
              Project collections
            </h2>
            <p className={styles.sectionNote}>
              {state === 'ready'
                ? `${projects.length} ${projects.length === 1 ? 'collection' : 'collections'} to explore`
                : 'Browse stories organized by project'}
            </p>
          </div>
          {state === 'ready' && projects.length > 0 && (
            <label className={styles.search}>
              <Search size={18} aria-hidden="true" />
              <span className={styles.srOnly}>Search project galleries</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search projects or programs"
              />
            </label>
          )}
        </div>

        {state === 'loading' && <LoadingState />}
        {state === 'error' && (
          <GalleryLoadError message={error} onRetry={loadGallery} />
        )}
        {state === 'ready' && projects.length === 0 && (
          <div className={styles.message}>
            Project galleries will appear here as new stories are published.
          </div>
        )}
        {state === 'ready' &&
          projects.length > 0 &&
          visibleProjects.length === 0 && (
            <div className={styles.message}>
              No project galleries match “{search}”. Try a different search.
            </div>
          )}
        {state === 'ready' && visibleProjects.length > 0 && (
          <div className={styles.projectGrid}>
            {visibleProjects.map(({ project, items: projectItems }, index) => {
              const totals = mediaSummary(projectItems);
              const total = totals.photo + totals.video + totals.audio;
              const featured = index % 5 === 0;

              return (
                <article
                  className={styles.projectCard}
                  data-layout={featured ? 'feature' : 'standard'}
                  key={project.id}
                  style={{ '--delay': `${Math.min(index % 8, 6) * 65}ms` }}
                >
                  <Link
                    className={styles.cover}
                    href={`/gallery/${encodeURIComponent(project.slug)}`}
                    aria-label={`Open ${project.title} gallery`}
                  >
                    <CoverImage project={project} items={projectItems} />
                    <span className={styles.coverCount}>
                      <Camera size={15} aria-hidden="true" />
                      {total} {total === 1 ? 'story' : 'stories'}
                    </span>
                  </Link>
                  <div className={styles.cardBody}>
                    <p className={styles.cardKicker}>
                      {project.program?.name || 'Project collection'}
                    </p>
                    <h3>{project.title}</h3>
                    <p>
                      {project.summary ||
                        `Photos, videos and community stories from ${project.title}.`}
                    </p>
                    <Link
                      className={styles.cardLink}
                      href={`/gallery/${encodeURIComponent(project.slug)}`}
                    >
                      Explore collection <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

function MediaCard({ item, index, onOpenPhoto }) {
  const video = item.media_type === 'video';
  const videoId = video ? youtubeId(item.media_url) : '';
  const title = item.title || 'Untitled story';

  return (
    <article
      className={styles.mediaCard}
      style={{ '--delay': `${Math.min(index % 10, 8) * 45}ms` }}
    >
      {item.media_type === 'photo' && item.media_url && (
        <button
          className={styles.photoButton}
          type="button"
          onClick={() => onOpenPhoto(item)}
          aria-label={`Open photo: ${title}`}
        >
          <img
            className={styles.mediaPhoto}
            src={item.media_url}
            alt={item.alt_text || title}
            loading="lazy"
          />
          <span className={styles.viewHint}>View photo</span>
        </button>
      )}
      {video && videoId && (
        <div className={styles.videoFrame}>
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}`}
            title={title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      )}
      {item.media_type === 'audio' && item.media_url && (
        <div className={styles.audioPanel}>
          <span className={styles.audioIcon} aria-hidden="true">
            <Music2 size={21} />
          </span>
          <audio aria-label={`Listen to ${title}`} controls preload="none">
            <source src={item.media_url} />
            Your browser does not support audio playback.
          </audio>
        </div>
      )}
      <div className={styles.caption}>
        <h2>{title}</h2>
        {item.caption && <p>{item.caption}</p>}
      </div>
    </article>
  );
}

export function ProjectGallery({ slug }) {
  const [items, setItems] = useState([]);
  const [state, setState] = useState('loading');
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const loadGallery = useCallback(async () => {
    setState('loading');
    setError('');
    try {
      const data = await apiRequest('/gallery');
      setItems(Array.isArray(data) ? data : []);
      setState('ready');
    } catch (loadError) {
      setError(loadError.message);
      setState('error');
    }
  }, []);

  useEffect(() => {
    loadGallery();
  }, [loadGallery]);

  const projectItems = useMemo(
    () =>
      items.filter(
        (item) => item.project?.slug?.toLowerCase() === slug.toLowerCase(),
      ),
    [items, slug],
  );
  const project = projectItems[0]?.project;
  const totals = mediaSummary(projectItems);
  const visibleItems =
    filter === 'all'
      ? projectItems
      : projectItems.filter((item) => item.media_type === filter);

  useEffect(() => {
    if (!selectedPhoto) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setSelectedPhoto(null);
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedPhoto]);

  if (state === 'loading') {
    return (
      <main className={styles.page}>
        <section className={styles.content}>
          <LoadingState />
        </section>
      </main>
    );
  }

  if (state === 'error') {
    return (
      <main className={styles.page}>
        <section className={styles.content}>
          <GalleryLoadError message={error} onRetry={loadGallery} />
        </section>
      </main>
    );
  }

  if (!project) {
    return (
      <main className={styles.page}>
        <section className={styles.content}>
          <Link className={styles.backLink} href="/gallery">
            <ArrowLeft size={17} aria-hidden="true" /> All project galleries
          </Link>
          <div className={styles.message}>
            This project gallery is not available. It may not have any published
            stories yet.
          </div>
        </section>
      </main>
    );
  }

  const heroImage =
    project.banner_url ||
    projectItems.find((item) => item.media_type === 'photo')?.media_url ||
    projectItems.find((item) => item.thumbnail_url)?.thumbnail_url ||
    '';

  return (
    <main className={styles.page}>
      <section
        className={`${styles.hero} ${heroImage ? styles.heroWithImage : ''}`}
        style={
          heroImage
            ? {
                '--hero-image': `url("${heroImage}")`,
              }
            : undefined
        }
      >
        <div className={styles.heroInner}>
          <div className={styles.crumbs}>
            <Link href="/gallery">Gallery</Link>
            <span aria-hidden="true">/</span>
            <span>{project.title}</span>
          </div>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>
              {project.program?.name || 'Relief Nepal project'}
            </p>
            <h1>{project.title}</h1>
            <p className={styles.heroText}>
              {project.summary ||
                `Stories, photographs and field updates from ${project.title}.`}
            </p>
            <div className={styles.stats} aria-label="Collection totals">
              {totals.photo > 0 && (
                <div className={styles.stat}>
                  <strong>{totals.photo}</strong>
                  <span>photographs</span>
                </div>
              )}
              {totals.video > 0 && (
                <div className={styles.stat}>
                  <strong>{totals.video}</strong>
                  <span>videos</span>
                </div>
              )}
              {totals.audio > 0 && (
                <div className={styles.stat}>
                  <strong>{totals.audio}</strong>
                  <span>audio stories</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.content} aria-labelledby="project-stories">
        <div className={styles.detailHeading}>
          <div>
            <p className={styles.eyebrow} id="project-stories">
              Field collection
            </p>
            <h2 className={styles.sectionTitle}>Moments from the project</h2>
            <p className={styles.sectionNote}>
              A closer look at the work and the communities behind it.
            </p>
          </div>
          <Link className={styles.backLink} href="/gallery">
            <ArrowLeft size={17} aria-hidden="true" /> All project galleries
          </Link>
        </div>

        <div className={styles.filterBar} aria-label="Filter gallery items">
          {mediaFilters.map(({ value, label }) => {
            const count =
              value === 'all' ? projectItems.length : totals[value] || 0;
            return (
              <button
                aria-pressed={filter === value}
                className={styles.filterButton}
                key={value}
                onClick={() => setFilter(value)}
                type="button"
              >
                {value === 'photo' && (
                  <ImageIcon size={16} aria-hidden="true" />
                )}
                {value === 'video' && <Play size={15} aria-hidden="true" />}
                {value === 'audio' && <Music2 size={16} aria-hidden="true" />}
                {label} <span>{count}</span>
              </button>
            );
          })}
        </div>

        {visibleItems.length > 0 ? (
          <div className={styles.masonry}>
            {visibleItems.map((item, index) => (
              <MediaCard
                item={item}
                index={index}
                key={item.id}
                onOpenPhoto={setSelectedPhoto}
              />
            ))}
          </div>
        ) : (
          <div className={styles.message}>
            No {filter === 'all' ? 'published stories' : `${filter} items`} in
            this collection yet.
          </div>
        )}
      </section>

      {selectedPhoto && (
        <div
          aria-label={`Photo preview: ${selectedPhoto.title || 'Project photo'}`}
          aria-modal="true"
          className={styles.lightbox}
          role="dialog"
        >
          <button
            aria-label="Close expanded photo"
            className={styles.lightboxBackdrop}
            onClick={() => setSelectedPhoto(null)}
            type="button"
          />
          <button
            aria-label="Close photo"
            className={styles.closeButton}
            onClick={() => setSelectedPhoto(null)}
            type="button"
          >
            <X size={22} />
          </button>
          <figure className={styles.lightboxFigure}>
            <img
              src={selectedPhoto.media_url}
              alt={selectedPhoto.alt_text || selectedPhoto.title}
            />
            <figcaption>
              <strong>{selectedPhoto.title}</strong>
              {selectedPhoto.caption && ` · ${selectedPhoto.caption}`}
            </figcaption>
          </figure>
        </div>
      )}
    </main>
  );
}
