import AbstractView from './abstract';
import {getPreposition} from '../utils/common';

const FAVORITE_INPUT_NAME = `event-favorite`;
const NEW_EVENT_CLASS = `trip-events__item `;

const DEFAULT_ROUTE = {
  id: null,
  type: `Flight`,
  city: ``,
  price: ``,
  date: {
    start: {
      date: ``
    },
    end: {
      date: ``
    }
  },
  offers: [],
  isFavorite: false
};

const createDestinationTemplate = (destination) => {

  if (!destination) {
    return ``;
  }

  const images = destination.photos.map((item) => `<img class="event__photo" src="${item}" alt="Event photo">`).join(``);

  return (
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destination.name}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${images}
        </div>
      </div>
    </section>`
  );
};

const createOffersTemplate = (offers) => {

  if (offers.length === 0) {
    return ``;
  }

  const innerTemplate = offers.map((item, index) => {
    return (
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${index}" type="checkbox" name="event-offer-luggage" ${item.isChecked ? `checked` : ``}>
        <label class="event__offer-label" for="event-offer-luggage-${index}">
          <span class="event__offer-title">${item.name}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${item.price}</span>
        </label>
      </div>`
    );
  }).join(``);

  return innerTemplate;

  // return (
  //   `<section class="event__section  event__section--offers">
  //     <h3 class="event__section-title  event__section-title--offers">Offers</h3>
  //     <div class="event__available-offers">
  //       ${innerTemplate}
  //     </div>
  //   </section>`
  // );
};

const createCitiesTemplate = (cities) => {
  return cities.map((city) => {
    return (
      `<option value="${city}"></option>`
    );
  }).join(``);
};

const createEditButtonsBlockTemplate = (eventId, isFavorite, isEditMode) => {
  if (isEditMode) {
    return (
      `<button class="event__reset-btn" type="reset">Delete</button>
      <input id="event-favorite-${eventId}" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
      <label class="event__favorite-btn" for="event-favorite-${eventId}">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </label>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>`
    );
  } else {
    return `<button class="event__reset-btn" type="reset">Cancel</button>`;
  }
};

const createEventEditFormTemplate = (variants, route = DEFAULT_ROUTE, isEditMode) => {
  const {id, type, city, date, price, isFavorite} = route;

  const cities = Object.keys(variants[type]);
  const newEventClass = isEditMode ? `` : NEW_EVENT_CLASS;
  const eventEditBlock = createEditButtonsBlockTemplate(id, isFavorite, isEditMode);
  const destinationTemplate = isEditMode ? `` : createDestinationTemplate(variants[type][city].destination);

  const offers = city ? variants[type][city].offers : [];

  return (
    `<form class="${newEventClass}event  eroute.vent--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Transfer</legend>

              <div class="event__type-item">
                <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">
                <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">
                <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">
                <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">
                <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-transport-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="transport">
                <label class="event__type-label  event__type-label--transport" for="event-type-transport-1">Transport</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">
                <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" checked>
                <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
              </div>
            </fieldset>

            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>

              <div class="event__type-item">
                <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">
                <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">
                <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">
                <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
              </div>
            </fieldset>
         </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${id}">${type} ${getPreposition(type)}</label>
          <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${city}" list="destination-list-${id}">
          <datalist id="destination-list-${id}">
            ${createCitiesTemplate(cities)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${date.start.date}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${date.end.date}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        ${eventEditBlock}
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
            ${createOffersTemplate(offers)}
          </div>
        </section>
        ${destinationTemplate}
      </section>
    </form>`
  );
};

export default class EditForm extends AbstractView {
  constructor(offers, event, isEditMode = true) {
    super();
    this._event = event;
    this._offers = offers;
    this._isEditMode = isEditMode;
    this._submitHandler = this._submitHandler.bind(this);
    this._favoritChangeHandler = this._favoritChangeHandler.bind(this);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._cityChangeHandler = this._cityChangeHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createEventEditFormTemplate(this._offers, this._event, this._isEditMode);
  }

  _submitHandler(evt) {
    evt.preventDefault();
    this._callback.submit(this._event);
  }

  _favoritChangeHandler(evt) {
    evt.preventDefault();
    if (evt.target.name === FAVORITE_INPUT_NAME) {
      this._callback.favoritChange();
    }
  }

  _typeChangeHandler(evt) {
    if (evt.target.name === `event-type`) {
      let type = evt.target.value[0].toUpperCase() + evt.target.value.slice(1);
      this.updateData({
        type,
        city: ``,
        price: ``
      });
    }
  }

  _cityChangeHandler(evt) {
    this.updateData({
      city: evt.target.value
    });
  }

  setFavoritChangeHandler(callback) {
    this._callback.favoritChange = callback;
    this.getElement().addEventListener(`change`, this._favoritChangeHandler);
  }

  setSubmitHandler(callback) {
    this._callback.submit = callback;
    this.getElement().addEventListener(`submit`, this._submitHandler);
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`.event__type-list`).addEventListener(`change`, this._typeChangeHandler);
    this.getElement().querySelector(`.event__input--destination`).addEventListener(`change`, this._cityChangeHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setSubmitHandler(this._callback.submit);
    this.setFavoritChangeHandler(this._callback.favoritChange);
  }

  updateElement() {
    let prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);
    prevElement = null; // Чтобы окончательно "убить" ссылку на prevElement

    this.restoreHandlers();
  }

  updateData(update) {
    if (!update) {
      return;
    }

    this._event = Object.assign(
        {},
        this._event,
        update
    );

    this.updateElement();
  }
}
