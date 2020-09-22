import SmartView from './smart';

const createNewEventBtn = (isDisabled) => {
  return (
    `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button" ${isDisabled ? `disabled` : ``}>New event</button>`
  );
};

export default class NewEventButton extends SmartView {
  constructor() {
    super();
    this._isDisabled = false;
    this._btnClickHandler = this._btnClickHandler.bind(this);
  }

  getTemplate() {
    return createNewEventBtn(this._isDisabled);
  }

  disable() {
    this._isDisabled = true;
    this.updateElement();
  }

  enable() {
    this._isDisabled = false;
    this.updateElement();
  }

  setClickHandler(callback) {
    this._callback.btnClick = callback;
    this.getElement().addEventListener(`click`, this._btnClickHandler);
  }

  restoreHandlers() {
    this.getElement().addEventListener(`click`, this._btnClickHandler);
  }

  _btnClickHandler(evt) {
    evt.preventDefault();
    this.disable();
    this._callback.btnClick();
  }
}
