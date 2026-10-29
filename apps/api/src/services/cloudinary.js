import { createHash, randomUUID } from 'node:crypto';
import { env } from '../config/env.js';

export function makeUploadSignature(publicId, timestamp) {
  return createHash('sha1')
    .update(
      `public_id=${publicId}&timestamp=${timestamp}${env.cloudinaryApiSecret}`,
    )
    .digest('hex');
}

export async function deleteCloudinaryImage(publicId) {
  if (
    !env.cloudinaryConfigured ||
    !/^relief-nepal\/(projects|gallery|notices|partners)\//.test(publicId || '')
  )
    return;
  const params = {
    invalidate: 'true',
    public_id: publicId,
    timestamp: String(Math.floor(Date.now() / 1000)),
  };
  const toSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&');
  const signature = createHash('sha1')
    .update(`${toSign}${env.cloudinaryApiSecret}`)
    .digest('hex');
  const body = new URLSearchParams({
    ...params,
    api_key: env.cloudinaryApiKey,
    signature,
  });
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${env.cloudinaryCloudName}/image/destroy`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      },
    );
    const result = await response.json();
    if (!response.ok || !['ok', 'not found'].includes(result.result))
      console.warn('Cloudinary project banner cleanup failed', {
        result: result.result,
        status: response.status,
      });
  } catch (error) {
    console.warn('Cloudinary project banner cleanup failed', {
      message: error.message,
    });
  }
}

export function newCloudinaryImageId(collection = 'projects') {
  if (!['projects', 'gallery', 'notices', 'partners'].includes(collection))
    throw new Error('Invalid Cloudinary collection');
  return `relief-nepal/${collection}/${randomUUID()}`;
}
