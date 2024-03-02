// run `node index.js` in the terminal

console.log(`Hello Node.js v${process.versions.node}!`);

const phrases = [
  'This is a test to do something really cool',
  'but it may not be that cool',
  'we might find out, I hope we see...',
  "or else I won't be able to leave this alone",
  'until it agrees with me!',
];

const map = new Map();

phrases.forEach((phrase) => {
  const normalizedPhrase = phrase
    .toLowerCase()
    .split(' ')
    .replace(/[^\p{L}\d]/gu, '');

  const words = phrase.split(' ');

  words.forEach((word) => {
    const token = word.toLowerCase().replace(/[^\p{L}\d]/gu, '');
    map.set(token, map.has(token) ? [...map.get(token), word] : [word]);
  });
});

console.table(map);
