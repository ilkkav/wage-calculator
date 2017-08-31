const should = require('should');
const Promise = require('bluebird');
const moment = require('moment');
const readFile = Promise.promisify(require('fs').readFile);

const parser = require('../src/parseCsv');

const parseCsv = parser.parseCsv;
const parseWageEntries = parser.parseWageEntries;

describe('parse csv', () => {
  let fileContent;

  before(() => readFile('./data/HourList201403.csv', 'utf8')
    .then((content) => {
      fileContent = content;
    }));

  describe('parse valid csv content', () => {
    it('should parse all rows', () => {
      parseCsv(fileContent, ',').length.should.equal(68);
    });

    it('should parse raw csv to JSON without header row and with correct properties', () => {
      const result = parseWageEntries(parseCsv(fileContent));
      result.length.should.equal(67);
      return result.forEach(element => element.should.have.properties(['personName', 'personID', 'startTime', 'endTime', 'date']));
    });

    it('correctly parses a wage entry', () => {
      const result = parseWageEntries(['Person Name,Person ID,Date,Start,End', 'Janet Java,1,11.3.2014,9:00,17:30']);
      return result[0].should.deepEqual({ personName: 'Janet Java', personID: '1', date: '2014-03-11', startTime: moment('11.3.2014-9:00', 'DD.MM.YYYY-HH:mm'), endTime: moment('11.3.2014-17:30', 'DD.MM.YYYY-HH:mm') });
    });

    it('correctly parses entry that passes midnight', () => {
      const result = parseWageEntries(['Person Name,Person ID,Date,Start,End', 'Janet Java,1,11.3.2014,9:00,3:30']);
      const ref = { personName: 'Janet Java', personID: '1', date: '2014-03-11', startTime: moment('11.3.2014-9:00', 'DD.MM.YYYY-HH:mm'), endTime: moment('12.3.2014-3:30', 'DD.MM.YYYY-HH:mm') };
      result[0].date.should.equal('2014-03-11');
      result[0].startTime.toString().should.equal(moment('11.3.2014-9:00', 'DD.MM.YYYY-HH:mm').toString());
      result[0].endTime.toString().should.equal(moment('12.3.2014-3:30', 'DD.MM.YYYY-HH:mm').toString());
    });
  });
});
