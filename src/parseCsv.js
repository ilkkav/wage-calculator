const moment = require('moment');

const getColumnNames = (headerRow, delimiter) => headerRow.split(delimiter);

// 3.3.2014, {8:30 or 08:30}
const toDateTime = (date, time) => moment(`${date}-${time}`, 'DD.MM.YYYY-HH:mm');

const getStartAndEndTime = (entry) => {
  const startTime = toDateTime(entry.date, entry.start);
  let endTime = toDateTime(entry.date, entry.end);
  if (endTime.isBefore(startTime)) {
    endTime = endTime.add(1, 'days');
  }

  return [startTime, endTime];
};

const mapWageEntry = (entry) => {
  const [startTime, endTime] = getStartAndEndTime(entry);
  return Object.assign({}, {
    personName: entry.personName,
    personID: entry.personID,
    date: moment(entry.date, 'DD.MM.YYYY').format('YYYY-MM-DD'),
    startTime,
    endTime,
  });
};

const toJsonName = (name) => {
  const trimmed = name.replace(' ', '');
  return trimmed.charAt(0).toLowerCase() + trimmed.slice(1);
};

const parseRow = (row, columnNames) => {
  const rawData = {};
  const rowValues = row.split(',');
  columnNames.forEach((name, index) => {
    rawData[toJsonName(name)] = rowValues[index];
  });
  return mapWageEntry(rawData);
};

const parseWageEntries = (rawData) => {
  const columnNames = getColumnNames(rawData[0], ',');
  return rawData.slice(1).map(row => parseRow(row, columnNames));
};

const parseCsv = (content) => {
  const rows = content.split('\n');
  return rows.filter(row => row.trim());
};

module.exports = { parseCsv, parseWageEntries };

