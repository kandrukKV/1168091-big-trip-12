import AbstractView from './abstract';
import {sortByDate, getDateDay} from '../utils/events';

const MAX_COUNT_CITYES = 3;

const createTotalTemplate = (total) => {
  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${total ? total : `0`}</span>
    </p>`
  );
};

const createMainTemplate = (title, dates) => {
  return (
    `<div class="trip-info__main">
      <h1 class="trip-info__title">${title ? title : ``}</h1>
      <p class="trip-info__dates">${dates ? dates : ``}</p>
    </div>`
  );
};

const createTripInfoTemplate = (info) => {
  const {total, title, dates} = info;
  return (
    `<section class="trip-main__trip-info trip-info">
      ${createMainTemplate(title, dates)}
      ${createTotalTemplate(total)}
    </section>`
  );
};

export default class TripInfo extends AbstractView {
  constructor(events) {
    super();
    this._tripInfo = this._getTripInfo(events);
  }

  getTemplate() {
    return createTripInfoTemplate(this._tripInfo);
  }

  _getTripInfo(events) {

    if (!events.length) {
      return {};
    }

    const tempEvents = events.slice().sort(sortByDate);

    let total = 0;
    let title = ``;
    let dates = ``;

    tempEvents.forEach((event) => {
      total += parseInt(event.price, 10);
    });

    if (tempEvents.length > MAX_COUNT_CITYES) {
      title = `${tempEvents[0].destination.name.toUpperCase()} &mdash; ... &mdash; ${tempEvents[tempEvents.length - 1].destination.name.toUpperCase()}`;
    }

    if (tempEvents.length === MAX_COUNT_CITYES) {
      title = `${tempEvents[0].destination.name.toUpperCase()} &mdash; ${tempEvents[1].destination.name.toUpperCase()} &mdash; ${tempEvents[tempEvents.length - 1].destination.name.toUpperCase()}`;
    }

    if (tempEvents.length < MAX_COUNT_CITYES) {
      title = `${tempEvents[0].destination.name.toUpperCase()} &mdash; ${tempEvents[tempEvents.length - 1].destination.name.toUpperCase()}`;
    }

    dates = `${getDateDay(tempEvents[0].beginDate)}&nbsp;&mdash;&nbsp;${getDateDay(tempEvents[tempEvents.length - 1].endDate)}`;

    return {
      total,
      title,
      dates,
    };
  }
}
