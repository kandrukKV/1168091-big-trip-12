import {createElement} from '../utils';

const createDayInfoTemplate = (date, dayNumber) => {
  return (
    `<div class="day__info">
      <span class="day__counter">${dayNumber}</span>
      <time class="day__date" datetime="2019-03-18">${date}</time>
    </div>`
  );
};

export default class DayInfo {
  constructor(date, dayNumber) {
    this._element = null;
    this._date = date;
    this._dayNumber = dayNumber;
  }

  getTemplate() {
    return createDayInfoTemplate(this._date, this._dayNumber);
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

