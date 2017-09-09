
const Moment = require('moment');
const MomentRange = require('moment-range');

const moment = MomentRange.extendMoment(Moment);
const _ = require('lodash');

const diffAsHours = (startTime, endTime) => moment.duration(endTime.diff(startTime)).asHours();

const getEveningHours = (start, end) => {
  const dayShiftStart = moment(start).hours(6).minutes(0);
  const dayShiftEnd = moment(start).hours(18).minutes(0);

  const range = moment.range(start, end);
  const dayShiftRange = moment.range(dayShiftStart, dayShiftEnd);
  const totalHours = diffAsHours(start, end);

  const dayShiftIntersect = range.intersect(dayShiftRange);
  if (!dayShiftIntersect) {
    return totalHours;
  }
  const dayShiftHours = diffAsHours(dayShiftIntersect.start, dayShiftIntersect.end);
  return parseFloat((totalHours - dayShiftHours).toFixed(2));
};

const getHours = (entry) => {
  const total = diffAsHours(entry.startTime, entry.endTime);
  const evening = getEveningHours(entry.startTime, entry.endTime);
  return { total, evening };
};

const doAccumulateHours = (result, personID, date, hours) => {
  const person = _.find(result, { personID });
  if (!person) {
    result.push({ personID, dailyHours: [{ date, hours }] });
    return result;
  }
  const personDate = _.find(person.dailyHours, { date });
  if (!personDate) {
    person.dailyHours.push({ date, hours });
    return result;
  }
  personDate.hours.total += hours.total;
  personDate.hours.evening += hours.evening;
  return result;
};

const accumulateHours = (acc, curr) => doAccumulateHours(acc, curr.personID, curr.date, getHours(curr));

module.exports = {
  getEveningHours,
  accumulateHours,
};
