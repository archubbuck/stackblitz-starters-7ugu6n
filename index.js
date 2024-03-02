// run `node index.js` in the terminal

console.log(`Hello Node.js v${process.versions.node}!`);

const map = new Map();

const csv = require('csv-parser')
const fs = require('fs')

const processRow = (row) => {
  console.log(JSON.stringify(row, null, 4));
  const { ID, Title, Tags } = row;
  const words = Title.split(' ');
  words.forEach((word) => {
    const token = word.toLowerCase().replace(/[^\p{L}\d]/gu, '');
    if (!token) return;
    map.set(token, map.has(token) ? Array.from(new Set([...map.get(token), Title])) : [Title]);
  });
  Tags?.split("; ").filter(s => s).forEach((tag) => {
    const token = tag.toLowerCase().replace(/[^:\s\p{L}\d]/gu, '');
    if (!token) return;
    map.set(token, map.has(token) ? Array.from(new Set([...map.get(token), Title])) : [Title]);
  })
}

const logResults = () => {
  const data = Array.from(map).map(([tokenOrTag, matches]) => ({
    tokenOrTag,
    frequency: matches.length,
  }));
  data.sort((a, b) => b.frequency - a.frequency);
  console.table(data);
}

fs.createReadStream('data.csv')
  .pipe(csv())
  .on('data', (data) => processRow(data))
  .on('end', () => logResults());