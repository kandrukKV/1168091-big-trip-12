import SmartView from './smart';
import {getPreposition, upFirstSymbol, getFullDate} from '../utils/events';

import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import '../../node_modules/flatpickr/dist/themes/material_blue.css';

const FAVORITE_INPUT_NAME = `event-favorite`;
const NEW_EVENT_CLASS = `trip-events__item `;

const DEFAULT_ROUTE = {
  id: null,
  type: `flight`,
  beginDate: new Date().toISOString(),
  endDate: new Date().toISOString(),
  price: 0,
  offers: [],
  isFavorite: false,
  isNewEventMode: true
};

const createDestinationTemplate = (destination) => {
  if (!destination) {
    return ``;
  }

  const images = destination.pictures.map((item) => `<img class="event__photo" src="${item.src}" alt="${item.description}">`).join(``);

  return (
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destination.description}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${images}
        </div>
      </div>
    </section>`
  );
};

const createOffersTemplate = (offers, isDisabled) => {
  if (offers.length === 0) {
    return ``;
  }

  const innerTemplate = offers.map((item, index) => {
    return (
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${index}" type="checkbox" name="event-offer-luggage" value="${item.title}" ${item.isChecked ? `checked` : ``} ${isDisabled ? `disabled` : ``}>
        <label class="event__offer-label" for="event-offer-luggage-${index}">
          <span class="event__offer-title">${item.title}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${item.price}</span>
        </label>
      </div>`
    );
  }).join(``);

  return (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${innerTemplate}
      </div>
    </section>`
  );
};

const createCitiesTemplate = (cities) => {
  return cities.map((city) => {
    return (
      `<option value="${city}"></option>`
    );
  }).join(``);
};

const createEditButtonsBlockTemplate = (eventId, isFavorite, isEditMode, isDeleting, isDisabled) => {
  if (isEditMode) {
    return (
      `<button class="event__reset-btn" type="reset" ${isDisabled ? `disabled` : ``}>${isDeleting ? `Deleting...` : `Delete`}</button>
      <input id="event-favorite-${eventId}" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``} ${isDisabled ? `disabled` : ``}>
      <label class="event__favorite-btn" for="event-favorite-${eventId}">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </label>
      <button class="event__rollup-btn" type="button" ${isDisabled ? `disabled` : ``}>
        <span class="visually-hidden">Open event</span>
      </button>`
    );
  } else {
    return `<button class="event__reset-btn" type="reset" ${isDisabled ? `disabled` : ``}>Cancel</button>`;
  }
};

const createEventEditFormTemplate = (destinations, route) => {
  const {
    id,
    type,
    beginDate,
    endDate,
    price,
    isFavorite,
    destination,
    offers,
    isDestination,
    isNewEventMode,
    isSaving,
    isDeleting,
    isDisabled
  } = route;

  const isEditMode = isNewEventMode ? false : true;
  const cities = destinations.map((item) => item.name);
  const currentCity = destination ? destination.name : ``;
  const newEventClass = isEditMode ? `` : NEW_EVENT_CLASS;
  const eventEditBlock = createEditButtonsBlockTemplate(id, isFavorite, isEditMode, isDeleting, isDisabled);
  const offersTemplate = createOffersTemplate(offers, isDisabled);


  const dateFrom = getFullDate(beginDate);
  const dateTo = getFullDate(endDate);

  const destinationTemplate = isDestination ? createDestinationTemplate(destination) : ``;
  return (
    `<form class="${newEventClass}event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox" ${isDisabled ? `disabled` : ``}>

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Transfer</legend>

              <div class="event__type-item">
                <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi" ${isDisabled ? `disabled` : ``}>
                <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus" ${isDisabled ? `disabled` : ``}>
                <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train" ${isDisabled ? `disabled` : ``}>
                <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship" ${isDisabled ? `disabled` : ``}>
                <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-transport-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="transport" ${isDisabled ? `disabled` : ``}>
                <label class="event__type-label  event__type-label--transport" for="event-type-transport-1">Transport</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive" ${isDisabled ? `disabled` : ``}>
                <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" ${isDisabled ? `disabled` : ``}>
                <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
              </div>
            </fieldset>

            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>

              <div class="event__type-item">
                <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in" ${isDisabled ? `disabled` : ``}>
                <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing" ${isDisabled ? `disabled` : ``}>
                <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant" ${isDisabled ? `disabled` : ``}>
                <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
              </div>
            </fieldset>
         </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${id}">${upFirstSymbol(type)} ${getPreposition(type)}</label>
          <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${currentCity}" list="destination-list-${id}" ${isDisabled ? `disabled` : ``}>
          <datalist id="destination-list-${id}">
            ${createCitiesTemplate(cities)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-${id}">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${dateFrom}" ${isDisabled ? `disabled` : ``}>
          &mdash;
          <label class="visually-hidden" for="event-end-time-${id}">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${dateTo}" ${isDisabled ? `disabled` : ``}>
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${id}">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-${id}" type="number" name="event-price" value="${price}" ${isDisabled ? `disabled` : ``}>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? `disabled` : ``}>${isSaving ? `Saving...` : `Save`}</button>
        ${eventEditBlock}
      </header>
      <section class="event__details">
        ${offersTemplate}
        ${destinationTemplate}
      </section>
    </form>`
  );
};

export default class EditForm extends SmartView {
  constructor(details, event = DEFAULT_ROUTE) {
    super();
    const {offers, destinations} = details;
    this._event = event;

    this._allOffers = offers;
    this._destinations = destinations;


    this._data = EditForm.parseEventToData(event, this._allOffers);

    this._startDatepicker = null;
    this._endDatepicker = null;

    this._details = details;

    this._submitHandler = this._submitHandler.bind(this);
    this._favoritChangeHandler = this._favoritChangeHandler.bind(this);
    this._deleteEventHandler = this._deleteEventHandler.bind(this);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._cityChangeHandler = this._cityChangeHandler.bind(this);
    this._priceInputHandler = this._priceInputHandler.bind(this);
    this._arrowUpHandler = this._arrowUpHandler.bind(this);
    this._offersChangeHandler = this._offersChangeHandler.bind(this);
    this._startDateChangeHandler = this._startDateChangeHandler.bind(this);
    this._endDateChangeHandler = this._endDateChangeHandler.bind(this);
    this._cancelEventHandler = this._cancelEventHandler.bind(this);

    this._setInnerHandlers();
    this._setStartDatepicker();
    this._setEndDatepicker();
  }

  getTemplate() {
    return createEventEditFormTemplate(this._destinations, this._data);
  }

  _setStartDatepicker() {
    this._startDatepicker = flatpickr(
        this.getElement().querySelector(`input[name="event-start-time"]`),
        {
          enableTime: true,
          dateFormat: `y/m/d H:i`,
          defaultDate: this._data.beginDate,
          onChange: this._startDateChangeHandler
        }
    );
  }

  _setEndDatepicker() {
    this._endDatepicker = flatpickr(
        this.getElement().querySelector(`input[name="event-end-time"]`),
        {
          enableTime: true,
          dateFormat: `y/m/d H:i`,
          defaultDate: this._data.endDate,
          minDate: this._data.beginDate,
          onChange: this._endDateChangeHandler
        }
    );
  }

  _startDateChangeHandler([startDate]) {
    this.updateData({
      beginDate: startDate.toISOString()
    }, true);
  }

  _endDateChangeHandler([endDate]) {
    this.updateData({
      endDate: endDate.toISOString()
    }, true);
  }

  _deleteEventHandler(evt) {
    evt.preventDefault();
    this._callback.deleteEvent(EditForm.parseDataToEvent(this._data));
  }

  _submitHandler(evt) {
    evt.preventDefault();
    if (!this._data.destination || !this._data.destination.name) {
      this.shake(()=>{});
      return;
    }
    this._callback.submit(EditForm.parseDataToEvent(this._data));
  }

  _favoritChangeHandler(evt) {
    evt.preventDefault();
    if (evt.target.name === FAVORITE_INPUT_NAME) {
      this._callback.favoritChange();
    }
  }

  _cancelEventHandler(evt) {
    evt.preventDefault();
    this._callback.cancelEvent();
  }

  _arrowUpHandler() {
    this._callback.arrowUp();
  }

  _priceInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      price: parseInt(evt.target.value, 10),
    }, true);
  }

  _typeChangeHandler(evt) {
    if (evt.target.name === `event-type`) {
      let type = evt.target.value;
      this.updateData({
        type,
        destination: {
          name: ``
        },
        offers: this._allOffers
          .find((item) => item.type === type).offers
          .map((offer) => {
            offer.isChecked = false;
            return offer;
          }),
        isDestination: false,
        isOffersChecked: false
      });
    }
  }

  _cityChangeHandler(evt) {
    if (this._destinations.find((item) => item.name === evt.target.value)) {
      this.updateData({
        destination: this._destinations.find((item) => item.name === evt.target.value),
        isOffersChecked: false,
        isDestination: true
      });
    } else {
      evt.target.value = ``;
    }
  }

  _offersChangeHandler(evt) {
    this.updateData({
      offers: this._data.offers.map((offer) => {
        if (offer.title === evt.target.value) {
          offer.isChecked = evt.target.checked;
        }
        return offer;
      })
    }, true);
  }

  reset(event) {
    this.updateData(
        EditForm.parseEventToData(event, this._allOffers)
    );
  }

  // Перегружаем метод родителя removeElement,
  // чтобы при удалении удалялся более ненужный календарь
  removeElement() {
    super.removeElement();

    if (this._startDatepicker) {
      this._startDatepicker.destroy();
      this._startDatepicker = null;
    }

    if (this._endDatepicker) {
      this._endDatepicker.destroy();
      this._endDatepicker = null;
    }
  }

  setFavorite(isFavorite) {
    this._event.isFavorite = isFavorite;
    this.updateData({
      isFavorite,
      isDisabled: false,
      isSaving: false
    });
  }

  setDeleteHandler(callback) {
    if (!this._event.isNewEventMode) {
      this._callback.deleteEvent = callback;
      this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._deleteEventHandler);
    }
  }

  setCancelHandler(callback) {
    if (this._event.isNewEventMode) {
      this._callback.cancelEvent = callback;
      this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._cancelEventHandler);
    }
  }

  setFavoritChangeHandler(callback) {
    this._callback.favoritChange = callback;
    if (!this._data.isNewEventMode) {
      this.getElement().addEventListener(`change`, this._favoritChangeHandler);
    }
  }

  setSubmitHandler(callback) {
    this._callback.submit = callback;
    this.getElement().addEventListener(`submit`, this._submitHandler);
  }

  setArrowUpClickHandler(callback) {
    this._callback.arrowUp = callback;
    if (!this._data.isNewEventMode) {
      this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._arrowUpHandler);
    }
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`.event__type-list`).addEventListener(`change`, this._typeChangeHandler);
    this.getElement().querySelector(`.event__input--destination`).addEventListener(`change`, this._cityChangeHandler);
    this.getElement().querySelector(`input[name="event-price"]`).addEventListener(`input`, this._priceInputHandler);
    this.getElement().querySelector(`.event__details`).addEventListener(`change`, this._offersChangeHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setSubmitHandler(this._callback.submit);
    this.setFavoritChangeHandler(this._callback.favoritChange);
    this.setArrowUpClickHandler(this._callback.arrowUp);
    this.setDeleteHandler(this._callback.deleteEvent);
    this.setCancelHandler(this._callback.cancelEvent);
    this._setStartDatepicker();
    this._setEndDatepicker();
  }

  static parseDataToEvent(data) {
    data = Object.assign(
        {},
        data,
        {
          offers: data.offers
            .filter((offer) => offer.isChecked === true)
            .map((offer) => {
              delete offer.isChecked;
              return offer;
            })
        }
    );

    delete data.isOffersChecked;
    delete data.isDestination;
    delete data.isNewEventMode;
    delete data.isSaving;
    delete data.isDeleting;
    delete data.isDisabled;

    return data;
  }

  static parseEventToData(event, allOffers) {

    const newOffers = allOffers.find((item) => item.type === event.type).offers;

    return Object.assign(
        {},
        event,
        {
          isOffersChecked: true,
          isDestination: false,
          isSaving: false,
          isDeleting: false,
          isDisabled: false,
          offers: newOffers.map((offer) => {
            return Object.assign(
                {},
                offer,
                {
                  isChecked: event.offers.find((el) => offer.title === el.title) ? true : false
                }
            );
          })
        }
    );
  }
}
