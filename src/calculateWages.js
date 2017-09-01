
const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);


const getWeightedHours = (total, hours, maxHours, weight) => {
  total += Math.min(hours, maxHours) * weight;
  return [total, (hours-maxHours)];
}

const getOvertimeWeightedHours = (hours) => {
  let [ total, remaining ] = getWeightedHours(0, hours, 8.0, 1.0);
  if (remaining <= 0) {
    return total;
  }
  [ total, remaining ] = getWeightedHours(total, remaining, 2.0, 1.25);
  if (remaining <= 0) {
    return total;
  }
  [ total, remaining ] = getWeightedHours(total, remaining, 2.0, 1.5);
  if (remaining <= 0) {
    return total;
  }
  return total + remaining * 2.0;
}

const addOrCreate = (hoursPerDate, hours, date) => {
  const dayEntry = hoursPerDate.find(el => el.date === date);
  if (!dayEntry) {
    hoursPerDate.push({ date, totalHours: hours } );
    return hoursPerDate;
  }
  dayEntry.totalHours += hours;
  return hoursPerDate;
}


const getDailyTotalHours = (entries) => {
  let hoursPerDate = [];
  entries.forEach(entry => {
    const hours = moment.duration(entry.endTime.diff(entry.startTime)).asHours();
    hoursPerDate = addOrCreate(hoursPerDate, hours, entry.date);
  });
  return hoursPerDate;
};

const getDailyHours = (personID, wages) => {
  const totalDailyHours = getDailyTotalHours(wages.filter(element => element.personID === personID));
  const allHours = totalDailyHours.map(dayEntry => {
    return Object.assign(dayEntry, { weighted: getOvertimeWeightedHours(dayEntry.totalHours) });
  });
  return { personID, hours: allHours };
}

module.exports = { getOvertimeWeightedHours, getDailyHours };