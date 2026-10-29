function escapeXml(str) {
  console.log('Input:', str);
  const result = str
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, '&apos;');
  console.log('Output:', result);
  return result;
}

const subtitle = 'Vision, mission, board & organizational structure — Established 2008, Sindhuli, Nepal';
escapeXml(subtitle);