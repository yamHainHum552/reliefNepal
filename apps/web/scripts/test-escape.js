function escapeXml(str) {
  return str
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, '&apos;');
}

const subtitle = 'Vision, mission, board & organizational structure — Established 2008, Sindhuli, Nepal';
console.log(escapeXml(subtitle));