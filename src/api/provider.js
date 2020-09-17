import {nanoid} from 'nanoid';
import EventsModel from '../model/events';

const getSyncedEvents = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.point);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, storeEvents, storeOffers, storeDestinations) {
    this._api = api;
    this._storeEvents = storeEvents;
    this._storeOffers = storeOffers;
    this._storeDestinations = storeDestinations;
  }

  getAllData() {
    if (Provider.isOnline()) {
      return this._api.getAllData()
        .then((allData) => {
          const events = createStoreStructure(allData[0].map(EventsModel.adaptToServer));
          this._storeEvents.setItems(events);

          const destinations = Object.assign(
              {},
              allData[1].slice().map((item) => {
                return Object.assign(
                    {},
                    item,
                    {
                      pictures: [
                        {src: `img/photos/1.jpg`, description: `plug1`},
                        {src: `img/photos/2.jpg`, description: `plug2`},
                        {src: `img/photos/3.jpg`, description: `plug3`},
                        {src: `img/photos/4.jpg`, description: `plug4`},
                        {src: `img/photos/5.jpg`, description: `plug5`}
                      ]
                    }
                );
              })
          );

          this._storeDestinations.setItems(destinations);

          const offers = Object.assign({}, allData[2]);
          this._storeOffers.setItems(offers);

          return allData;
        });
    }

    const storeEvents = Object.values(this._storeEvents.getItems()).map(EventsModel.adaptToClient);
    const storeDestinations = Object.values(this._storeDestinations.getItems());
    const storeOffers = Object.values(this._storeOffers.getItems());

    return Promise.resolve([storeEvents, storeDestinations, storeOffers]);
  }

  updateEvent(event) {
    if (Provider.isOnline()) {
      return this._api.updateEvent(event)
        .then((updatedEvent) => {
          this._storeEvents.setItem(updatedEvent.id, EventsModel.adaptToServer(updatedEvent));
          return updatedEvent;
        });
    }

    this._storeEvents.setItem(event.id, EventsModel.adaptToServer(Object.assign({}, event)));

    return Promise.resolve(event);
  }

  addEvent(event) {
    if (Provider.isOnline()) {
      return this._api.addEvent(event)
        .then((newEvent) => {
          this._storeEvents.setItem(newEvent.id, EventsModel.adaptToServer(newEvent));
          return newEvent;
        });
    }

    // На случай локального создания данных мы должны сами создать `id`.
    // Иначе наша модель будет не полной, и это может привнести баги
    const localNewEventId = nanoid();
    const localNewEvent = Object.assign({}, event, {id: localNewEventId});

    this._storeEvents.setItem(localNewEvent.id, EventsModel.adaptToServer(localNewEvent));

    return Promise.resolve(localNewEvent);
  }

  deleteEvent(event) {
    if (Provider.isOnline()) {
      return this._api.deleteEvent(event)
        .then(() => this._storeEvents.removeItem(event.id));
    }

    this._storeEvents.removeItem(event.id);

    return Promise.resolve();
  }

  sync() {
    if (Provider.isOnline()) {
      const storeEvents = Object.values(this._storeEvents.getItems());

      return this._api.sync(storeEvents)
        .then((response) => {
          // Забираем из ответа синхронизированные задачи
          const createdEvents = getSyncedEvents(response.created);
          const updatedEvents = getSyncedEvents(response.updated);

          // Добавляем синхронизированные задачи в хранилище.
          // Хранилище должно быть актуальным в любой момент.
          const items = createStoreStructure([...createdEvents, ...updatedEvents]);

          this._storeEvents.setItems(items);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  static isOnline() {
    return window.navigator.onLine;
  }
}
