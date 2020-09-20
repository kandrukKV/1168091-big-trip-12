import EventEditFormView from '../view/event-edit';
import {remove, render, RenderPosition} from "../utils/render.js";
import {UserAction, UpdateType} from "../const.js";

export default class EventNew {
  constructor(parentContainer, changeData, detailsModel, newEventBtn) {
    this._parentContainer = parentContainer;
    this._changeData = changeData;
    this._detailsModel = detailsModel;
    this._newEventBtn = newEventBtn;

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

  setSaving() {
    this._eventNewComponent.updateData({
      isDisabled: true,
      isSaving: true
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._eventNewComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };
    this._eventNewComponent.shake(resetFormState);
  }


  _handleFormSubmit(event) {
    this._changeData(
        UserAction.ADD_EVENT,
        UpdateType.MAJOR,
        event
    );
  }

  _handleCancelClick() {
    this._newEventBtn.enableBtn();
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._newEventBtn.enableBtn();
      this.destroy();
    }
  }
}
