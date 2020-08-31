import ContentPresenter from './presenter/content';
import SiteMenuView from './view/site-menu';
import TripInfoView from './view/trip-info';
import FiltersView from './view/trip-filtres';

import {getData} from './moks/route';

import {render, RenderPosition} from './utils/render';

const data = getData();

const {events} = data;

const siteTripMainElement = document.querySelector(`.trip-main`);
const siteTripControlsElement = siteTripMainElement.querySelector(`.trip-main__trip-controls`);
const siteMenuElement = siteTripMainElement.querySelector(`h2`);
const siteTripEventsElement = document.querySelector(`.trip-events`);

render(siteTripMainElement, new TripInfoView(events), RenderPosition.AFTERBEGIN);
render(siteMenuElement, new SiteMenuView(), RenderPosition.AFTEREND);
render(siteTripControlsElement, new FiltersView(), RenderPosition.BEFOREEND);

const contentPresenter = new ContentPresenter(siteTripEventsElement);

contentPresenter.init(data);
