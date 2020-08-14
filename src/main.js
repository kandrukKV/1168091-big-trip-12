import {createMenuTemplate} from './view/site-menu';
import {createTripInfoTemplate} from './view/trip-info';
import {createTripFiltresTemplate} from './view/trip-filtres';
import {createTripEventsSortTemplate} from './view/events-sort';
import {createEventEditFormTemplate} from './view/event-edit';
import {createContentTemplate} from './view/site-content';
import {createContentItem} from './view/content-item';

import {getRoutes} from './moks/route';

import {render} from './utils';

const allRoutes = getRoutes();


const siteTripMainElement = document.querySelector(`.trip-main`);
const siteTripControlsElement = siteTripMainElement.querySelector(`.trip-main__trip-controls`);
const siteMenuElement = siteTripMainElement.querySelector(`h2`);
const siteTripEventsElement = document.querySelector(`.trip-events`);
const siteSortElement = siteTripEventsElement.querySelector(`h2`);

render(siteTripMainElement, createTripInfoTemplate(allRoutes), `afterbegin`);
render(siteMenuElement, createMenuTemplate(), `afterend`);
render(siteTripControlsElement, createTripFiltresTemplate(), `beforeend`);
render(siteSortElement, createTripEventsSortTemplate(), `afterend`);
render(siteTripEventsElement, createContentTemplate(), `beforeend`);

const siteContentList = document.querySelector(`.trip-days`);

allRoutes.forEach((routes, idx) => {
  render(siteContentList, createContentItem(routes, idx), `beforeend`);
});

const firstEvent = document.querySelector(`.trip-events__list .trip-events__item`);
firstEvent.querySelector(`.event`).remove();
const editForm = createEventEditFormTemplate(allRoutes[0][0]);
render(firstEvent, editForm, `afterbegin`);

