import ContentPresenter from './presenter/content';
import SiteMenuView from './view/site-menu';
import TripInfoPresenter from './presenter/trip-info';
import EventsModel from './model/events';
import OffersModel from './model/offers';
import DetailsModel from './model/details';
import FilterModel from './model/filter.js';
import FilterPresenter from './presenter/filter';

import {getData} from './moks/route';

import {render, RenderPosition} from './utils/render';

const data = getData();
const {events, details} = data;

const eventsModel = new EventsModel();
eventsModel.setEvents(events);

const detailsModel = new DetailsModel();
detailsModel.setDetails(details);

const siteTripMainElement = document.querySelector(`.trip-main`);
const siteTripControlsElement = siteTripMainElement.querySelector(`.trip-main__trip-controls`);
const siteMenuElement = siteTripMainElement.querySelector(`h2`);
const siteTripEventsElement = document.querySelector(`.trip-events`);

render(siteMenuElement, new SiteMenuView(), RenderPosition.AFTEREND);

const filterModel = new FilterModel();

const tripInfoPresenter = new TripInfoPresenter(siteTripMainElement, eventsModel);
tripInfoPresenter.init();

const filterPresenter = new FilterPresenter(siteTripControlsElement, filterModel, eventsModel);
filterPresenter.init();

const contentPresenter = new ContentPresenter(siteTripEventsElement, eventsModel, detailsModel, filterModel);

contentPresenter.init(data);

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  contentPresenter.createNewEvent();
});
