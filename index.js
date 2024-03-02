// run `node index.js` in the terminal

console.log(`Hello Node.js v${process.versions.node}!`);

const map = new Map();

const csv = require('csv-parser')
const fs = require('fs')

const processRow = (row) => {
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

const mapResults = () => {
  const data = Array.from(map).map(([tokenOrTag, matches]) => ({
    tokenOrTag,
    frequency: matches.length,
    matches
  }));
  data.sort((a, b) => b.frequency - a.frequency);
  return data;
}

const processRow2 = (row) => {
  const { Title, Tags } = row;
  const dataItem = { id: row["﻿ID"], title: Title };
  const words = Title.split(' ');
  words.forEach((word) => {
    const token = word.toLowerCase().replace(/[^\p{L}\d]/gu, '');
    if (!token) return;
    map.set(token, map.has(token) ? Array.from(new Set([...map.get(token), dataItem])) : [dataItem]);
  });
  Tags?.split("; ").filter(s => s).forEach((tag) => {
    const token = tag.toLowerCase().replace(/[^:\s\p{L}\d]/gu, '');
    if (!token) return;
    map.set(token, map.has(token) ? Array.from(new Set([...map.get(token), dataItem])) : [dataItem]);
  })
}

const transform = (dataItems) => {
  const innerMap = new Map();
  dataItems.forEach((item) => {
    item.matches.forEach((match) => {
      const key = JSON.stringify(match);
      innerMap.set(key, innerMap.has(key) ? Array.from(new Set([...innerMap.get(key), item.tokenOrTag])) : [item.tokenOrTag]);
    });
  });
  return innerMap;
}

function toCSV(innerMap = new Map()) {
  const headers = ["ID", "Tag"].join(",");
  const rows = [];
  innerMap.forEach((value, key) => {
    const tokens = value
      .filter((s) => )
    const rowDatas = value.map((v) => [key, v].join(","));
    rows.push(...rowDatas);
  })
  const csv = [
    headers,
    ...rows,
  ].join("\n");
  return csv;
}

fs.createReadStream('data.csv')
  .pipe(csv())
  .on('data', (data) => processRow2(data))
  .on('end', () => {
    const results = transform(mapResults());
    const innerMap = new Map();
    results.forEach((value, key) => {
      const obj = JSON.parse(key);
      innerMap.set(obj.id, innerMap.has(obj.id) ? Array.from(new Set([...innerMap.get(obj.id), value])) : value);
    });
    console.table(innerMap);
    fs.writeFile('output.csv', toCSV(innerMap), 'utf8', function (err) {
      if (err) {
        console.log('Some error occured - file either not saved or corrupted file saved.');
      } else {
        console.log('It\'s saved!');
      }
    });
  });