// Test replace directly
const str = 'board & organizational';
console.log('Original:', str);
console.log('Char codes:', [...str].map(c => c.charCodeAt(0)));

const result = str.replace(/&/g, '&');
console.log('After replace:', result);
console.log('Char codes:', [...result].map(c => c.charCodeAt(0)));