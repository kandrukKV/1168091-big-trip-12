import EventsModel from './model/events';

const Method = {
  GET: `GET`,
  PUT: `PUT`,
  POST: `POST`,
  DELETE: `DELETE`
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299
};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  _getEvents() {
    return this._load({url: `points`})
      .then(Api.toJSON)
      .then((events) => {
        return events.map((event) => EventsModel.adaptToClient(event));
      })
      .catch(() => []);
  }

  _getDestinations() {
    return this._load({url: `destinations`})
      .then(Api.toJSON)
      .catch(() => []);
  }

  _getOffers() {
    return this._load({url: `offers`})
      .then(Api.toJSON)
      .catch(() => []);
  }

  getAllData() {
    return Promise.all([this._getEvents(), this._getDestinations(), this._getOffers()]);
  }

  updateEvent(event) {
    const data = EventsModel.adaptToServer(event);
    return this._load({
      url: `points/${event.id}`,
      method: Method.PUT,
      body: JSON.stringify(data),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(Api.toJSON)
      .then(EventsModel.adaptToClient);
  }

  addEvent(event) {
    return this._load({
      url: `points`,
      method: Method.POST,
      body: JSON.stringify(EventsModel.adaptToServer(event)),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(Api.toJSON)
      .then(EventsModel.adaptToClient);
  }

  deleteEvent(event) {
    return this._load({
      url: `points/${event.id}`,
      method: Method.DELETE
    });
  }

  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers()
  }) {
    headers.append(`Authorization`, this._authorization);

    return fetch(
        `${this._endPoint}/${url}`,
        {method, body, headers}
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (
      response.status < SuccessHTTPStatusRange.MIN &&
      response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}
