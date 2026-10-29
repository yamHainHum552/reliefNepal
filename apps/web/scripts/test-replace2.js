// Test replace with different approaches
const str = 'board & organizational';
console.log('Test 1 - regex /&/g:');
console.log(str.replace(/&/g, '&'));

console.log('\nTest 2 - regex /&/g with String():');
console.log(String(str).replace(/&/g, '&'));

console.log('\nTest 3 - split/join:');
console.log(str.split('&').join('&'));

console.log('\nTest 4 - replaceAll:');
console.log(str.replaceAll('&', '&'));