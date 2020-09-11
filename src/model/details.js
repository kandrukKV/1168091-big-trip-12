import Observer from "../utils/observer.js";

export default class Details extends Observer {
  constructor() {
    super();
    this._details = {};
  }

  setDetails(details) {
    this._details = {
      destinations: details[0],
      offers: details[1]
    };
  }

  getDetails() {
    return this._details;
  }
}
