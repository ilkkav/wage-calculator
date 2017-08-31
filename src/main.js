
const Promise = require('bluebird');
const parser = require('./parseCsv');
const parseCsv = parser.parseCsv;
const parseWageEntries = parser.parseWageEntries;
const getDailyHours = require('./calculateWages').getDailyHours;
var readFile = Promise.promisify(require("fs").readFile);

readFile("./data/HourList201403.csv", "utf8")
  .then(content => {
    const allWages = parseWageEntries(parseCsv(content, ','));
    getDailyHours('1', allWages);
  });