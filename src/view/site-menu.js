import SmartView from './smart';

import {MenuItem} from "../const.js";

const ACTIVE_MENU_CLASS = ` trip-tabs__btn--active`;

const createMenuTemplate = (menuActive) => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn${menuActive === MenuItem.TABLE ? ACTIVE_MENU_CLASS : ``}" href="#">${MenuItem.TABLE}</a>
      <a class="trip-tabs__btn${menuActive === MenuItem.STATS ? ACTIVE_MENU_CLASS : ``}" href="#">${MenuItem.STATS}</a>
    </nav>`
  );
};

export default class SiteMenu extends SmartView {
  constructor() {
    super();

    this._activeItemMenu = MenuItem.TABLE;
    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate(this._activeItemMenu);
  }

  _menuClickHandler(evt) {
    evt.preventDefault();

    if (evt.target.tagName !== `A`) {
      return;
    }

    this._activeItemMenu = evt.target.textContent;

    this.updateElement();

    this._callback.menuClick(evt.target.textContent);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(`click`, this._menuClickHandler);
  }

  restoreHandlers() {
    this.getElement().addEventListener(`click`, this._menuClickHandler);
  }

}
