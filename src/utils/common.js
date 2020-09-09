import {Preposition} from '../const';

export const getPreposition = (type) => {
  return (type === Preposition.CHECK_IN || type === Preposition.SIGHTSEEING || type === Preposition.RESTAURANT) ? ` in ` : ` to `;
};

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const shuffleArray = (arr) => {
  let j;
  let temp;
  for (let i = arr.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = arr[j];
    arr[j] = arr[i];
    arr[i] = temp;
  }
  return arr;
};

export const getRandomElementOfArray = (arr) => {
  const randomIndex = getRandomInteger(0, arr.length - 1);
  return arr[randomIndex];
};

export const updateElementOfArray = (arr, newElement) => {
  const index = arr.findIndex((item) => item.id === newElement.id);

  if (index === -1) {
    return arr;
  }

  return [
    ...arr.slice(0, index),
    newElement,
    ...arr.slice(index + 1)
  ];
};

export const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

