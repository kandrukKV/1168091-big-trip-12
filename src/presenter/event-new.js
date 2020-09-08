import EventEditFormView from '../view/event-edit';
import {generateId} from '../utils/common';
import {remove, render, RenderPosition} from "../utils/render.js";
import {UserAction, UpdateType} from "../const.js";

export default class EventNew {
  constructor(parentContainer, changeData, detailsModel) {
    this._parentContainer = parentContainer;
    this._changeData = changeData;
    this._detailsModel = detailsModel;

    this._eventNewComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleCancelClick = this._handleCancelClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init() {
    if (this._eventNewComponent !== null) {
      return;
    }

    this._eventNewComponent = new EventEditFormView(this._detailsModel.getDetails());

    this._eventNewComponent.setSubmitHandler(this._handleFormSubmit);
    this._eventNewComponent.setCancelHandler(this._handleCancelClick);

    render(this._parentContainer, this._eventNewComponent, RenderPosition.AFTEREND);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  destroy() {
    if (this._eventNewComponent === null) {
      return;
    }

    remove(this._eventNewComponent);
    this._eventNewComponent = null;

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _handleFormSubmit(event) {
    this._changeData(
        UserAction.ADD_EVENT,
        UpdateType.MAJOR,
        // Пока у нас нет сервера, который бы после сохранения
        // выдывал честный id задачи, нам нужно позаботиться об этом самим
        Object.assign({id: generateId()}, event)
    );
    this.destroy();
  }

  _handleCancelClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.destroy();
    }
  }
}
