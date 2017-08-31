
const express = require('express');
const Promise = require('bluebird');
const parser = require('./parseCsv');

const parseCsv = parser.parseCsv;
const parseWageEntries = parser.parseWageEntries;
// const getDailyHours = require('./calculateWages').getDailyHours;
const readFile = Promise.promisify(require('fs').readFile);

let app;


readFile('./data/HourList201403.csv', 'utf8')
  .then((content) => {
    const allWages = parseWageEntries(parseCsv(content, ','));
    // getDailyHours('1', allWages);

    app = express();
    app.get('/', (req, res) => {
      res.send(allWages);
    });

    app.listen(3000, () => {
      console.log('Example app listening on port 3000!');
    });
  });
