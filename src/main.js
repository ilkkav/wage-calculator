
const express = require('express');
const Promise = require('bluebird');
const parser = require('./parseCsv');

const parseCsv = parser.parseCsv;
const parseWageEntries = parser.parseWageEntries;
const handleEntry = require('./calculateHours').handleEntry;
const calculatePersonWage = require('./calculateHours').calculatePersonWage;
const readFile = Promise.promisify(require('fs').readFile);

let app;


readFile('./data/HourList201403.csv', 'utf8')
  .then((content) => {
    const wageEntries = parseWageEntries(parseCsv(content, ','));
    const allHours = wageEntries.reduce(handleEntry, []);
    const wages = allHours.map(personData => calculatePersonWage(personData));
    console.log(wages);

    app = express();

    app.get('/', (req, res) => {
      res.send(wages);
    });

    const port = (process.env.PORT || 3000);

    app.listen(port, () => {
      console.log(`Listening on port ${port}!`);
    });
  });
