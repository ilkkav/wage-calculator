
const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);
const _ = require('lodash');

const getWeightedHours = (total, hours, maxHours, weight) => {
  const weightedHours = Math.min(hours, maxHours) * weight;
  return [total + weightedHours, (hours - maxHours)];
};

const getOvertimeWeightedHours = (hours) => {
  let [total, remaining] = getWeightedHours(0, hours, 8.0, 1.0);
  if (remaining <= 0) {
    return total;
  }
  [total, remaining] = getWeightedHours(total, remaining, 2.0, 1.25);
  if (remaining <= 0) {
    return total;
  }
  [total, remaining] = getWeightedHours(total, remaining, 2.0, 1.5);
  if (remaining <= 0) {
    return total;
  }
  return total + (remaining * 2.0);
};

const diffAsHours = (startTime, endTime) => moment.duration(endTime.diff(startTime)).asHours();

const getEveningHours = (start, end) => {
  const dayShiftStart = moment(start).hours(6);
  const dayShiftEnd = moment(start).hours(18);

  const range = moment.range(start, end);
  const dayShiftRange = moment.range(dayShiftStart, dayShiftEnd);
  const totalHours = diffAsHours(start, end);

  const dayShiftIntersect = range.intersect(dayShiftRange);
  if (!dayShiftIntersect) {
    return totalHours;
  }
  const dayShiftHours = diffAsHours(dayShiftIntersect.start, dayShiftIntersect.end);
  return totalHours - dayShiftHours;
};

const getHours = (entry) => {
  const total = diffAsHours(entry.startTime, entry.endTime);
  const evening = getEveningHours(entry.startTime, entry.endTime);
  return { total, evening };
};

const accumulateHours = (result, personID, date, hours) => {
  const person = result.find(el => el.personID === personID);
  if (!person) {
    result.push({ personID, dailyHours: [{ date, hours }] });
    return result;
  }
  const personDate = person.dailyHours.find(el => el.date === date);
  if (!personDate) {
    person.dailyHours.push({ date, hours });
    return result;
  }
  personDate.hours.total += hours.total;
  personDate.hours.evening += hours.evening;
  return result;
};

const handleEntry = (acc, curr) => {
  return accumulateHours(acc, curr.personID, curr.date, getHours(curr));
};

const calculateDailyWage = (dayEntry) => {
  const HOURLY_WAGE = 3.75;
  const EVENING_BONUS = 1.15;
  return (getOvertimeWeightedHours(dayEntry.hours.total) * HOURLY_WAGE) + (dayEntry.hours.evening * EVENING_BONUS);
};

const calculatePersonWage = (personHourEntries) => {
  const wage = personHourEntries.dailyHours.reduce(
    (acc, curr) => acc + calculateDailyWage(curr), 0);
  return { personID: personHourEntries.personID, wage };
};

const addName = (element, rawData) => {
  const result = _.cloneDeep(element);
  result.personName = _.find(rawData, {personID: element.personID}).personName;
  return result;
}

const getMonthAndYear = (wages) => moment(wages[0].dailyHours[0].date).format('MM/YYYY');

module.exports = { handleEntry,
  getOvertimeWeightedHours,
  calculatePersonWage,
  getEveningHours,
  accumulateHours ,
  addName,
  getMonthAndYear };
