import ContentListView from '../view/content-list';
import ContentItemView from '../view/content-item';
import DayInfoView from '../view/day-info';
import EventListView from '../view/event-list';
import NoEventsView from '../view/no-events';
import SortView from '../view/events-sort';
import {filter} from "../utils/filter.js";
import EventItemPresenter from '../presenter/event-item';
import EventNewPresenter from '../presenter/event-new';
import {SortType, UserAction, UpdateType, FilterType} from '../const';
import {distributeEventsByDays, sortByDate, sortByTime, sortByPrice, getDateDay} from '../utils/events';
import {render, RenderPosition, remove} from '../utils/render';

export default class Content {
  constructor(parentContainer, eventsModel, detailsModel, filterModel) {
    this._parentContainer = parentContainer;
    this._eventsModel = eventsModel;
    this._detailsModel = detailsModel;
    this._filterModel = filterModel;

    this._contentList = new ContentListView();
    this._noEvents = new NoEventsView();
    this._sortPanel = new SortView();

    this._currentSortType = SortType.EVENT;
    this._eventItemPresenter = {};
    this._contentItems = [];

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);


    this._eventNewPresenter = new EventNewPresenter(this._sortPanel, this._handleViewAction, this._detailsModel);
  }

  init() {
    this._eventsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
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

  createNewEvent() {
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
        this._eventsModel.updateEvent(updateType, update);
        break;
      case UserAction.ADD_EVENT:
        this._eventsModel.addEvent(updateType, update);
        break;
      case UserAction.DELETE_EVENT:
        this._eventsModel.deleteEvent(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    // обработчик реагирует на изменение модели
    switch (updateType) {
      case UpdateType.PATCH:
        this._eventItemPresenter[data.id].setFavorite(data.isFavorite);
        break;
      case UpdateType.MINOR:
        // - обновить список (например, когда задача ушла в архив)
        break;
      case UpdateType.MAJOR:
        this._clearContentList();
        this._renderEvents();
        break;
    }
  }

  _renderEvent(parentContainer, event) {
    const eventItemPresenter = new EventItemPresenter(parentContainer, this._handleViewAction, this._handleModeChange, this._detailsModel);
    this._eventItemPresenter[event.id] = eventItemPresenter;
    eventItemPresenter.render(event);
  }

  _renderNoEvent() {
    render(this._contentList, this._noEvents, RenderPosition.BEFOREEND);
  }
}
