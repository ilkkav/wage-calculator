should = require('should');
const { getOvertimeWeightedHours, calculatePersonWage, unitWages } = require('../src/calculateWages');

const getWageEntries = () => (
  {
    personID: 'foo',
    dailyHours: [
      {
        date: '2017-06-06',
        hours: {
          total: 8,
          evening: 0,
        },
      },
      {
        date: '2017-06-07',
        hours: {
          total: 7,
          evening: 0,
        },
      },
    ],
  });

describe('wages and overtime', () => {
  it('calculate weighted hours with and without overtime', () => {
    getOvertimeWeightedHours(7).should.equal(7);
    getOvertimeWeightedHours(8).should.equal(8);
    getOvertimeWeightedHours(9).should.equal(8 + (1.0 * 1.25));
    getOvertimeWeightedHours(9.7).should.equal(8 + (1.7 * 1.25));
    getOvertimeWeightedHours(10.25).should.equal(8 + (2 * 1.25) + (0.25 * 1.5));
    getOvertimeWeightedHours(12).should.equal(8 + (2 * 1.25) + (2 * 1.5));
    getOvertimeWeightedHours(14).should.equal(8 + (2 * 1.25) + (2 * 1.5) + (2 * 2.0));
    getOvertimeWeightedHours(20).should.equal(8 + (2 * 1.25) + (2 * 1.5) + (8 * 2.0));
  });

  it('calculate persons wage with normal hours', () => {
    const wages = getWageEntries();
    calculatePersonWage(wages).wage.should.equal((8 + 7) * unitWages.hourly);
  });

  it('calculate persons wage with normal and evening hours', () => {
    const wages = getWageEntries();
    wages.dailyHours[0].hours.evening = 5;

    calculatePersonWage(wages).wage.should.equal((8 + 7) * unitWages.hourly + (5) * unitWages.evening);
  });

  it('calculate persons wage with normal and overtime hours and round correctly', () => {
    const wages = getWageEntries();
    wages.dailyHours[0].hours.total = 10;
    const expectedRounded = 65.63;
    calculatePersonWage(wages).wage.should.equal(expectedRounded);
  });

  it('calculate persons wage with normal, overtime and evening hours and round correctly', () => {
    const wages = getWageEntries();
    wages.dailyHours[0].hours.total = 10;
    wages.dailyHours[0].hours.evening = 5;
    const expectedRounded = 71.38;
    calculatePersonWage(wages).wage.should.equal(expectedRounded);
  });
});
