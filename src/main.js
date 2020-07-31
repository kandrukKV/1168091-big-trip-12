import {createMenuTemplate} from './view/site-menu';
import {createTripInfoTemplate} from './view/trip-info';
import {createTripFiltresTemplate} from './view/trip-filtres';
import {createTripEventsSortTemplate} from './view/events-sort';
import {createDayInfoTemplate} from './view/day-info';
import {createEventTemplate} from './view/event-template';
import {createEventEditFormTemplate} from './view/event-edit';
import {createContentTemplate} from './view/site-content';
import {createEventList} from './view/event-list';

import {render} from './utils';

const EVENT_COUNT = 3;

const siteTripMainElement = document.querySelector(`.trip-main`);

const siteTripControlsElement = siteTripMainElement.querySelector(`.trip-main__trip-controls`);

const siteMenuElement = siteTripMainElement.querySelector(`h2`);

const siteTripEventsElement = document.querySelector(`.trip-events`);

const siteSortElement = siteTripEventsElement.querySelector(`h2`);

render(siteTripMainElement, createTripInfoTemplate(), `afterbegin`);

render(siteMenuElement, createMenuTemplate(), `afterend`);

render(siteTripControlsElement, createTripFiltresTemplate(), `beforeend`);

render(siteSortElement, createTripEventsSortTemplate(), `afterend`);

render(siteTripEventsElement, createContentTemplate(), `beforeend`);

const seteContentElement = siteTripEventsElement.querySelector(`.trip-days__item`);

render(seteContentElement, createDayInfoTemplate(), `afterbegin`);
render(seteContentElement, createEventList(), `beforeend`);

const siteEventList = siteTripEventsElement.querySelector(`.trip-events__list`);

render(siteEventList, createEventEditFormTemplate(), `beforeend`);

for (let i = 0; i < EVENT_COUNT; i++) {
  render(siteEventList, createEventTemplate(), `beforeend`);
}

