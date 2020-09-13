import ContentPresenter from './presenter/content';
import SiteMenuView from './view/site-menu';
import StatisticView from './view/statistic';
import TripInfoPresenter from './presenter/trip-info';
import EventsModel from './model/events';
import DetailsModel from './model/details';
import FilterModel from './model/filter.js';
import FilterPresenter from './presenter/filter';
import {MenuItem, UpdateType, FilterType, SortType} from './const';
import Api from "./api.js";
import {render, RenderPosition, remove} from './utils/render';

const AUTHORIZATION = `Basic kandrukSyaDru`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip/`;
const siteTripMainElement = document.querySelector(`.trip-main`);
const siteTripControlsElement = siteTripMainElement.querySelector(`.trip-main__trip-controls`);
const siteMenuElement = siteTripMainElement.querySelector(`h2`);
const siteTripEventsElement = document.querySelector(`.trip-events`);

const api = new Api(END_POINT, AUTHORIZATION);

const eventsModel = new EventsModel();
const detailsModel = new DetailsModel();

const siteMenuComponent = new SiteMenuView();

const tripInfoPresenter = new TripInfoPresenter(siteTripMainElement, eventsModel);
tripInfoPresenter.init();

const filterModel = new FilterModel();
const filterPresenter = new FilterPresenter(siteTripControlsElement, filterModel, eventsModel);
filterPresenter.init();

const contentPresenter = new ContentPresenter(siteTripEventsElement, eventsModel, detailsModel, filterModel, api);
contentPresenter.init();

const statisticComponent = new StatisticView();

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  contentPresenter.createNewEvent();
});

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      remove(statisticComponent);
      filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      contentPresenter.setSortType(SortType.EVENT);
      contentPresenter.init();
      break;
    case MenuItem.STATS:
      contentPresenter.destroy();
      render(siteTripEventsElement, statisticComponent, RenderPosition.AFTEREND);
      statisticComponent.setCharts(eventsModel.getEvents());
      break;
  }
};

api.getAllData()
  .then((allData) => {
    detailsModel.setDetails({
      destinations: allData[1],
      offers: allData[2]
    });
    render(siteMenuElement, siteMenuComponent, RenderPosition.AFTEREND);
    eventsModel.setEvents(UpdateType.INIT, allData[0]);
  });

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
