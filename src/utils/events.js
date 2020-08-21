export const distributeEventsByDays = (events) => {
  const tempArray = [];
  const unicDates = Array.from(new Set(events.map((item) => item.date.dayDate)));
  unicDates.forEach((el)=> {
    tempArray.push(events.filter((item) => item.date.dayDate === el));
  });
  return tempArray;
};

export const transformDuration = (time) => {
  const minutes = Math.floor((time / 1000 / 60) % 60);
  const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
  const days = Math.floor((time / (1000 * 60 * 60 * 24)));
  let duration = ``;

  if (days) {
    duration += `${addZerro(days)}D `;
  }
  if (hours) {
    duration += `${addZerro(hours)}H `;
  }
  if (minutes) {
    duration += `${addZerro(minutes)}M`;
  }

  return duration;
};

export const addZerro = (num) => num <= 9 ? `0` + num : num;

export const sortByDate = (a, b) => {
  return a.date.start.time > b.date.start.time ? 1 : -1;
};

export const sortByTime = (a, b) => {
  const durationA = parseInt(a.date.end.time, 10) - parseInt(a.date.start.time, 10);
  const durationB = parseInt(b.date.end.time, 10) - parseInt(b.date.start.time, 10);
  return durationA > durationB ? 1 : -1;
};

export const sortByPrice = (a, b) => {
  return a.price > b.price ? 1 : -1;
};
