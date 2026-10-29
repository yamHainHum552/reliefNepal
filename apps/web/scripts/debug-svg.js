const sharp = require('sharp');
const fs = require('fs');

const ogWidth = 1200;
const ogHeight = 630;
const primaryGreen = '#087943';
const darkGreen = '#065f35';
const white = '#ffffff';

function createTextSvg({ title, subtitle }) {
  const escapeXml = (str) => str
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, '&apos;');

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

// Test with the about page subtitle
const svg = createTextSvg({
  title: 'About Relief Nepal',
  subtitle: 'Vision, mission, board & organizational structure — Established 2008, Sindhuli, Nepal'
});

console.log('SVG length:', svg.length);
console.log('First 500 chars:', svg.substring(0, 500));
console.log('---');
console.log('Chars around 42*100:', svg.substring(4000, 4500));

// Write to file for inspection
fs.writeFileSync('test.svg', svg);
console.log('Written to test.svg');

// Try to process with sharp
async function test() {
  try {
    const buf = await sharp(Buffer.from(svg)).png().toBuffer();
    console.log('Success! Buffer length:', buf.length);
  } catch (e) {
    console.error('Error:', e.message);
  }
}

test();