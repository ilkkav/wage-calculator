const moment = require('moment');

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

const getMonthAndYear = (wages) => moment(wages[0].dailyHours[0].date).format('MM/YYYY');

module.exports = { getMonthAndYear, calculatePersonWage, getOvertimeWeightedHours };