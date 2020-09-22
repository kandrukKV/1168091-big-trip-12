import moment from 'moment';
import {Preposition} from '../const';

const MONTHS = [`JAN`, `FEB`, `MAR`, `APR`, `MAY`, `JUN`, `JUL`, `AUG`, `SEP`, `OCT`, `NOV`, `DEC`];

export const getDuration = (beginDate, endDate) => {
  const diff = moment(endDate).diff(moment(beginDate));
  const duration = moment.duration(diff);
  const day = duration.days() ? `${addZero(duration.days())}D ` : ``;
  const hours = `${addZero(duration.hours())}H `;
  const minutes = `${addZero(duration.minutes())}M`;
  return `${day}${hours}${minutes}`;
};

export const getPreposition = (type) => (type === Preposition.CHECK_IN || type === Preposition.SIGHTSEEING || type === Preposition.RESTAURANT) ? ` in ` : ` to `;


export const getFullDate = (date) => moment(date).format(`YY/MM/DD HH:mm`);


export const getDateForForm = (date) => moment(date).format();

export const getTime = (date) => moment(date).format(`HH:mm`);


export const getDateDay = (dateTime) => {
  const date = new Date(dateTime);
  return `${MONTHS[date.getMonth()]} ${addZero(date.getDate())}`;
};

export const distributeEventsByDays = (events) => {
  const tempArray = [];
  const unicDates = Array.from(new Set(events.map((item) => getDateDay(item.beginDate))));
  unicDates.forEach((el)=> {
    tempArray.push(events.filter((item) => getDateDay(item.beginDate) === el));
  });
  return tempArray;
};

const addZero = (num) => num <= 9 ? `0` + num : num;

const getUnixTime = (date) => Date.parse(date);

export const sortByDate = (a, b) => parseInt(getUnixTime(a.beginDate), 10) > parseInt(getUnixTime(b.beginDate), 10) ? 1 : -1;

export const sortByTime = (a, b) => {
  const diffA = moment(a.endDate).diff(moment(a.beginDate));
  const diffB = moment(b.endDate).diff(moment(b.beginDate));
  return diffA > diffB ? 1 : -1;
};

export const sortByPrice = (a, b) => parseInt(a.price, 10) > parseInt(b.price, 10) ? 1 : -1;

export const upFirstSymbol = (word) => word[0].toUpperCase() + word.slice(1);
