// Test replace with char code inspection
const str = 'board & organizational';
const result = str.replace(/&/g, '&');

console.log('Result string:', result);
console.log('Result char codes:', [...result].map(c => c.charCodeAt(0)));
console.log('Expected char codes for &: ', [...'&'].map(c => c.charCodeAt(0)));
console.log('Expected char codes for &:', [...'&'].map(c => c.charCodeAt(0)));