function escapeXml(str) {
  const result = str
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, '&apos;');
  return result;
}

const subtitle = 'Vision, mission, board & organizational structure — Established 2008, Sindhuli, Nepal';
const escaped = escapeXml(subtitle);
console.log('Original:', subtitle);
console.log('Escaped:', escaped);
console.log('Contains &:', escaped.includes('&'));
console.log('Char codes:', [...escaped].map(c => c.charCodeAt(0)));