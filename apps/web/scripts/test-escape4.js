// Use explicit character codes
function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')  // &
    .replace(/</g, '&lt;')       // <
    .replace(/>/g, '&gt;')       // >
    .replace(/"/g, '&quot;') // "
    .replace(/'/g, '&apos;'); // &apos;
}

const subtitle = 'Vision, mission, board & organizational structure — Established 2008, Sindhuli, Nepal';
const escaped = escapeXml(subtitle);
console.log('Original:', subtitle);
console.log('Escaped:', escaped);
console.log('Char codes:', [...escaped].map(c => c.charCodeAt(0)));