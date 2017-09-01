const should = require('should');
const getOvertimeWeightedHours = require('../src/calculateWages').getOvertimeWeightedHours;
const Moment = require('moment');
const MomentRange = require('moment-range');

const moment = MomentRange.extendMoment(Moment);


describe('get hours', () => {

  it('calculate weighted hours with and without overtime', () => {
    getOvertimeWeightedHours(7).should.equal(7);
    getOvertimeWeightedHours(8).should.equal(8);
    getOvertimeWeightedHours(9).should.equal(8 + 1.0*1.25);
    getOvertimeWeightedHours(9.7).should.equal(8 + 1.7*1.25);
    getOvertimeWeightedHours(10.25).should.equal(8 + 2*1.25 + 0.25*1.5);
    getOvertimeWeightedHours(12).should.equal(8 + 2*1.25 + 2*1.5);
    getOvertimeWeightedHours(14).should.equal(8 + 2*1.25 + 2*1.5 + 2*2.0);
    getOvertimeWeightedHours(20).should.equal(8 + 2*1.25 + 2*1.5 + 8*2.0);
  });

  it.only('jee', () => {
    const start = moment('2017-08-31T03:00');
    const end = moment('2017-09-01T00:30');

    const dayStart = moment(start).hours(6);
    const dayEnd = moment(start).hours(18);

    const range = moment.range(start, end);
    const dayRange = moment.range(dayStart, dayEnd);
    console.log(dayRange.start);
    console.log(dayRange.end);
    console.log(range.start);
    console.log(range.end);
    const result = range.intersect(dayRange);
    console.log(result);
    console.log(result.start);
    console.log(result.end);
  });
});