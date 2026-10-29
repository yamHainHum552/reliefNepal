#!/usr/bin/env node
/**
 * Generate favicon and Open Graph images from logo.jpg
 * Run with: node scripts/generate-images.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputLogo = path.join(__dirname, '../public/images/logo.jpg');
const iconsDir = path.join(__dirname, '../public/icons');
const imagesDir = path.join(__dirname, '../public/images');

// Ensure directories exist
fs.mkdirSync(iconsDir, { recursive: true });
fs.mkdirSync(imagesDir, { recursive: true });

async function generateFavicons() {
  console.log('Generating favicon files...');

  // Favicon.ico (32x32)
  await sharp(inputLogo)
    .resize(32, 32, { fit: 'cover', position: 'center' })
    .toFile(path.join(iconsDir, 'favicon.ico'));

  // Favicon 16x16
  await sharp(inputLogo)
    .resize(16, 16, { fit: 'cover', position: 'center' })
    .toFile(path.join(iconsDir, 'favicon-16x16.png'));

  // Favicon 32x32
  await sharp(inputLogo)
    .resize(32, 32, { fit: 'cover', position: 'center' })
    .toFile(path.join(iconsDir, 'favicon-32x32.png'));

  // Apple touch icon 180x180
  await sharp(inputLogo)
    .resize(180, 180, { fit: 'cover', position: 'center' })
    .toFile(path.join(iconsDir, 'apple-touch-icon.png'));

  // Android icons
  await sharp(inputLogo)
    .resize(192, 192, { fit: 'cover', position: 'center' })
    .toFile(path.join(iconsDir, 'android-chrome-192x192.png'));

  await sharp(inputLogo)
    .resize(512, 512, { fit: 'cover', position: 'center' })
    .toFile(path.join(iconsDir, 'android-chrome-512x512.png'));

  console.log('Favicon files generated!');
}

async function generateOgImages() {
  console.log('Generating Open Graph images...');

  // Create a base template for OG images (1200x630)
  const ogWidth = 1200;
  const ogHeight = 630;

  // Colors
  const primaryGreen = '#087943';
  const darkGreen = '#065f35';
  const white = '#ffffff';

  // Load and resize logo once (140x140 for OG images)
  const logoBuffer = await sharp(inputLogo)
    .resize(140, 140, { fit: 'cover', position: 'center' })
    .png()
    .toBuffer();

  // Helper to create SVG text overlay
  function createTextSvg({ title, subtitle }) {
    // Escape XML entities
    const escapeXml = (str) => str
      .replace(/&/g, '&amp;')  // &
      .replace(/</g, '&lt;')       // <
      .replace(/>/g, '&gt;')       // >
      .replace(/"/g, '&quot;') // "
      .replace(/'/g, '&apos;'); // &apos;

    const safeTitle = escapeXml(title);
    const safeSubtitle = escapeXml(subtitle);

    return `<svg width="${ogWidth}" height="${ogHeight}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${primaryGreen};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${darkGreen};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${ogWidth}" height="${ogHeight}" fill="url(#bgGradient)"/>
      <!-- Subtle pattern -->
      <g opacity="0.05">
        <defs>
          <pattern id="pattern" width="60" height="60" patternUnits="userSpaceOnUse">
            <circle cx="30" cy="30" r="1" fill="${white}"/>
          </pattern>
        </defs>
        <rect x="0" y="0" width="${ogWidth}" height="${ogHeight}" fill="url(#pattern)"/>
      </g>

      <!-- Title -->
      <text
        x="${ogWidth / 2}"
        y="220"
        font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        font-size="52"
        font-weight="700"
        fill="${white}"
        text-anchor="middle"
        dominant-baseline="middle"
      >${safeTitle}</text>

      <!-- Subtitle -->
      <text
        x="${ogWidth / 2}"
        y="300"
        font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        font-size="26"
        font-weight="400"
        fill="${white}"
        text-anchor="middle"
        dominant-baseline="middle"
        opacity="0.9"
      >${safeSubtitle}</text>

      <!-- Bottom tagline -->
      <text
        x="${ogWidth / 2}"
        y="550"
        font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        font-size="20"
        font-weight="500"
        fill="${white}"
        text-anchor="middle"
        dominant-baseline="middle"
        opacity="0.7"
      >reliefnepal.org.np</text>
    </svg>`;
  }

  // Generate OG images for each page
  const pages = [
    {
      filename: 'og-default.jpg',
      title: 'Relief Nepal',
      subtitle: 'Community, dignity, hope — Building self-reliant, equitable communities across Nepal'
    },
    {
      filename: 'og-home.jpg',
      title: 'Relief Nepal',
      subtitle: 'Community, dignity, hope — Non-profit organization working across Nepal since 2008'
    },
    {
      filename: 'og-about.jpg',
      title: 'About Relief Nepal',
      subtitle: 'Vision, mission, board & organizational structure — Established 2008, Sindhuli, Nepal'
    },
    {
      filename: 'og-projects.jpg',
      title: 'Our Projects',
      subtitle: 'Explore humanitarian and development projects across Nepal — Child protection, health, education, WASH, livelihoods'
    },
    {
      filename: 'og-network.jpg',
      title: 'Our Network',
      subtitle: 'Partners and collaborators working together for change across Nepal'
    },
    {
      filename: 'og-get-involved.jpg',
      title: 'Get Involved',
      subtitle: 'Become a member, volunteer, donate, or partner with Relief Nepal'
    },
    {
      filename: 'og-impact.jpg',
      title: 'Our Impact',
      subtitle: 'Measuring change across communities — 15,000+ people served annually'
    },
    {
      filename: 'og-contact.jpg',
      title: 'Contact Relief Nepal',
      subtitle: 'Get in touch — Kamalamai Municipality-6, Sindhuli, Nepal | info@reliefnepal.org.np'
    },
    {
      filename: 'og-programs.jpg',
      title: 'Our Programs',
      subtitle: 'Five core sectors: Child Protection, Health & Education, Disaster & Climate, WASH, Livelihoods'
    },
    {
      filename: 'og-notice.jpg',
      title: 'Notices & Announcements',
      subtitle: 'Latest updates, tenders, vacancies and organizational announcements'
    },
    {
      filename: 'og-vacancies.jpg',
      title: 'Careers & Vacancies',
      subtitle: 'Join our team — Current job openings and career opportunities at Relief Nepal'
    },
    {
      filename: 'og-transparency.jpg',
      title: 'Transparency & Accountability',
      subtitle: 'Financial reports, audits, governance documents and compliance information'
    },
    {
      filename: 'og-stories.jpg',
      title: 'Stories of Change',
      subtitle: 'Real stories from communities we serve across Nepal'
    },
    {
      filename: 'og-gallery.jpg',
      title: 'Photo Gallery',
      subtitle: 'Images from our projects, events and community activities across Nepal'
    },
  ];

  for (const page of pages) {
    // Create SVG text overlay
    const textSvg = createTextSvg({
      title: page.title,
      subtitle: page.subtitle
    });

    // Convert SVG to buffer
    const textBuffer = await sharp(Buffer.from(textSvg))
      .png()
      .toBuffer();

    // Composite logo onto text background
    await sharp(textBuffer)
      .composite([
        {
          input: logoBuffer,
          top: 60,
          left: (ogWidth - 140) / 2,
        }
      ])
      .jpeg({ quality: 90 })
      .toFile(path.join(imagesDir, page.filename));

    console.log(`Generated ${page.filename}`);
  }

  console.log('All Open Graph images generated!');
}

async function generateManifest() {
  console.log('Generating site.webmanifest...');

  const manifest = {
    name: 'Relief Nepal',
    short_name: 'Relief Nepal',
    description: 'A non-profit organization dedicated to improving the well-being of underserved children, families, and communities across Nepal through community-led development.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f7f8f5',
    theme_color: '#087943',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icons/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable'
      },
      {
        src: '/icons/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable'
      }
    ],
    categories: ['non-profit', 'humanitarian', 'community'],
    lang: 'en',
    dir: 'ltr'
  };

  fs.writeFileSync(
    path.join(__dirname, '../public/site.webmanifest'),
    JSON.stringify(manifest, null, 2)
  );

  console.log('site.webmanifest generated!');
}

async function main() {
  try {
    await generateFavicons();
    await generateOgImages();
    await generateManifest();
    console.log('\n✅ All images and manifest generated successfully!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();