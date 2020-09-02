import AbstractView from './abstract';
import {getPreposition} from '../utils/common';
import {getDuration, upFirstSymbol, getTime, getDateForForm} from '../utils/events';

const OFFERS_COUNT = 3;

const getOffersTemplate = (offers) => {
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

const createEventTemplate = (route) => {

  const {type, price, offers, destination, beginDate, endDate} = route;

  // const duration = transformDuration(parseInt(endTime, 10) - parseInt(startTime, 10));
  const duration = getDuration(beginDate, endDate);

  return (
    `<div class="event">
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${upFirstSymbol(type)} ${getPreposition(type)} ${destination.name}</h3>

      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${getDateForForm(beginDate)}">${getTime(beginDate)}</time>
          &mdash;
          <time class="event__end-time" datetime="${getDateForForm(endDate)}">${getTime(endDate)}</time>
        </p>
        <p class="event__duration">${duration}</p>
      </div>

      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${price}</span>
      </p>

      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${getOffersTemplate(offers)}
      </ul>

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>`
  );
};

export default class Event extends AbstractView {
  constructor(route) {
    super();
    this._route = route;
    this._editClickHandler = this._editClickHandler.bind(this);
  }

  getTemplate() {
    return createEventTemplate(this._route);
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName === `BUTTON`) {
      this._callback.editClick();
    }
  }

  setClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().addEventListener(`click`, this._editClickHandler);
  }
}
