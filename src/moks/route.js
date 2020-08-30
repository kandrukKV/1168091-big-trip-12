import {getRandomInteger, shuffleArray, getRandomElementOfArray} from '../utils/common';
import {addZerro} from '../utils/events';

const ROUTE_TYPES = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`, `check-in`, `sightseeing`, `restaurant`];
const CITIES = [`Irkutsk`, `Khabarovsk`, `Tomsk`, `Vladivostok`, `Ekaterinburg`, `Ufa`, `Sratov`];
const LOREM_IPSUM = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;
const ROUTE_COUNT = 20;

const OFFERS = [
  {name: `Add luggage`, price: `30`},
  {name: `Switch to comfort class`, price: `100`},
  {name: `Add meal`, price: `15`},
  {name: `Choose seats`, price: `5`},
  {name: `Travel by train`, price: `40`}
];

const MONTHS = [`JAN`, `FEB`, `MAR`, `APR`, `MAY`, `JUN`, `JUL`, `AUG`, `SEP`, `OCT`, `NOV`, `DEC`];

const createOffers = () => {
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

const getDestinations = () => {
  const destitations = [];
  CITIES.forEach((city) => {
    destitations.push({
      name: city,
      title: `${city}, ${getDescription()}`,
      photos: getPhotos()
    });
  });

  return destitations;
};

export const getOffers = () => {
  const offers = [];
  ROUTE_TYPES.forEach((type) => {
    const temp = {};
    temp.type = type;
    temp.offers = createOffers();
    offers.push(temp);
  });

  return offers;
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
  // const startTime = currentDate.getTime();
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
  };

};

const offers = getOffers();
const destitations = getDestinations();

const getRoute = () => {
  const date = getDate();
  const type = getRandomElementOfArray(ROUTE_TYPES);

  return {
    type,
    offers: offers.find((item) => item.type === type).offers,
    destination: getRandomElementOfArray(destitations),
    isFavorite: Math.random() >= 0.5,
    date,
    price: getRandomInteger(20, 200),
  };
};

export const getRoutes = () => {
  return new Array(ROUTE_COUNT).fill().map((item, index) => {
    item = getRoute();
    item.id = index;
    return item;
  });
};

export const getData = () => {
  return {
    events: getRoutes(),
    details: {
      offers,
      destitations
    }
  };
};
