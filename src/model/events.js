import Observer from "../utils/observer.js";

export default class Events extends Observer {
  constructor() {
    super();
    this._events = [];
  }

  setEvents(updateType, events) {
    this._events = events.slice();
    this._notify(updateType);
  }

  getEvents() {
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
          destination: Object.assign(
              {},
              event.destination,
              {
                title: event.destination.description
              }
          ),
          offers: event.offers.map((offer) => {
            const temp = Object.assign(
                {},
                offer,
                {
                  name: offer.title
                }
            );
            delete temp.title;
            return temp;
          })
        }
    );

    delete adaptedEvent.destination.description;
    delete adaptedEvent.date_from;
    delete adaptedEvent.date_to;
    delete adaptedEvent.is_favorite;
    delete adaptedEvent.base_price;

    return adaptedEvent;
  }
}
