import EventItemView from '../view/event-item';
import EventView from '../view/event';
import EventEditFormView from '../view/event-edit';
import {render, replace, RenderPosition, remove} from '../utils/render';

export default class EventItem {
  constructor(eventItemContainer, changeData) {
    this._eventItemContainer = eventItemContainer;
    this._changeData = changeData;
    this._route = null;
    this._eventItem = new EventItemView();
    this._event = null;
    this._eventEditForm = null;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._eventEditClickHandler = this._eventEditClickHandler.bind(this);
    this._editFormSubmitHandler = this._editFormSubmitHandler.bind(this);
    this._favoriteChangeHandler = this._favoriteChangeHandler.bind(this);
  }

  render(route, offers) {
    this._route = route;
    this._offers = offers;
    const prevEvent = this._event;
    const prevEventEditForm = this._eventEditForm;

    this._event = new EventView(route);
    this._eventEditForm = new EventEditFormView(offers, route);

    this._event.setClickHandler(this._eventEditClickHandler);
    this._eventEditForm.setSubmitHandler(this._editFormSubmitHandler);
    this._eventEditForm.setFavoritChangeHandler(this._favoriteChangeHandler);

    if (prevEvent === null || prevEventEditForm === null) {
      render(this._eventItem, this._event, RenderPosition.BEFOREEND);
      render(this._eventItemContainer, this._eventItem, RenderPosition.AFTERBEGIN);
      return;
    }

    if (this._eventItem.getElement().contains(prevEvent.getElement())) {
      replace(this._event, prevEvent);
    }

    if (this._eventItem.getElement().contains(prevEventEditForm.getElement())) {
      replace(this._eventEditForm, prevEventEditForm);
    }

    remove(prevEvent);
    remove(prevEventEditForm);

  }

  destroy() {
    remove(this._event);
    remove(this._eventEditForm);
    remove(this._eventItem);
  }

  _replaceEventToForm() {
    replace(this._eventEditForm, this._event);
  }

  _replaceFormToEvent() {
    replace(this._event, this._eventEditForm);
  }

  _eventEditClickHandler() {
    this._replaceEventToForm();
    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  _editFormSubmitHandler(route) {
    this._changeData(route);
    this._replaceFormToEvent();
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _favoriteChangeHandler() {
    this._changeData(Object.assign({}, this._route, {isFavorite: !this._route.isFavorite}));
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._replaceFormToEvent();
    }
  }
}
