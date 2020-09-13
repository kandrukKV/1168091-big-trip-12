import Observer from "../utils/observer.js";

export default class Details extends Observer {
  constructor() {
    super();
    this._details = {};
  }

  setDetails(details) {
    this._details = details;
  }

  getDetails() {
    return this._details;
  }
}
