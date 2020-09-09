import {Preposition} from '../const';

export const getMoneyStat = (events) => {

  const data = {};

  events.forEach((event) => {
    data[event.type.toUpperCase()] = data[event.type.toUpperCase()]
      ? parseInt(data[event.type.toUpperCase()], 10) + parseInt(event.price, 10)
      : parseInt(event.price, 10);
  });

  return {
    types: Object.keys(data),
    values: Object.values(data)
  };
};

export const getTransportStat = (events) => {
  const data = {};

  events.forEach((event) => {
    if (event.type !== Preposition.CHECK_IN
      || event.type !== Preposition.SIGHTSEEING
      || event.type !== Preposition.RESTAURANT) {

      data[event.type.toUpperCase()] = data[event.type.toUpperCase()]
        ? parseInt(data[event.type.toUpperCase()], 10) + 1
        : 1;
    }

  });
  return {
    types: Object.keys(data),
    values: Object.values(data)
  };
};

export const getTimeSpentStat = (events) => {
  const data = {};
  events.forEach((event) => {
    const startTime = new Date(event.beginDate).getTime();
    const endTime = new Date(event.endDate).getTime();
    const diff = endTime - startTime;

    data[event.type.toUpperCase()] = data[event.type.toUpperCase()]
      ? data[event.type.toUpperCase()] + diff
      : diff;

  });

  for (let key in data) {
    if (data[key]) {
      data[key] = (data[key] / 36000000).toFixed(2);
    }
  }
  return {
    types: Object.keys(data),
    values: Object.values(data)
  };
};

