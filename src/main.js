import ContentPresenter from './presenter/content';
import SiteMenuView from './view/site-menu';
import StatisticView from './view/statistic';
import TripInfoPresenter from './presenter/trip-info';
import EventsModel from './model/events';
import DetailsModel from './model/details';
import FilterModel from './model/filter.js';
import FilterPresenter from './presenter/filter';
import {MenuItem, UpdateType, FilterType, SortType} from './const';
import Api from './api/index.js';
import {render, RenderPosition, remove} from './utils/render';
import Store from './api/store.js';
import Provider from './api/provider.js';

const AUTHORIZATION = `Basic kandrukSyaDru`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip`;
const STORE_PREFIX = `big-trip-localstorage`;

const StoreType = {
  EVENTS: `events`,
  OFFERS: `offers`,
  DESTINATIONS: `destinations`
};

const STORE_VER = `v1`;
const STORE_NAME_EVENTS = `${STORE_PREFIX}-${StoreType.EVENTS}-${STORE_VER}`;
const STORE_NAME_OFFERS = `${STORE_PREFIX}-${StoreType.OFFERS}-${STORE_VER}`;
const STORE_NAME_DESTINATIONS = `${STORE_PREFIX}-${StoreType.DESTINATIONS}-${STORE_VER}`;

const siteTripMainElement = document.querySelector(`.trip-main`);
const siteTripControlsElement = siteTripMainElement.querySelector(`.trip-main__trip-controls`);
const siteMenuElement = siteTripMainElement.querySelector(`h2`);
const siteTripEventsElement = document.querySelector(`.trip-events`);

const api = new Api(END_POINT, AUTHORIZATION);

const storeEvents = new Store(STORE_NAME_EVENTS, window.localStorage);
const storeOffers = new Store(STORE_NAME_OFFERS, window.localStorage);
const storeDestinations = new Store(STORE_NAME_DESTINATIONS, window.localStorage);

const apiWithProvider = new Provider(api, storeEvents, storeOffers, storeDestinations);

const eventsModel = new EventsModel();
const detailsModel = new DetailsModel();

const siteMenuComponent = new SiteMenuView();

const tripInfoPresenter = new TripInfoPresenter(siteTripMainElement, eventsModel);
tripInfoPresenter.init();

const filterModel = new FilterModel();
const filterPresenter = new FilterPresenter(siteTripControlsElement, filterModel, eventsModel);
filterPresenter.init();

const contentPresenter = new ContentPresenter(siteTripMainElement, siteTripEventsElement, eventsModel, detailsModel, filterModel, apiWithProvider);
contentPresenter.init();

const statisticComponent = new StatisticView();

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

apiWithProvider.getAllData()
  .then((allData) => {
    detailsModel.setDetails({
      destinations: allData[1],
      offers: allData[2]
    });
    render(siteMenuElement, siteMenuComponent, RenderPosition.AFTEREND);
    eventsModel.setEvents(UpdateType.INIT, allData[0]);
  });

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
    .then(() => {
      // Действие, в случае успешной регистрации ServiceWorker
      console.log(`ServiceWorker available`); // eslint-disable-line
    }).catch(() => {
      // Действие, в случае ошибки при регистрации ServiceWorker
      console.error(`ServiceWorker isn't available`); // eslint-disable-line
    });
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
