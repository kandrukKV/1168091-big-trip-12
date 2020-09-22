import {Preposition} from '../const';

const HOUR_FACTOR = 36000000;
const TRANSPORT_STATISTIC_INCREMENT = 1;

const increaseObjectProperty = (object, key, increment) => {
  return object[key] ? object[key] + increment : increment;
};

export const getMoneyStat = (events) => {

  const moneyStatistic = {};

  events.forEach((event) => {
    const key = event.type.toUpperCase();

    moneyStatistic[key] = increaseObjectProperty(moneyStatistic, key, parseInt(event.price, 10));
  });

  return {
    types: Object.keys(moneyStatistic),
    values: Object.values(moneyStatistic)
  };
};

export const getTransportStat = (events) => {
  const transportStatistic = {};

  events.forEach((event) => {
    if (event.type !== Preposition.CHECK_IN
      || event.type !== Preposition.SIGHTSEEING
      || event.type !== Preposition.RESTAURANT) {

      const key = event.type.toUpperCase();

      transportStatistic[key] = increaseObjectProperty(transportStatistic, key, TRANSPORT_STATISTIC_INCREMENT);
    }

  });
  return {
    types: Object.keys(transportStatistic),
    values: Object.values(transportStatistic)
  };
};

export const getTimeSpentStat = (events) => {
  const timeStatistic = {};

  events.forEach((event) => {
    const startTime = new Date(event.beginDate).getTime();
    const endTime = new Date(event.endDate).getTime();
    const diff = endTime - startTime;
    const key = event.type.toUpperCase();

    timeStatistic[key] = increaseObjectProperty(timeStatistic, key, diff);
  });

  for (const key in timeStatistic) {
    if (timeStatistic[key]) {
      timeStatistic[key] = (timeStatistic[key] / HOUR_FACTOR).toFixed(2);
    }
  }
  return {
    types: Object.keys(timeStatistic),
    values: Object.values(timeStatistic)
  };
};

