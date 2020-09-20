import moment from 'moment';
import {Preposition} from '../const';

const MONTHS = [`JAN`, `FEB`, `MAR`, `APR`, `MAY`, `JUN`, `JUL`, `AUG`, `SEP`, `OCT`, `NOV`, `DEC`];

export const getDuration = (beginDate, endDate) => {
  const diff = moment(endDate).diff(moment(beginDate));
  const duration = moment.duration(diff);
  const day = duration.days() ? `${addZerro(duration.days())}D ` : ``;
  const hours = `${addZerro(duration.hours())}H `;
  const minutes = `${addZerro(duration.minutes())}M`;
  return `${day}${hours}${minutes}`;
};

export const getPreposition = (type) => {
  return (type === Preposition.CHECK_IN || type === Preposition.SIGHTSEEING || type === Preposition.RESTAURANT) ? ` in ` : ` to `;
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
  const unicDates = Array.from(new Set(events.map((item) => getDateDay(item.beginDate))));
  unicDates.forEach((el)=> {
    tempArray.push(events.filter((item) => getDateDay(item.beginDate) === el));
  });
  return tempArray;
};

export const addZerro = (num) => num <= 9 ? `0` + num : num;

const getUnixTime = (date) => {
  return Date.parse(date);
};

export const sortByDate = (a, b) => {
  return parseInt(getUnixTime(a.beginDate), 10) > parseInt(getUnixTime(b.beginDate), 10) ? 1 : -1;
};

export const sortByTime = (a, b) => {
  const diffA = moment(a.endDate).diff(moment(a.beginDate));
  const diffB = moment(b.endDate).diff(moment(b.beginDate));
  return diffA > diffB ? 1 : -1;
};

export const sortByPrice = (a, b) => {
  return parseInt(a.price, 10) > parseInt(b.price, 10) ? 1 : -1;
};

export const upFirstSymbol = (word) => {
  return word[0].toUpperCase() + word.slice(1);
};
