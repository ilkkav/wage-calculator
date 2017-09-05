
const express = require('express');
const Promise = require('bluebird');
const parser = require('./parseCsv');
const _ = require('lodash');

const { parseCsv, parseWageEntries } = require('./parseCsv');
const { handleEntry, calculatePersonWage, addName, getMonthAndYear } = require('./calculateHours');
const readFile = Promise.promisify(require('fs').readFile);

let app;

const formatResult = (data, monthAndYear) => {
  return data.reduce(
    (acc, curr) => (acc + `${curr.personID}, ${curr.personName}, $${curr.wage}\n`),
    `Monthly Wages ${monthAndYear}\n`
  );
}

readFile('./data/HourList201403.csv', 'utf8')
  .then((content) => {
    const wageEntries = parseWageEntries(parseCsv(content, ','));
    const allHours = wageEntries.reduce(handleEntry, []);
    const wages = allHours.map(personData => calculatePersonWage(personData))
      .map(personData => addName(personData, wageEntries));
    console.log(formatResult(wages, getMonthAndYear(allHours)));

    app = express();
    app.set('view engine', 'pug');

    app.get('/', (req, res) => {
      res.render('index', { title: 'wages', message: formatResult(wages, getMonthAndYear(allHours)) })
    });

    const port = (process.env.PORT || 3000);

    app.listen(port, () => {
      console.log(`Listening on port ${port}!`);
    });
  });
