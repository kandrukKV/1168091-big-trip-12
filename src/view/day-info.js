import AbstractView from './abstract';

const createDayInfoTemplate = (date = null, dayNumber = null) => {

  const dayInfoInner = !date ? `` : `<span class="day__counter">${dayNumber}</span>
  <time class="day__date" datetime="2019-03-18">${date}</time>`;

  return `<div class="day__info">${dayInfoInner}</div>`;
};

export default class DayInfo extends AbstractView {
  constructor(date, dayNumber) {
    super();
    this._date = date;
    this._dayNumber = dayNumber;
  }

  getTemplate() {
    return createDayInfoTemplate(this._date, this._dayNumber);
  }

}

