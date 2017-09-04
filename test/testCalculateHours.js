const should = require('should');
const { getOvertimeWeightedHours, getEveningHours, accumulateHours } = require('../src/calculateHours');

const Moment = require('moment');
const MomentRange = require('moment-range');

const moment = MomentRange.extendMoment(Moment);
const _ = require('lodash');

describe('get hours', () => {
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

  it('accumulate hours to empty collection', () => {
    const result = accumulateHours([], '1', '2017-03-03', { evening: 5, total: 6 });
    result.length.should.equal(1);
    const personDay = result[0];
    personDay.personID.should.equal('1');
    personDay.dailyHours.length.should.equal(1);
    personDay.dailyHours[0].should.deepEqual({ date: '2017-03-03', hours: { evening: 5, total: 6 } });
  });

  it('accumulate hours to existing person-date entry', () => {
    const existingHours = [
      { personID: '1',
        dailyHours: [
          {
            date: '2017-03-03', 
            hours: { evening: 6, total: 6 },
          },
        ],  
      },
    ];

    const result = accumulateHours(existingHours, '1', '2017-03-03', { evening: 5, total: 6 });
    console.log(result);
    result.length.should.equal(1);
    const person = _.find(result, { personID: '1' });
    _.find(person.dailyHours, { date: '2017-03-03' }).hours.should.deepEqual({  evening: 11, total: 12 });
  });

  it('calculates evening hours', () => {
    getEveningHours(moment('2017-08-28T03:00'), moment('2017-08-28T19:30')).should.equal(4.5);
    getEveningHours(moment('2017-08-28T07:00'), moment('2017-08-28T19:30')).should.equal(1.5);
    getEveningHours(moment('2017-08-28T06:00'), moment('2017-08-28T18:00')).should.equal(0);
    getEveningHours(moment('2017-08-28T09:00'), moment('2017-08-28T12:00')).should.equal(0);
    getEveningHours(moment('2017-08-28T17:00'), moment('2017-08-29T01:00')).should.equal(7);
    getEveningHours(moment('2017-08-28T00:00'), moment('2017-08-29T06:00')).should.equal(18);
    getEveningHours(moment('2017-08-29T00:00'), moment('2017-08-29T01:00')).should.equal(1);
  });
});
