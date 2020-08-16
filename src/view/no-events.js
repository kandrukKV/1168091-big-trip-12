import {createElement} from '../utils';

const createNoEventsTemplate = () => {
  return (
    `<p class="trip-events__msg" style="color: #000000">Click New Event to create your first point</p>`
  );
};

export default class NoEvents {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createNoEventsTemplate(this._date, this._dayNumber);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
