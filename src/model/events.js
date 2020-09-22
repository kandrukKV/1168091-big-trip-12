import Observer from "../utils/observer.js";

export default class Events extends Observer {
  constructor() {
    super();
    this._events = [];
  }

  set(updateType, events) {
    this._events = events.slice();
    this._notify(updateType);
  }

  get() {
    return this._events;
  }

  updateEvent(updateType, update) {
    const index = this._events.findIndex((event) => event.id === update.id);
    if (index === -1) {
      throw new Error(`Can't update unexisting event`);
    }

    this._events = [
      ...this._events.slice(0, index),
      update,
      ...this._events.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  addEvent(updateType, update) {
    if (update.errors) {
      throw new Error(`Can't add event`);
    }

    this._events = [
      update,
      ...this._events
    ];

    this._notify(updateType, update);
  }

  deleteEvent(updateType, update) {
    const index = this._events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting event`);
    }

    this._events = [
      ...this._events.slice(0, index),
      ...this._events.slice(index + 1)
    ];

    this._notify(updateType);
  }

  static adaptToClient(event) {
    const adaptedEvent = Object.assign(
        {},
        event,
        {
          beginDate: event.date_from,
          endDate: event.date_to,
          isFavorite: event.is_favorite,
          price: event.base_price,
        }
    );

    delete adaptedEvent.date_from;
    delete adaptedEvent.date_to;
    delete adaptedEvent.is_favorite;
    delete adaptedEvent.base_price;
    return adaptedEvent;
  }

  static adaptToServer(event) {
    const adaptedEvent = Object.assign(
        {},
        event,
        {
          "date_from": event.beginDate,
          "date_to": event.endDate,
          "is_favorite": event.isFavorite,
          "base_price": event.price,
        }
    );

    delete adaptedEvent.beginDate;
    delete adaptedEvent.endDate;
    delete adaptedEvent.isFavorite;
    delete adaptedEvent.price;

    return adaptedEvent;
  }
}
