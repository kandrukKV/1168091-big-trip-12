import {getRandomInteger, shuffleArray, getRandomElementOfArray} from '../utils/common';

const ROUTE_TYPES = [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`, `Check-in`, `Sightseeing`, `Restaurant`];
const SITIES = [`Irkutsk`, `Khabarovsk`, `Tomsk`, `Vladivostok`, `Ekaterinburg`, `Ufa`, `Sratov`];
const LOREM_IPSUM = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;
const ROUTE_COUNT = 20;

const OFFERS = [
  {type: `luggage`, name: `Add luggage`, price: `30`, isChecked: true},
  {type: `comfort`, name: `Switch to comfort class`, price: `100`, isChecked: true},
  {type: `meal`, name: `Add meal`, price: `15`, isChecked: true},
  {type: `seats`, name: `Choose seats`, price: `5`, isChecked: true},
  {type: `train`, name: `Travel by train`, price: `40`, isChecked: true}
];

const MONTHS = [`JAN`, `FEB`, `MAR`, `APR`, `MAY`, `JUN`, `JUL`, `AUG`, `SEP`, `OCT`, `NOV`, `DEC`];

const getOffers = () => {
  const offers = shuffleArray(OFFERS);
  const numberOfOffers = getRandomInteger(0, offers.length);
  return offers.slice(0, numberOfOffers);
};

const getDescription = () => {
  let arr = LOREM_IPSUM.split(`. `);
  arr = arr.map((item, index) => index === arr.length - 1 ? `${item.trim()}` : `${item.trim()}.`);
  return shuffleArray(arr).slice(0, 5).join(` `);
};

const getPhotos = () => {
  const photos = [];
  for (let i = 0; i < getRandomInteger(0, 5); i++) {
    photos.push(`http://picsum.photos/248/152?r=${Math.random()}`);
  }
  return photos;
};

const addZerro = (num) => num <= 9 ? `0` + num : num;

const transformDuration = (time) => {
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

const getDate = () => {
  const currentDate = new Date();

  const year = currentDate.getFullYear().toString().substr(-2);

  let day = currentDate.getDate();

  if (Math.random() > 0.5) {
    day++;
    currentDate.setDate(day);
  }

  day = addZerro(currentDate.getDate());
  const month = addZerro(currentDate.getMonth() + 1);
  currentDate.setHours(getRandomInteger(0, 23), getRandomInteger(0, 59));
  let hours = addZerro(currentDate.getHours());
  let minutes = addZerro(currentDate.getMinutes());
  const startTime = currentDate.getTime();
  const dayDate = `${MONTHS[currentDate.getMonth()]} ${day}`;

  const start = {
    year,
    day,
    month,
    hours,
    minutes,
    date: `${year}/${month}/${day} ${hours}:${minutes}`,
    time: currentDate.getTime()
  };

  day = addZerro(currentDate.getDate(currentDate.setDate(currentDate.getDate() + getRandomInteger(0, 1))));
  minutes = addZerro(currentDate.getMinutes(currentDate.setMinutes(currentDate.getMinutes() + getRandomInteger(30, 120))));
  hours = addZerro(currentDate.getHours());

  const end = {
    year,
    day,
    hours,
    minutes,
    date: `${year}/${month}/${day} ${hours}:${minutes}`,
    time: currentDate.getTime()
  };

  return {
    dayDate,
    start,
    end,
    duration: transformDuration(currentDate.getTime() - startTime)
  };

};

const getDestination = () => {
  if (Math.random() >= 0.7) {
    return null;
  } else {
    return {
      description: getDescription(),
      photos: getPhotos()
    };
  }
};

const getRoute = () => {
  const date = getDate();

  return {
    type: getRandomElementOfArray(ROUTE_TYPES),
    city: getRandomElementOfArray(SITIES),
    offers: getOffers(),
    destination: getDestination(),
    isFavorite: Math.random() >= 0.5,
    date,
    price: getRandomInteger(20, 200),
  };
};

export const getRoutes = () => {
  const routes = new Array(ROUTE_COUNT).fill().map((item, index) => {
    item = getRoute();
    item.id = `route-${index}`;
    return item;
  });

  routes.sort((a, b) => a.date.start.time > b.date.start.time ? 1 : -1);

  const unicDates = Array.from(new Set(routes.map((item) => item.date.dayDate)));

  const tempArray = [];

  unicDates.forEach((el)=> {
    tempArray.push(routes.filter((item) => item.date.dayDate === el));
  });

  return tempArray;
};


