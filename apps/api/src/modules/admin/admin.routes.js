import { Router } from 'express';
import { createHash, timingSafeEqual } from 'node:crypto';
import { env } from '../../config/env.js';
import { requireAdmin } from '../../middleware/require-admin.js';
import {
  deleteCloudinaryImage,
  makeUploadSignature,
  newCloudinaryImageId,
} from '../../services/cloudinary.js';

export const adminRoutes = Router();
adminRoutes.use(requireAdmin);

function normalizeImpactContent(metrics, details) {
  if (!Array.isArray(metrics) || !Array.isArray(details))
    return { error: 'Impact figures and impact details must be lists.' };
  if (metrics.length > 50 || details.length > 50)
    return { error: 'Add no more than 50 impact entries in each section.' };

  const normalizedMetrics = [];
  for (const [index, item] of metrics.entries()) {
    if (!item || typeof item !== 'object')
      return { error: `Impact figure ${index + 1} is not valid.` };
    const label = typeof item.label === 'string' ? item.label.trim() : '';
    const value =
      typeof item.value === 'string'
        ? item.value.trim()
        : String(item.value ?? '').trim();
    if (!label || !value)
      return {
        error: `Add both a result name and value for impact figure ${index + 1}.`,
      };
    if (label.length > 180 || value.length > 80)
      return {
        error: `Keep the result name under 180 characters and its value under 80 characters (figure ${index + 1}).`,
      };
    if (
      !['unverified', 'verified'].includes(
        item.verification_status || 'unverified',
      )
    )
      return {
        error: `Choose a verification status for impact figure ${index + 1}.`,
      };
    const unit = typeof item.unit === 'string' ? item.unit.trim() : '';
    const reportingPeriod =
      typeof item.reporting_period === 'string'
        ? item.reporting_period.trim()
        : '';
    const source = typeof item.source === 'string' ? item.source.trim() : '';
    if (unit.length > 60 || reportingPeriod.length > 80 || source.length > 500)
      return {
        error: `Shorten the unit, reporting period, or source for impact figure ${index + 1}.`,
      };
    normalizedMetrics.push({
      label,
      value,
      unit,
      reporting_period: reportingPeriod,
      measured_on: item.measured_on || null,
      source,
      verification_status: item.verification_status || 'unverified',
    });
  }

  const normalizedDetails = [];
  for (const [index, item] of details.entries()) {
    if (!item || typeof item !== 'object')
      return { error: `Impact detail ${index + 1} is not valid.` };
    const title = typeof item.title === 'string' ? item.title.trim() : '';
    const description =
      typeof item.description === 'string' ? item.description.trim() : '';
    if (!title || !description)
      return {
        error: `Add a heading and description for impact detail ${index + 1}.`,
      };
    if (title.length > 180 || description.length > 5000)
      return {
        error: `Keep the heading under 180 characters and description under 5,000 characters (detail ${index + 1}).`,
      };
    normalizedDetails.push({ title, description });
  }
  return { metrics: normalizedMetrics, details: normalizedDetails };
}

async function replaceProjectImpactContent(client, projectId, content) {
  return client.rpc('replace_project_impact_content', {
    p_project_id: projectId,
    p_impact_metrics: content.metrics,
    p_impact_details: content.details,
  });
}

adminRoutes.get('/me', (req, res) =>
  res.json({
    data: {
      id: req.admin.user.id,
      email: req.admin.user.email,
      ...req.admin.profile,
    },
  }),
);
adminRoutes.post('/uploads/sign', (req, res) => {
  if (!env.cloudinaryConfigured)
    return res.status(503).json({
      error: {
        code: 'UPLOADS_NOT_CONFIGURED',
        message:
          'Image uploads are not configured yet. Contact the site administrator.',
      },
    });
  const timestamp = Math.floor(Date.now() / 1000);
  const collections = {
    'gallery-photo': 'gallery',
    'notice-photo': 'notices',
    'partner-logo': 'partners',
  };
  const collection = collections[req.body?.purpose] || 'projects';
  const publicId = newCloudinaryImageId(collection);
  const signature = makeUploadSignature(publicId, timestamp);
  return res.json({
    data: {
      cloud_name: env.cloudinaryCloudName,
      api_key: env.cloudinaryApiKey,
      timestamp,
      public_id: publicId,
      signature,
    },
  });
});
adminRoutes.post('/uploads/verify', (req, res) => {
  const {
    public_id: publicId,
    version,
    signature,
    secure_url: secureUrl,
  } = req.body || {};
  if (!env.cloudinaryConfigured)
    return res.status(503).json({
      error: {
        code: 'UPLOADS_NOT_CONFIGURED',
        message:
          'Image uploads are not configured yet. Contact the site administrator.',
      },
    });
  if (
    typeof publicId !== 'string' ||
    !/^relief-nepal\/(projects|gallery|notices|partners)\//.test(publicId) ||
    !/^\d+$/.test(String(version)) ||
    typeof signature !== 'string' ||
    typeof secureUrl !== 'string'
  )
    return res.status(400).json({
      error: {
        code: 'INVALID_UPLOAD',
        message: 'Cloudinary returned an invalid image response.',
      },
    });
  const expected = createHash('sha1')
    .update(
      `public_id=${publicId}&version=${version}${env.cloudinaryApiSecret}`,
    )
    .digest('hex');
  const suppliedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  const isValidSignature =
    suppliedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(suppliedBuffer, expectedBuffer);
  const allowedPrefix = `https://res.cloudinary.com/${env.cloudinaryCloudName}/image/upload/`;
  if (!isValidSignature || !secureUrl.startsWith(allowedPrefix))
    return res.status(400).json({
      error: {
        code: 'INVALID_UPLOAD',
        message: 'Cloudinary could not verify the uploaded image.',
      },
    });
  return res.json({
    data: publicId.startsWith('relief-nepal/gallery/')
      ? { media_url: secureUrl, media_public_id: publicId }
      : publicId.startsWith('relief-nepal/notices/')
        ? { image_url: secureUrl, image_public_id: publicId }
        : publicId.startsWith('relief-nepal/partners/')
          ? { logo_url: secureUrl, logo_public_id: publicId }
        : { banner_url: secureUrl, banner_public_id: publicId },
  });
});
adminRoutes.get('/programs', async (req, res, next) => {
  const { data, error } = await req.admin.client
    .from('programs')
    .select('id,slug,name,description,publication_status,created_at,updated_at')
    .order('name');
  if (error) return next(error);
  return res.json({ data: data || [] });
});
adminRoutes.get('/projects', async (req, res, next) => {
  const { data, error } = await req.admin.client
    .from('projects')
    .select(
      'id, slug, title, summary, location, donor, period, total_budget, theme, background, status, publication_status, starts_on, ends_on, banner_url, banner_public_id, program_id, program:programs(id,name,slug), impact_metrics:project_impact_metrics(id,label,value,unit,reporting_period,measured_on,source,verification_status,display_order), impact_details:project_impact_details(id,title,description,display_order), created_at',
    )
    .order('updated_at', { ascending: false });
  if (error) return next(error);
  res.json({ data: data || [] });
});
adminRoutes.post('/projects', async (req, res, next) => {
  const {
    slug,
    title,
    summary,
    location,
    donor,
    period,
    total_budget,
    theme,
    background,
    impact_metrics = [],
    impact_details = [],
    status = 'planned',
    publication_status = 'draft',
    starts_on = null,
    ends_on = null,
    banner_url = null,
    banner_public_id = null,
    program_id = null,
  } = req.body || {};
  const impactContent = normalizeImpactContent(impact_metrics, impact_details);
  if (impactContent.error)
    return res.status(400).json({
      error: { code: 'INVALID_IMPACT_CONTENT', message: impactContent.error },
    });
  if (
    !slug ||
    !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) ||
    !title?.trim() ||
    !['planned', 'ongoing', 'completed'].includes(status) ||
    !['draft', 'published', 'archived'].includes(publication_status)
  )
    return res.status(400).json({
      error: {
        code: 'INVALID_PROJECT',
        message:
          'Provide a valid title, URL slug, project status, and publication status.',
      },
    });
  if (
    (banner_url === null) !== (banner_public_id === null) ||
    (banner_public_id &&
      (typeof banner_public_id !== 'string' ||
        !banner_public_id.startsWith('relief-nepal/projects/'))) ||
    (banner_url &&
      (typeof banner_url !== 'string' ||
        !env.cloudinaryConfigured ||
        !banner_url.startsWith(
          `https://res.cloudinary.com/${env.cloudinaryCloudName}/image/upload/`,
        )))
  )
    return res.status(400).json({
      error: {
        code: 'INVALID_BANNER',
        message: 'Upload a project banner through Cloudinary before saving.',
      },
    });
  const { data, error } = await req.admin.client
    .from('projects')
    .insert({
      slug,
      title: title.trim(),
      summary: summary?.trim() || null,
      location: location?.trim() || null,
      donor: donor?.trim() || null,
      period: period?.trim() || null,
      total_budget: total_budget?.trim() || null,
      theme: theme?.trim() || null,
      background: background?.trim() || null,
      status,
      publication_status,
      starts_on: starts_on || null,
      ends_on: ends_on || null,
      banner_url,
      banner_public_id,
      program_id: program_id || null,
    })
    .select()
    .single();
  if (error) return next(error);
  const { error: impactError } = await replaceProjectImpactContent(
    req.admin.client,
    data.id,
    impactContent,
  );
  if (impactError) {
    await req.admin.client.from('projects').delete().eq('id', data.id);
    if (data.banner_public_id)
      await deleteCloudinaryImage(data.banner_public_id);
    return next(impactError);
  }
  res.status(201).json({ data });
});
adminRoutes.patch('/projects/:id', async (req, res, next) => {
  const body = req.body || {};
  const hasImpactContent =
    Object.hasOwn(body, 'impact_metrics') ||
    Object.hasOwn(body, 'impact_details');
  const impactContent = hasImpactContent
    ? normalizeImpactContent(body.impact_metrics, body.impact_details)
    : null;
  if (impactContent?.error)
    return res.status(400).json({
      error: { code: 'INVALID_IMPACT_CONTENT', message: impactContent.error },
    });
  const allowed = [
    'slug',
    'title',
    'summary',
    'location',
    'donor',
    'period',
    'total_budget',
    'theme',
    'background',
    'status',
    'publication_status',
    'starts_on',
    'ends_on',
    'banner_url',
    'banner_public_id',
    'program_id',
  ];
  const updates = Object.fromEntries(
    Object.entries(body).filter(([key]) => allowed.includes(key)),
  );
  if (updates.slug && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(updates.slug))
    return res.status(400).json({
      error: {
        code: 'INVALID_SLUG',
        message:
          'Use lowercase letters, numbers, and single hyphens in the URL slug.',
      },
    });
  if (
    'banner_url' in updates !== 'banner_public_id' in updates ||
    (updates.banner_public_id &&
      (typeof updates.banner_public_id !== 'string' ||
        !updates.banner_public_id.startsWith('relief-nepal/projects/'))) ||
    (updates.banner_url &&
      (typeof updates.banner_url !== 'string' ||
        !env.cloudinaryConfigured ||
        !updates.banner_url.startsWith(
          `https://res.cloudinary.com/${env.cloudinaryCloudName}/image/upload/`,
        )))
  )
    return res.status(400).json({
      error: {
        code: 'INVALID_BANNER',
        message: 'Upload a project banner through Cloudinary before saving.',
      },
    });
  if (!Object.keys(updates).length && !hasImpactContent)
    return res.status(400).json({
      error: {
        code: 'EMPTY_UPDATE',
        message: 'Change at least one project field.',
      },
    });
  const { data: prior, error: priorError } = await req.admin.client
    .from('projects')
    .select('id,banner_public_id')
    .eq('id', req.params.id)
    .maybeSingle();
  if (priorError) return next(priorError);
  if (!prior)
    return res
      .status(404)
      .json({ error: { code: 'NOT_FOUND', message: 'Project not found.' } });
  let data = prior;
  if (Object.keys(updates).length) {
    const result = await req.admin.client
      .from('projects')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .maybeSingle();
    if (result.error) return next(result.error);
    if (!result.data)
      return res
        .status(404)
        .json({ error: { code: 'NOT_FOUND', message: 'Project not found.' } });
    data = result.data;
  }
  if (hasImpactContent) {
    const { error: impactError } = await replaceProjectImpactContent(
      req.admin.client,
      req.params.id,
      impactContent,
    );
    if (impactError) return next(impactError);
  }
  if (
    prior?.banner_public_id &&
    prior.banner_public_id !== data.banner_public_id
  )
    await deleteCloudinaryImage(prior.banner_public_id);
  res.json({ data });
});
adminRoutes.delete('/projects/:id', async (req, res, next) => {
  const { data: project, error: readError } = await req.admin.client
    .from('projects')
    .select('banner_public_id')
    .eq('id', req.params.id)
    .maybeSingle();
  if (readError) return next(readError);
  const { error } = await req.admin.client
    .from('projects')
    .delete()
    .eq('id', req.params.id);
  if (error?.code === '23503')
    return res.status(409).json({
      error: {
        code: 'PROJECT_HAS_GALLERY',
        message:
          'Delete or move this project’s gallery items before deleting the project.',
      },
    });
  if (error) return next(error);
  if (project?.banner_public_id)
    await deleteCloudinaryImage(project.banner_public_id);
  res.status(204).end();
});
adminRoutes.get('/newsletter', async (req, res, next) => {
  const { data, error } = await req.admin.client
    .from('newsletter_subscriptions')
    .select('id,email,consented_at,created_at')
    .order('created_at', { ascending: false })
    .limit(500);
  if (error) return next(error);
  res.json({ data: data || [] });
});

function registerEditorCollection(
  path,
  table,
  columns,
  fields,
  validate,
  options = {},
) {
  const statusField = options.statusField || 'publication_status';
  const publishedValue = options.publishedValue || 'published';
  const transform = options.transform || ((_field, value) => value);
  adminRoutes.get(`/${path}`, async (req, res, next) => {
    const { data, error } = await req.admin.client
      .from(table)
      .select(columns)
      .order('created_at', { ascending: false });
    if (error) return next(error);
    return res.json({ data: data || [] });
  });
  adminRoutes.post(`/${path}`, async (req, res, next) => {
    const input = req.body || {};
    const invalid = validate(input);
    if (invalid)
      return res
        .status(400)
        .json({ error: { code: 'INVALID_CONTENT', message: invalid } });
    const record = Object.fromEntries(
      fields
        .filter((field) => field in input)
        .map((field) => [field, transform(field, input[field])]),
    );
    if (
      statusField in record &&
      record[statusField] === publishedValue &&
      'published_at' in fields &&
      !record.published_at
    )
      record.published_at = new Date().toISOString();
    const { data, error } = await req.admin.client
      .from(table)
      .insert(record)
      .select(columns)
      .single();
    if (error?.code === '23505' && table === 'network_partners')
      return res.status(409).json({
        error: {
          code: 'DUPLICATE_PARTNER_SLUG',
          message: 'That partner profile URL is already in use. Choose another slug.',
        },
      });
    if (error) return next(error);
    return res.status(201).json({ data });
  });
  adminRoutes.patch(`/${path}/:id`, async (req, res, next) => {
    const input = req.body || {};
    const invalid = validate(input, true);
    if (invalid)
      return res
        .status(400)
        .json({ error: { code: 'INVALID_CONTENT', message: invalid } });
    if (table === 'gallery_items' && !('project_id' in input)) {
      const { data: current, error: currentError } = await req.admin.client
        .from(table)
        .select('project_id')
        .eq('id', req.params.id)
        .maybeSingle();
      if (currentError) return next(currentError);
      if (!current)
        return res.status(404).json({
          error: { code: 'NOT_FOUND', message: 'Gallery item not found.' },
        });
      if (!current.project_id)
        return res.status(400).json({
          error: {
            code: 'PROJECT_REQUIRED',
            message:
              'Assign this gallery item to a project before updating it.',
          },
        });
    }
    const updates = Object.fromEntries(
      fields
        .filter((field) => field in input)
        .map((field) => [field, transform(field, input[field])]),
    );
    if (
      statusField in updates &&
      updates[statusField] === publishedValue &&
      'published_at' in fields &&
      !updates.published_at
    )
      updates.published_at = new Date().toISOString();
    if (!Object.keys(updates).length)
      return res.status(400).json({
        error: {
          code: 'EMPTY_UPDATE',
          message: 'Change at least one field.',
        },
      });
    const mediaIdField = {
      gallery_items: 'media_public_id',
      notices: 'image_public_id',
      network_partners: 'logo_public_id',
    }[table];
    const { data: prior, error: priorError } =
      mediaIdField
        ? await req.admin.client
            .from(table)
            .select(mediaIdField)
            .eq('id', req.params.id)
            .maybeSingle()
        : { data: null, error: null };
    if (priorError) return next(priorError);
    const { data, error } = await req.admin.client
      .from(table)
      .update(updates)
      .eq('id', req.params.id)
      .select(columns)
      .maybeSingle();
    if (error?.code === '23505' && table === 'network_partners')
      return res.status(409).json({
        error: {
          code: 'DUPLICATE_PARTNER_SLUG',
          message: 'That partner profile URL is already in use. Choose another slug.',
        },
      });
    if (error) return next(error);
    if (!data)
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'Content item not found.' },
      });
    if (mediaIdField && prior?.[mediaIdField] &&
        prior[mediaIdField] !== data[mediaIdField])
      await deleteCloudinaryImage(prior[mediaIdField]);
    return res.json({ data });
  });
  adminRoutes.delete(`/${path}/:id`, async (req, res, next) => {
    const mediaIdField = {
      gallery_items: 'media_public_id',
      notices: 'image_public_id',
      network_partners: 'logo_public_id',
    }[table];
    const { data: prior, error: priorError } =
      mediaIdField
        ? await req.admin.client
            .from(table)
            .select(mediaIdField)
            .eq('id', req.params.id)
            .maybeSingle()
        : { data: null, error: null };
    if (priorError) return next(priorError);
    const { error } = await req.admin.client
      .from(table)
      .delete()
      .eq('id', req.params.id);
    if (error) return next(error);
    if (mediaIdField && prior?.[mediaIdField])
      await deleteCloudinaryImage(prior[mediaIdField]);
    return res.status(204).end();
  });
}

const publicationStatusIsValid = (value) =>
  ['draft', 'published', 'archived'].includes(value);
registerEditorCollection(
  'gallery',
  'gallery_items',
  'id,title,caption,media_type,media_url,media_public_id,thumbnail_url,alt_text,project_id,project:projects(id,slug,title,summary,banner_url,publication_status,program:programs(name,slug)),publication_status,published_at,created_at',
  [
    'title',
    'caption',
    'media_type',
    'media_url',
    'media_public_id',
    'project_id',
    'thumbnail_url',
    'alt_text',
    'publication_status',
    'published_at',
  ],
  (item, patch = false) => {
    if (
      (!patch || 'title' in item) &&
      (typeof item.title !== 'string' || item.title.trim().length < 2)
    )
      return 'Enter a title with at least two characters.';
    if (
      (!patch || 'media_url' in item) &&
      !/^https:\/\//i.test(item.media_url || '')
    )
      return 'Media URL must start with https://.';
    if (
      (!patch || 'media_type' in item) &&
      !['photo', 'video', 'audio'].includes(item.media_type)
    )
      return 'Choose photo, video, or audio.';
    if (
      (!patch || 'project_id' in item) &&
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        item.project_id || '',
      )
    )
      return 'Choose an existing project for this gallery item.';
    if (
      item.media_type === 'video' &&
      'media_url' in item &&
      !/^https:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtube-nocookie\.com\/embed\/|youtu\.be\/)[A-Za-z0-9_-]{11}(?:[?&].*)?$/i.test(
        item.media_url,
      )
    )
      return 'Video gallery items must use a valid YouTube video link.';
    if (
      item.media_public_id &&
      (typeof item.media_public_id !== 'string' ||
        !item.media_public_id.startsWith('relief-nepal/gallery/') ||
        !item.media_url?.startsWith(
          `https://res.cloudinary.com/${env.cloudinaryCloudName}/image/upload/`,
        ))
    )
      return 'Use a verified Cloudinary upload for uploaded gallery photos.';
    if (
      'publication_status' in item &&
      !publicationStatusIsValid(item.publication_status)
    )
      return 'Choose draft, published, or archived.';
    return null;
  },
  {
    transform: (field, value) =>
      field === 'project_id' ? value || null : value,
  },
);
registerEditorCollection(
  'networks',
  'network_partners',
  'id,name,slug,relationship_type,short_description,description,location,website_url,public_contact_email,collaboration_context,collaboration_areas,display_order,logo_url,logo_public_id,publication_status,created_at,updated_at',
  [
    'name',
    'slug',
    'relationship_type',
    'short_description',
    'description',
    'location',
    'website_url',
    'public_contact_email',
    'collaboration_context',
    'collaboration_areas',
    'display_order',
    'logo_url',
    'logo_public_id',
    'publication_status',
  ],
  (item, patch = false) => {
    if (
      (!patch || 'name' in item) &&
      (typeof item.name !== 'string' ||
        item.name.trim().length < 2 ||
        item.name.trim().length > 180)
    )
      return 'Enter an organization name between 2 and 180 characters.';
    if (
      (!patch || 'slug' in item) &&
      (typeof item.slug !== 'string' ||
        item.slug.length > 120 ||
        !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(item.slug))
    )
      return 'Use a profile slug up to 120 characters with lowercase letters, numbers, and single hyphens.';
    if (
      (!patch || 'relationship_type' in item) &&
      !['local_district', 'resource_provider'].includes(
        item.relationship_type,
      )
    )
      return 'Choose a network type.';
    if (
      (!patch || 'short_description' in item) &&
      (typeof item.short_description !== 'string' ||
        item.short_description.trim().length < 10 ||
        item.short_description.trim().length > 280)
    )
      return 'Add a short description between 10 and 280 characters.';
    if (
      (!patch || 'description' in item) &&
      (typeof item.description !== 'string' ||
        !item.description.trim() ||
        item.description.trim().length > 20000)
    )
      return 'Add a full partner description under 20,000 characters.';
    if (
      'website_url' in item && item.website_url &&
      !/^https?:\/\//i.test(item.website_url.trim())
    )
      return 'Enter a website address beginning with https://.';
    if (
      'public_contact_email' in item && item.public_contact_email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item.public_contact_email.trim())
    )
      return 'Enter a valid public contact email address.';
    if (
      'display_order' in item &&
      (!Number.isInteger(Number(item.display_order)) || Number(item.display_order) < 0)
    )
      return 'Display order must be a zero or positive whole number.';
    if (
      'logo_public_id' in item && item.logo_public_id &&
      (typeof item.logo_public_id !== 'string' ||
        !item.logo_public_id.startsWith('relief-nepal/partners/') ||
        !item.logo_url?.startsWith(
          `https://res.cloudinary.com/${env.cloudinaryCloudName}/image/upload/`,
        ))
    )
      return 'Upload the logo through the secure image upload field.';
    if (
      'logo_url' in item && item.logo_url &&
      !/^https?:\/\//i.test(item.logo_url)
    )
      return 'Enter a valid logo URL or upload the logo.';
    if (
      'publication_status' in item &&
      !publicationStatusIsValid(item.publication_status)
    )
      return 'Choose draft, published, or archived.';
    return null;
  },
  {
    transform: (field, value) => {
      if (['website_url', 'public_contact_email', 'location', 'collaboration_context', 'collaboration_areas'].includes(field))
        return typeof value === 'string' && value.trim() ? value.trim() : null;
      if (field === 'logo_url' || field === 'logo_public_id')
        return typeof value === 'string' && value.trim() ? value.trim() : null;
      if (field === 'display_order') return Number(value || 0);
      return value;
    },
  },
);
registerEditorCollection(
  'notices',
  'notices',
  'id,slug,title,summary,body,attachment_url,image_url,image_public_id,publication_status,published_at,expires_at,created_at',
  [
    'slug',
    'title',
    'body',
    'attachment_url',
    'image_url',
    'image_public_id',
    'publication_status',
    'published_at',
    'expires_at',
  ],
  (item, patch = false) => {
    if (
      (!patch || 'slug' in item) &&
      !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(item.slug || '')
    )
      return 'Use a lowercase URL slug with single hyphens.';
    if (
      (!patch || 'title' in item) &&
      (typeof item.title !== 'string' || item.title.trim().length < 2)
    )
      return 'Enter a notice title with at least two characters.';
    if ('image_url' in item !== 'image_public_id' in item)
      return 'Upload or remove the notice photo before saving.';
    if (
      item.image_public_id &&
      (typeof item.image_public_id !== 'string' ||
        !item.image_public_id.startsWith('relief-nepal/notices/') ||
        !item.image_url?.startsWith(
          `https://res.cloudinary.com/${env.cloudinaryCloudName}/image/upload/`,
        ))
    )
      return 'Upload the notice photo through Cloudinary.';
    if (
      'publication_status' in item &&
      !publicationStatusIsValid(item.publication_status)
    )
      return 'Choose draft, published, or archived.';
    return null;
  },
);

const vacancyTypes = [
  'full-time',
  'part-time',
  'contract',
  'internship',
  'consultancy',
  'temporary',
];
const vacancyLevels = [
  'entry',
  'junior',
  'mid',
  'senior',
  'lead',
  'manager',
  'director',
  'other',
];
registerEditorCollection(
  'vacancies',
  'vacancies',
  'id,slug,title,job_type,job_level,location,number_of_vacancies,work_schedule,hours_per_week,duration,description,responsibilities,qualifications,benefits,application_instructions,application_email,application_url,application_deadline,status,published_at,created_at,updated_at',
  [
    'slug',
    'title',
    'job_type',
    'job_level',
    'location',
    'number_of_vacancies',
    'work_schedule',
    'hours_per_week',
    'duration',
    'description',
    'responsibilities',
    'qualifications',
    'benefits',
    'application_instructions',
    'application_email',
    'application_url',
    'application_deadline',
    'status',
    'published_at',
  ],
  (item, patch = false) => {
    if (
      (!patch || 'slug' in item) &&
      !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(item.slug || '')
    )
      return 'Use a lowercase URL slug with single hyphens.';
    if (
      (!patch || 'title' in item) &&
      (typeof item.title !== 'string' || item.title.trim().length < 2)
    )
      return 'Enter a job title with at least two characters.';
    if ('job_type' in item && !vacancyTypes.includes(item.job_type))
      return 'Choose a valid job type.';
    if ('job_level' in item && !vacancyLevels.includes(item.job_level))
      return 'Choose a valid job level.';
    if (
      (!patch || 'location' in item) &&
      (typeof item.location !== 'string' || !item.location.trim())
    )
      return 'Enter the job location.';
    if (
      'number_of_vacancies' in item &&
      (!Number.isInteger(Number(item.number_of_vacancies)) ||
        Number(item.number_of_vacancies) < 1)
    )
      return 'Number of vacancies must be a positive whole number.';
    if (
      'hours_per_week' in item &&
      item.hours_per_week !== '' &&
      item.hours_per_week !== null &&
      (!Number.isFinite(Number(item.hours_per_week)) ||
        Number(item.hours_per_week) < 0)
    )
      return 'Weekly hours must be zero or a positive number.';
    if (
      (!patch || 'description' in item) &&
      (typeof item.description !== 'string' ||
        item.description.trim().length < 10)
    )
      return 'Add a job description with at least 10 characters.';
    if (
      (!patch || 'qualifications' in item) &&
      (typeof item.qualifications !== 'string' || !item.qualifications.trim())
    )
      return 'Add the required qualifications for applicants.';
    if (
      'application_email' in item &&
      item.application_email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item.application_email)
    )
      return 'Enter a valid application email address.';
    if (
      'application_url' in item &&
      item.application_url &&
      !/^https:\/\//i.test(item.application_url)
    )
      return 'Application URL must start with https://.';
    if (
      'status' in item &&
      !['draft', 'open', 'closed', 'archived'].includes(item.status)
    )
      return 'Choose draft, open, closed, or archived.';
    if (
      'status' in item &&
      item.status === 'open' &&
      !item.application_email &&
      !item.application_url
    )
      return 'Add an application email or URL before opening this vacancy.';
    return null;
  },
  { statusField: 'status', publishedValue: 'open' },
);

// Board Members - custom implementation for specific fields
function validateBoardMember(input, patch = false) {
  if (
    (!patch || 'sn' in input) &&
    (!Number.isInteger(Number(input.sn)) || Number(input.sn) < 1)
  )
    return 'Serial number must be a positive whole number.';
  if (
    (!patch || 'name' in input) &&
    (typeof input.name !== 'string' || input.name.trim().length < 2)
  )
    return 'Enter a name with at least two characters.';
  if (
    (!patch || 'qualification' in input) &&
    (typeof input.qualification !== 'string' ||
      input.qualification.trim().length < 1)
  )
    return 'Enter a qualification.';
  if (
    (!patch || 'expertise' in input) &&
    (typeof input.expertise !== 'string' || input.expertise.trim().length < 1)
  )
    return 'Enter sectoral expertise.';
  if (
    (!patch || 'designation' in input) &&
    (typeof input.designation !== 'string' ||
      input.designation.trim().length < 1)
  )
    return 'Enter a designation.';
  if (
    (!patch || 'contact' in input) &&
    (typeof input.contact !== 'string' || input.contact.trim().length < 10)
  )
    return 'Enter a valid contact number.';
  if (
    (!patch || 'email' in input) &&
    (typeof input.email !== 'string' ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email))
  )
    return 'Enter a valid email address.';
  if (
    (!patch || 'experience' in input) &&
    (!Number.isInteger(Number(input.experience)) ||
      Number(input.experience) < 0)
  )
    return 'Experience must be a non-negative whole number.';
  if ('is_active' in input) {
    const val = input.is_active;
    if (typeof val === 'string') {
      if (!['true', 'false'].includes(val))
        return 'Active status must be true or false.';
    } else if (typeof val !== 'boolean') {
      return 'Active status must be true or false.';
    }
  }
  return null;
}

registerEditorCollection(
  'board-members',
  'board_members',
  'id,sn,name,qualification,expertise,designation,contact,email,experience,display_order,is_active,created_at,updated_at',
  [
    'sn',
    'name',
    'qualification',
    'expertise',
    'designation',
    'contact',
    'email',
    'experience',
    'display_order',
    'is_active',
  ],
  validateBoardMember,
  {
    statusField: 'is_active',
    publishedValue: true,
    transform: (field, value) => {
      if (value === '' || value === null || value === undefined) return null;
      if (['sn', 'experience', 'display_order'].includes(field)) {
        return Number(value);
      }
      if (field === 'is_active') {
        if (typeof value === 'string') return value === 'true';
        return Boolean(value);
      }
      return value;
    },
  },
);

// Programs - admin CRUD for program areas
function validateProgram(input, patch = false) {
  if (
    (!patch || 'slug' in input) &&
    (!input.slug || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(input.slug))
  )
    return 'Use a lowercase URL slug with single hyphens.';
  if (
    (!patch || 'name' in input) &&
    (typeof input.name !== 'string' || input.name.trim().length < 2)
  )
    return 'Enter a program name with at least two characters.';
  if ('description' in input && typeof input.description !== 'string')
    return 'Description must be text.';
  if (
    'publication_status' in input &&
    !['draft', 'published', 'archived'].includes(input.publication_status)
  )
    return 'Choose draft, published, or archived.';
  return null;
}

registerEditorCollection(
  'programs',
  'programs',
  'id,slug,name,description,publication_status,created_at,updated_at',
  ['slug', 'name', 'description', 'publication_status'],
  validateProgram,
);
