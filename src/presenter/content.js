import ContentListView from '../view/content-list';
import ContentItemView from '../view/content-item';
import DayInfoView from '../view/day-info';
import EventListView from '../view/event-list';
import NoEventsView from '../view/no-events';
import SortView from '../view/events-sort';
import LoadingView from '../view/loading';
import NewEventBtnView from '../view/new-event-btn';
import {filter} from "../utils/filter.js";
import EventItemPresenter from '../presenter/event-item';
import EventNewPresenter from '../presenter/event-new';
import {SortType, UserAction, UpdateType, FilterType, State} from '../const';
import {distributeEventsByDays, sortByDate, sortByTime, sortByPrice, getDateDay} from '../utils/events';
import {render, RenderPosition, remove} from '../utils/render';

export default class Content {
  constructor(tripMainContainer, parentContainer, eventsModel, detailsModel, filterModel, api) {
    this._tripMainContainer = tripMainContainer;
    this._parentContainer = parentContainer;
    this._eventsModel = eventsModel;
    this._detailsModel = detailsModel;
    this._filterModel = filterModel;
    this._api = api;

    this._isLoading = true;

    this._newEventBtn = new NewEventBtnView();
    this._contentList = new ContentListView();
    this._noEvents = new NoEventsView();
    this._sortPanel = new SortView();
    this._loadingComponent = new LoadingView();

    this._currentSortType = SortType.EVENT;
    this._eventItemPresenter = {};
    this._contentItems = [];

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handlerCreateNewEvent = this._handlerCreateNewEvent.bind(this);


    this._eventNewPresenter = new EventNewPresenter(this._sortPanel, this._handleViewAction, this._detailsModel, this._newEventBtn);
  }

  init() {
    this._eventsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._newEventBtn.setBtnClickHandler(this._handlerCreateNewEvent);
    render(this._tripMainContainer, this._newEventBtn, RenderPosition.BEFOREEND);
    render(this._parentContainer, this._contentList, RenderPosition.BEFOREEND);
    this._renderSort();
    this._renderEvents();
  }

  destroy() {
    this._eventsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
    remove(this._sortPanel);
    this._clearContentList();
  }

  setSortType(sortType) {
    this._currentSortType = sortType;
  }

  _handlerCreateNewEvent() {
    this._currentSortType = SortType.EVENT;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._eventNewPresenter.init();
  }

  _getEvents() {

    const filterType = this._filterModel.getFilter();
    const events = this._eventsModel.getEvents();
    const filtredEvents = filter[filterType](events);

    switch (this._currentSortType) {
      case SortType.EVENT:
        return filtredEvents.sort(sortByDate);
      case SortType.TIME:
        return filtredEvents.sort(sortByTime);
      case SortType.PRICE:
        return filtredEvents.sort(sortByPrice);
    }
    return filtredEvents;
  }

  _renderSort() {
    const place = this._parentContainer.querySelector(`h2`);
    render(place, this._sortPanel, RenderPosition.AFTEREND);
    this._sortPanel.setSortChangeHandler(this._handleSortTypeChange);
  }

  _handleModeChange() {
    this._eventNewPresenter.destroy();
    Object
      .values(this._eventItemPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleSortTypeChange(sortType) {
    this._currentSortType = sortType;
    this._clearContentList();
    this._renderEvents();
  }

  _clearContentList() {
    this._eventNewPresenter.destroy();
    Object.values(this._eventItemPresenter).forEach((presenter)=> {
      presenter.destroy();
    });
    this._eventItemPresenter = {};

    this._contentItems.forEach((item) => {
      remove(item);
    });

    this._contentItems = [];
  }

  _renderEvents() {
    // отрисует весь список маршрутов
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    if (this._getEvents().length === 0) {
      this._renderNoEvent();
      return;
    }

    if (this._currentSortType === SortType.EVENT) {
      distributeEventsByDays(this._getEvents().slice())
        .forEach((oneDayEvents, i) => {
          const dayDate = getDateDay(oneDayEvents[0].beginDate);
          this._renderContentItem(oneDayEvents, dayDate, i);
        });
    } else {
      this._renderContentItem(this._getEvents());
    }
  }

  _renderContentItem(oneDayEvents, dayDate, dayNumber) {
    const contentItem = new ContentItemView();
    this._contentItems.push(contentItem);
    const dayInfo = new DayInfoView(dayDate, dayNumber + 1);
    const eventList = new EventListView();
    render(contentItem, dayInfo, RenderPosition.AFTERBEGIN);
    oneDayEvents.forEach((event) => {
      this._renderEvent(eventList, event);
    });
    render(contentItem, eventList, RenderPosition.BEFOREEND);
    render(this._contentList, contentItem, RenderPosition.BEFOREEND);
  }

  _handleViewAction(actionType, updateType, update) {
    // обработчик реагирует на изменение пользователя

    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this._eventItemPresenter[update.id].setViewState(State.SAVING);
        this._api.updateEvent(update)
          .then((response) => {
            this._eventsModel.updateEvent(updateType, response);
          })
          .catch(() => {
            this._eventItemPresenter[update.id].setViewState(State.ABORTING);
          });
        break;
      case UserAction.ADD_EVENT:
        this._eventNewPresenter.setSaving();
        this._api.addEvent(update)
          .then((response) => {
            this._newEventBtn.enableBtn();
            this._eventsModel.addEvent(updateType, response);
          })
          .catch(() => {
            this._eventNewPresenter.setAborting();
          });
        break;
      case UserAction.DELETE_EVENT:
        this._eventItemPresenter[update.id].setViewState(State.DELETING);
        this._api.deleteEvent(update)
          .then(() => {
            this._eventsModel.deleteEvent(updateType, update);
          })
          .catch(() => {
            this._eventItemPresenter[update.id].setViewState(State.ABORTING);
          });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    // обработчик реагирует на изменение модели
    switch (updateType) {
      case UpdateType.PATCH:
        this._eventItemPresenter[data.id].setFavorite(data.isFavorite);
        break;
      case UpdateType.MAJOR:
        this._clearContentList();
        this._renderEvents();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderEvents();
        break;
    }
  }

  _renderEvent(parentContainer, event) {
    const eventItemPresenter = new EventItemPresenter(parentContainer, this._handleViewAction, this._handleModeChange, this._detailsModel);
    this._eventItemPresenter[event.id] = eventItemPresenter;
    eventItemPresenter.render(event);
  }

  _renderLoading() {
    render(this._contentList, this._loadingComponent, RenderPosition.BEFOREEND);
  }

  _renderNoEvent() {
    render(this._contentList, this._noEvents, RenderPosition.BEFOREEND);
  }
}
