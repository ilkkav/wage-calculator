
const express = require('express');
const Promise = require('bluebird');
const parser = require('./parseCsv');

const parseCsv = parser.parseCsv;
const parseWageEntries = parser.parseWageEntries;
const getDailyHours = require('./calculateHours').getDailyHours;
const readFile = Promise.promisify(require('fs').readFile);

let app;


readFile('./data/HourList201403.csv', 'utf8')
  .then((content) => {
    const allWages = parseWageEntries(parseCsv(content, ','));
    const hoursPerDay = getDailyHours('1', allWages);

    app = express();

    app.get('/', (req, res) => {
      res.send(hoursPerDay);
    });

    const port = (process.env.PORT || 3000);

    app.listen(port, () => {
      console.log(`Listening on port ${port}!`);
    });
  });
