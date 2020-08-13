import {getPreposition} from '../utils';

const OFFERS_COUNT = 3;

const getOffers = (offers) => {
  const offersLength = Math.min(offers.length, OFFERS_COUNT);

  return offers.slice(0, offersLength).map((item) => {
    return (
      `<li class="event__offer">
        <span class="event__offer-title">${item.name}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${item.price}</span>
      </li>`
    );
  }).join(``);

};


export const createEventTemplate = (route) => {

  const {type, city, price, offers, date} = route;

  return (`
    <div class="event">
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${getPreposition(type)} ${city}</h3>

      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="2019-03-18T10:30">${date.start.hours}:${date.start.minutes}</time>
          &mdash;
          <time class="event__end-time" datetime="2019-03-18T11:00">${date.end.hours}:${date.end.minutes}</time>
        </p>
        <p class="event__duration">${date.duration}</p>
      </div>

      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${price}</span>
      </p>

      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${getOffers(offers)}
      </ul>

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  `);
};
