import { Router } from 'express';
import { supabase } from '../../config/supabase.js';

export const contentRoutes = Router();

async function publicList(
  res,
  next,
  table,
  columns,
  orderColumn = 'created_at',
  transform = (items) => items,
) {
  if (!supabase)
    return res.status(503).json({
      error: {
        code: 'DATA_SOURCE_UNAVAILABLE',
        message: 'Content is temporarily unavailable.',
      },
    });
  const { data, error } = await supabase
    .from(table)
    .select(columns)
    .eq('publication_status', 'published')
    .order(orderColumn, { ascending: false });
  if (error) return next(error);
  return res.json({ data: transform(data || []) });
}

const isYoutubeVideoUrl = (value) =>
  /^https:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtube-nocookie\.com\/embed\/|youtu\.be\/)[A-Za-z0-9_-]{11}(?:[?&].*)?$/i.test(
    value || '',
  );

contentRoutes.get('/programs', async (_req, res, next) => {
  if (!supabase)
    return res.status(503).json({
      error: {
        code: 'DATA_SOURCE_UNAVAILABLE',
        message: 'Programs are temporarily unavailable.',
      },
    });
  const { data, error } = await supabase
    .from('programs')
    .select('id,slug,name,description')
    .eq('publication_status', 'published')
    .order('name');
  if (error) return next(error);
  return res.json({ data: data || [] });
});
contentRoutes.get('/gallery', (req, res, next) =>
  publicList(
    res,
    next,
    'gallery_items',
    'id,title,caption,media_type,media_url,thumbnail_url,alt_text,project_id,project:projects(id,slug,title,summary,banner_url,publication_status,program:programs(name,slug)),published_at',
    'published_at',
    (items) =>
      items.filter(
        (item) =>
          item.project_id &&
          item.project &&
          (item.media_type !== 'video' || isYoutubeVideoUrl(item.media_url)),
      ),
  ),
);
const networkColumns =
  'id,name,slug,relationship_type,short_description,description,location,website_url,public_contact_email,collaboration_context,collaboration_areas,display_order,logo_url,publication_status,created_at,updated_at';

contentRoutes.get('/networks', async (_req, res, next) => {
  if (!supabase)
    return res.status(503).json({
      error: {
        code: 'DATA_SOURCE_UNAVAILABLE',
        message: 'Network information is temporarily unavailable.',
      },
    });
  const { data, error } = await supabase
    .from('network_partners')
    .select(networkColumns)
    .eq('publication_status', 'published')
    .order('display_order', { ascending: true })
    .order('name', { ascending: true });
  if (error) return next(error);
  return res.json({ data: data || [] });
});

contentRoutes.get('/networks/:slug', async (req, res, next) => {
  if (!supabase)
    return res.status(503).json({
      error: {
        code: 'DATA_SOURCE_UNAVAILABLE',
        message: 'Partner information is temporarily unavailable.',
      },
    });
  const { data, error } = await supabase
    .from('network_partners')
    .select(networkColumns)
    .eq('slug', req.params.slug)
    .eq('publication_status', 'published')
    .maybeSingle();
  if (error) return next(error);
  if (!data)
    return res.status(404).json({
      error: { code: 'PARTNER_NOT_FOUND', message: 'Partner not found.' },
    });
  return res.json({ data });
});
contentRoutes.get('/notices', (req, res, next) =>
  publicList(
    res,
    next,
    'notices',
    'id,slug,title,body,attachment_url,image_url,published_at,expires_at',
    'published_at',
  ),
);
contentRoutes.get('/notices/:slug', async (req, res, next) => {
  if (!supabase)
    return res.status(503).json({
      error: {
        code: 'DATA_SOURCE_UNAVAILABLE',
        message: 'Notice information is temporarily unavailable.',
      },
    });
  const { data, error } = await supabase
    .from('notices')
    .select(
      'id,slug,title,body,attachment_url,image_url,published_at,expires_at',
    )
    .eq('slug', req.params.slug)
    .eq('publication_status', 'published')
    .maybeSingle();
  if (error) return next(error);
  if (!data)
    return res.status(404).json({
      error: { code: 'NOTICE_NOT_FOUND', message: 'Notice not found.' },
    });
  return res.json({ data });
});

const vacancyColumns =
  'id,slug,title,job_type,job_level,location,number_of_vacancies,work_schedule,hours_per_week,duration,description,responsibilities,qualifications,benefits,application_instructions,application_email,application_url,application_deadline,published_at,created_at';

function nepalDate() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kathmandu',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .formatToParts(new Date())
    .reduce((result, part) => ({ ...result, [part.type]: part.value }), {});
  return `${parts.year}-${parts.month}-${parts.day}`;
}

contentRoutes.get('/vacancies', async (_req, res, next) => {
  if (!supabase)
    return res.status(503).json({
      error: {
        code: 'DATA_SOURCE_UNAVAILABLE',
        message: 'Vacancies are temporarily unavailable.',
      },
    });
  const today = nepalDate();
  const { data, error } = await supabase
    .from('vacancies')
    .select(vacancyColumns)
    .eq('status', 'open')
    .or(`application_deadline.is.null,application_deadline.gte.${today}`)
    .order('published_at', { ascending: false });
  if (error) return next(error);
  return res.json({ data: data || [] });
});

contentRoutes.get('/vacancies/:slug', async (req, res, next) => {
  if (!supabase)
    return res.status(503).json({
      error: {
        code: 'DATA_SOURCE_UNAVAILABLE',
        message: 'Vacancy information is temporarily unavailable.',
      },
    });
  const today = nepalDate();
  const { data, error } = await supabase
    .from('vacancies')
    .select(vacancyColumns)
    .eq('slug', req.params.slug)
    .eq('status', 'open')
    .or(`application_deadline.is.null,application_deadline.gte.${today}`)
    .maybeSingle();
  if (error) return next(error);
  if (!data)
    return res.status(404).json({
      error: { code: 'VACANCY_NOT_FOUND', message: 'Vacancy not found.' },
    });
  return res.json({ data });
});

contentRoutes.get('/board-members', async (_req, res, next) => {
  if (!supabase)
    return res.status(503).json({
      error: {
        code: 'DATA_SOURCE_UNAVAILABLE',
        message: 'Board member information is temporarily unavailable.',
      },
    });
  const { data, error } = await supabase
    .from('board_members')
    .select(
      'id,sn,name,qualification,expertise,designation,contact,email,experience,display_order',
    )
    .eq('is_active', true)
    .order('display_order', { ascending: true })
    .order('sn', { ascending: true });
  if (error) return next(error);
  return res.json({ data: data || [] });
});
