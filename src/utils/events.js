import moment from 'moment';

const MONTHS = [`JAN`, `FEB`, `MAR`, `APR`, `MAY`, `JUN`, `JUL`, `AUG`, `SEP`, `OCT`, `NOV`, `DEC`];

export const getDuration = (beginDate, endDate) => {
  const diff = moment(endDate).diff(moment(beginDate));
  const duration = moment.duration(diff);
  const day = duration.days() ? `${addZerro(duration.days())}D ` : ``;
  const hours = `${addZerro(duration.hours())}H `;
  const minutes = `${addZerro(duration.minutes())}M`;
  return `${day}${hours}${minutes}`;
};

export const getFullDate = (date) => {
  return moment(date).format(`YY/MM/DD HH:mm`);
};

export const getDateForForm = (date) => {
  return moment(date).format();
};

export const getTime = (date) => {
  return moment(date).format(`HH:mm`);
};


export const getDateDay = (dateTime) => {
  const date = new Date(dateTime);
  return `${MONTHS[date.getMonth()]} ${addZerro(date.getDate())}`;
};

export const distributeEventsByDays = (events) => {
  const tempArray = [];
  const unicDates = Array.from(new Set(events.map((item) => getDateDay(item.startTime))));
  unicDates.forEach((el)=> {
    tempArray.push(events.filter((item) => getDateDay(item.startTime) === el));
  });
  return tempArray;
};

export const addZerro = (num) => num <= 9 ? `0` + num : num;

export const sortByDate = (a, b) => {
  return a.startTime > b.startTime ? 1 : -1;
};

export const sortByTime = (a, b) => {
  const durationA = parseInt(a.endTime, 10) - parseInt(a.startTime, 10);
  const durationB = parseInt(b.endTime, 10) - parseInt(b.startTime, 10);
  return durationA > durationB ? 1 : -1;
};

export const sortByPrice = (a, b) => {
  return a.price > b.price ? 1 : -1;
};

export const upFirstSymbol = (word) => {
  return word[0].toUpperCase() + word.slice(1);
};
