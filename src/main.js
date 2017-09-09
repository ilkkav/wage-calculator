
const express = require('express');
const Promise = require('bluebird');
const _ = require('lodash');

const { parseCsv, parseWageEntries } = require('./parseCsv');
const { accumulateHours } = require('./calculateHours');
const { calculatePersonWage, getWagePeriod } = require('./calculateWages');
const readFile = Promise.promisify(require('fs').readFile);

const formatResult = (data, monthAndYear) => {
  const result = {};
  result.headerText = `Monthly Wages ${monthAndYear}`;
  result.values = _.sortBy(data, ['personID']).map(el =>
    ({ value: `${el.personID}, ${el.personName}, ${el.wage.toFixed(2)}` }));
  return result;
};

const addName = (element, rawData) => {
  const result = _.cloneDeep(element);
  result.personName = _.find(rawData, { personID: element.personID }).personName;
  return result;
};

const getWages = () => readFile('./data/HourList201403.csv', 'utf8')
  .then((content) => {
    const wageEntries = parseWageEntries(parseCsv(content, ','));
    const allHours = wageEntries.reduce(accumulateHours, []);
    const wages = allHours.map(personData => calculatePersonWage(personData))
      .map(personData => addName(personData, wageEntries));
    return formatResult(wages, getWagePeriod(allHours));
  });

const app = express();
app.set('view engine', 'pug');

app.get('/', (req, res) => {
  getWages()
    .then((wageData) => {
      res.render('index', { title: 'wages', data: wageData });
    });
});

const port = (process.env.PORT || 3000);

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
