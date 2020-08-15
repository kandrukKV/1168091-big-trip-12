import SiteMenuView from './view/site-menu';
import TripInfo from './view/trip-info';
import FiltersView from './view/trip-filtres';
import SortView from './view/events-sort';
import EditFormView from './view/event-edit';
import ContentListView from './view/site-content';
import ContentItemView from './view/content-item';
import DayInfoView from './view/day-info';
import EventListView from './view/event-list';
import EventItemView from './view/event-item';
import Event from './view/event';

import {getRoutes} from './moks/route';

import {render, RenderPosition} from './utils';

const allRoutes = getRoutes();

const siteTripMainElement = document.querySelector(`.trip-main`);
const siteTripControlsElement = siteTripMainElement.querySelector(`.trip-main__trip-controls`);
const siteMenuElement = siteTripMainElement.querySelector(`h2`);
const siteTripEventsElement = document.querySelector(`.trip-events`);
const siteSortElement = siteTripEventsElement.querySelector(`h2`);

render(siteTripMainElement, new TripInfo(allRoutes).getElement(), RenderPosition.AFTERBEGIN);
render(siteMenuElement, new SiteMenuView().getElement(), RenderPosition.AFTEREND);
render(siteTripControlsElement, new FiltersView().getElement(), RenderPosition.BEFOREEND);
render(siteSortElement, new SortView().getElement(), RenderPosition.AFTEREND);


const contentList = new ContentListView();
render(siteTripEventsElement, contentList.getElement(), RenderPosition.BEFOREEND);

const renderEventItem = (eventListComponent, event) => {
  const eventItemComponent = new EventItemView();
  const eventComponent = new Event(event);
  const editFormComponent = new EditFormView(event);

  const replaceEventToForm = () => {
    eventItemComponent.getElement().replaceChild(editFormComponent.getElement(), eventComponent.getElement());
  };

  const replaceFormToEvent = () => {
    eventItemComponent.getElement().replaceChild(eventComponent.getElement(), editFormComponent.getElement());
  };

  eventComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    replaceEventToForm();
  });

  editFormComponent.getElement().addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceFormToEvent();
  });

  render(eventItemComponent.getElement(), eventComponent.getElement(), RenderPosition.BEFOREEND);
  render(eventListComponent.getElement(), eventItemComponent.getElement(), RenderPosition.AFTERBEGIN);

};

allRoutes.forEach((routes, index) => {
  const {dayDate} = routes[0].date;
  const contentItemComponent = new ContentItemView();
  const dayInfo = new DayInfoView(dayDate, index + 1);
  const eventListComponent = new EventListView();
  render(contentItemComponent.getElement(), dayInfo.getElement(), RenderPosition.AFTERBEGIN);

  routes.forEach((route) => {
    renderEventItem(eventListComponent, route);
  });

  render(contentItemComponent.getElement(), eventListComponent.getElement(), RenderPosition.BEFOREEND);
  render(contentList.getElement(), contentItemComponent.getElement(), RenderPosition.BEFOREEND);
});

