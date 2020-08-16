import {createElement} from '../utils';

const createTotalTemplate = (routes) => {
  let total = 0;
  routes.forEach((routeOfDay) => {
    routeOfDay.forEach((route) => {
      total += parseInt(route.price, 10);
    });
  });
  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${total}</span>
    </p>`
  );
};

const createMainTemplate = (routes) => {
  if (routes.length === 0) {
    return ``;
  }
  return (
    `<div class="trip-info__main">
      <h1 class="trip-info__title">Amsterdam &mdash; Chamonix &mdash; Geneva</h1>
      <p class="trip-info__dates">Mar 18&nbsp;&mdash;&nbsp;20</p>
    </div>`
  );
};

const createTripInfoTemplate = (routes = []) => {
  return (
    `<section class="trip-main__trip-info trip-info">

      ${createMainTemplate(routes)}

      ${createTotalTemplate(routes)}
      
    </section>`
  );
};

export default class TripInfo {
  constructor(routes) {
    this._element = null;
    this._route = routes;
  }

  getTemplate() {
    return createTripInfoTemplate(this._route);
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
