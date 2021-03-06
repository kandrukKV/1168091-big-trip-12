import EventItemView from '../view/event-item';
import EventView from '../view/event';
import EventEditFormView from '../view/event-edit';
import {render, replace, RenderPosition, remove} from '../utils/render';
import {UserAction, UpdateType, State, Mode} from '../const';

export default class EventItem {
  constructor(eventItemContainer, changeData, changeMode, detailsModel) {
    this._eventItemContainer = eventItemContainer;
    this._detailsModel = detailsModel;
    this._changeData = changeData;
    this._details = this._detailsModel.get();
    this._route = null;
    this._eventItem = new EventItemView();
    this._event = null;
    this._eventEditForm = null;
    this._changeMode = changeMode;
    this._mode = Mode.DEFAULT;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._eventEditClickHandler = this._eventEditClickHandler.bind(this);
    this._editFormSubmitHandler = this._editFormSubmitHandler.bind(this);
    this._favoriteChangeHandler = this._favoriteChangeHandler.bind(this);
    this._arrowUpClickHandler = this._arrowUpClickHandler.bind(this);
    this._deleteFormHandler = this._deleteFormHandler.bind(this);
  }

  render(route) {
    this._route = route;
    const prevEvent = this._event;
    const prevEventEditForm = this._eventEditForm;

    this._event = new EventView(route);
    this._eventEditForm = new EventEditFormView(this._details, route);

    this._event.setClickHandler(this._eventEditClickHandler);
    this._eventEditForm.setSubmitHandler(this._editFormSubmitHandler);
    this._eventEditForm.setDeleteHandler(this._deleteFormHandler);
    this._eventEditForm.setFavoritChangeHandler(this._favoriteChangeHandler);
    this._eventEditForm.setArrowUpClickHandler(this._arrowUpClickHandler);

    if (prevEvent === null || prevEventEditForm === null) {
      render(this._eventItem, this._event, RenderPosition.BEFOREEND);
      render(this._eventItemContainer, this._eventItem, RenderPosition.AFTERBEGIN);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._event, prevEvent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._event, prevEventEditForm);
      this._mode = Mode.DEFAULT;
    }

    remove(prevEvent);
    remove(prevEventEditForm);

  }

  setViewState(state) {
    const resetFormState = () => {
      this._eventEditForm.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    switch (state) {
      case State.SAVING:
        this._eventEditForm.updateData({
          isDisabled: true,
          isSaving: true
        });
        break;
      case State.DELETING:
        this._eventEditForm.updateData({
          isDisabled: true,
          isDeleting: true
        });
        break;
      case State.ABORTING:
        this._event.shake(resetFormState);
        this._eventEditForm.shake(resetFormState);
        break;
    }
  }

  setFavorite(isFavorite) {
    this._eventEditForm.setFavorite(isFavorite);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToEvent();
    }
  }

  destroy() {
    remove(this._event);
    remove(this._eventEditForm);
    remove(this._eventItem);
  }


  _replaceEventToForm() {
    replace(this._eventEditForm, this._event);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToEvent() {
    replace(this._event, this._eventEditForm);
    this._mode = Mode.DEFAULT;
  }

  _eventEditClickHandler() {
    this._replaceEventToForm();
    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  _arrowUpClickHandler() {
    this._eventEditForm.reset(this._route);
    this._replaceFormToEvent();
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _editFormSubmitHandler(event) {
    this._changeData(
        UserAction.UPDATE_EVENT,
        UpdateType.MAJOR,
        event
    );
  }


  _deleteFormHandler(route) {
    this._changeData(
        UserAction.DELETE_EVENT,
        UpdateType.MAJOR,
        route
    );
  }

  _favoriteChangeHandler() {
    this._changeData(
        UserAction.UPDATE_EVENT,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._route,
            {
              isFavorite: !this._route.isFavorite
            }
        )
    );
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._eventEditForm.reset(this._route);
      this._replaceFormToEvent();
      document.removeEventListener(`keydown`, this._escKeyDownHandler);
    }
  }
}
