import Observer from "../utils/observer.js";

export default class Details extends Observer {
  constructor() {
    super();
    this._details = {};
  }

  set(details) {
    this._details = details;
  }

  get() {
    return this._details;
  }
}
