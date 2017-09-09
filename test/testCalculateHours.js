should = require('should');
const { getEveningHours, accumulateHours } = require('../src/calculateHours');

const Moment = require('moment');
const MomentRange = require('moment-range');

const moment = MomentRange.extendMoment(Moment);
const _ = require('lodash');

describe('get hours', () => {
  const newEntry = {
    personID: '1',
    date: '2017-03-03',
    startTime: moment('2017-03-03T04:00'),
    endTime: moment('2017-03-03T15:30'),
  };

  it('accumulate hours to empty collection', () => {
    const result = accumulateHours([], newEntry);
    result.length.should.equal(1);
    const personDay = result[0];
    personDay.personID.should.equal('1');
    personDay.dailyHours.length.should.equal(1);
    personDay.dailyHours[0].should.deepEqual({ date: '2017-03-03', hours: { evening: 2.00, total: 11.5 } });
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

    const result = accumulateHours(existingHours, newEntry);
    result.length.should.equal(1);
    const person = _.find(result, { personID: '1' });
    _.find(person.dailyHours, { date: '2017-03-03' }).hours.should.deepEqual({ evening: 8, total: 17.5 });
  });

  it('create new day for existing person', () => {
    const existingHours = [
      { personID: '1',
        dailyHours: [
          {
            date: '2017-03-02',
            hours: { evening: 6, total: 6 },
          },
        ],
      },
    ];

    const result = accumulateHours(existingHours, newEntry);
    result.length.should.equal(1);
    const person = _.find(result, { personID: '1' });
    person.dailyHours.length.should.equal(2);
    _.find(person.dailyHours, { date: '2017-03-02' }).hours.should.deepEqual({ evening: 6, total: 6 });
    _.find(person.dailyHours, { date: '2017-03-03' }).hours.should.deepEqual({ evening: 2, total: 11.5 });
  });

  it('calculate evening hours', () => {
    getEveningHours(moment('2017-08-28T03:00'), moment('2017-08-28T19:30')).should.equal(4.50);
    getEveningHours(moment('2017-08-28T07:00'), moment('2017-08-28T19:15')).should.equal(1.25);
    getEveningHours(moment('2017-08-28T07:00'), moment('2017-08-28T19:10')).should.equal(1.17);
    getEveningHours(moment('2017-08-28T06:00'), moment('2017-08-28T18:00')).should.equal(0);
    getEveningHours(moment('2017-08-28T09:00'), moment('2017-08-28T12:00')).should.equal(0);
    getEveningHours(moment('2017-08-28T17:00'), moment('2017-08-29T01:00')).should.equal(7);
    getEveningHours(moment('2017-08-28T00:00'), moment('2017-08-29T06:00')).should.equal(18);
    getEveningHours(moment('2017-08-29T00:45'), moment('2017-08-29T01:00')).should.equal(0.25);
    getEveningHours(moment('2017-08-28T08:00'), moment('2017-08-28T19:00')).should.equal(1);
  });
});
