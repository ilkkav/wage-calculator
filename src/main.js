
const express = require('express');
const Promise = require('bluebird');
const parser = require('./parseCsv');

const parseCsv = parser.parseCsv;
const parseWageEntries = parser.parseWageEntries;
const handleEntry = require('./calculateHours').handleEntry;
const readFile = Promise.promisify(require('fs').readFile);

let app;


readFile('./data/HourList201403.csv', 'utf8')
  .then((content) => {
    const wageEntries = parseWageEntries(parseCsv(content, ','));
    let allHours = [];
    wageEntries.forEach(el => allHours = (handleEntry(allHours, el)));
    app = express();

    app.get('/', (req, res) => {
      res.send(wageEntries);
    });

    const port = (process.env.PORT || 3000);

    app.listen(port, () => {
      console.log(`Listening on port ${port}!`);
    });
  });
