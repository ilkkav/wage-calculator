const Promise = require('bluebird');
const moment = require('moment');
var readFile = Promise.promisify(require("fs").readFile);

const getColumnNames = (headerRow, delimiter) => headerRow.split(delimiter);

// 3.3.2014, (8:30 or 08:30)
const toDateTime = (date, time) => moment(`${date}-${time}`, 'DD.MM.YYYY-HH:mm');

const mapWageEntry = (entry) => {
  const result = Object.assign({}, { personName: entry.personName, personID: entry.personID, date: moment(entry.date, 'DD.MM.YYYY').format('YYYY-MM-DD') });
  result.startTime = toDateTime(entry.date, entry.start);
  result.endTime = toDateTime(entry.date, entry.end);
  return result;
};

const toJsonName = (name) => {
  const trimmed = name.replace(' ', '');
  return trimmed.charAt(0).toLowerCase() + trimmed.slice(1);
}

const parseRow = (row, columnNames) => {
  const rawData = {};
  const rowValues = row.split(',');
  columnNames.forEach((name, index) => {
    rawData[toJsonName(name)] = rowValues[index];
  });
  return mapWageEntry(rawData);
};

const parseCsv = (content, delimiter) => {
  const rows = content.split('\n');
  const columnNames = getColumnNames(rows[0], delimiter);
  return rows.slice(1, rows.length - 1).map(row => parseRow(row, columnNames));
};

module.exports = { parseCsv };

