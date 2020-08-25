import ContentListView from '../view/content-list';
import ContentItemView from '../view/content-item';
import DayInfoView from '../view/day-info';
import EventListView from '../view/event-list';
import NoEventsView from '../view/no-events';
import SortView from '../view/events-sort';
import EventItemPresenter from '../presenter/event-item';
import {SortType} from '../const';
import {distributeEventsByDays, sortByDate, sortByTime, sortByPrice} from '../utils/events';
import {render, RenderPosition} from '../utils/render';
import {updateElementOfArray} from '../utils/common';

export default class Content {
  constructor(parentContainer) {
    this._parentContainer = parentContainer;
    this._contentList = new ContentListView();
    this._noEvents = new NoEventsView();
    this._sortPanel = new SortView();
    this._currentSortType = SortType.EVENT;
    this._eventItemPresenter = {};
    this._contentItems = [];
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handlerEventChange = this._handlerEventChange.bind(this);
  }

  init(data) {
    const {events, offers} = data;
    this._offers = offers;
    this._data = data;
    this._originalEvents = events.slice();
    this._events = events.slice();
    render(this._parentContainer, this._contentList, RenderPosition.BEFOREEND);
    this._renderSort();
    this._sortEvents(this._currentSortType);
    this._renderEvents();
  }

  _renderSort() {
    const place = this._parentContainer.querySelector(`h2`);
    render(place, this._sortPanel, RenderPosition.AFTEREND);
    this._sortPanel.setSortChangeHandler(this._handleSortTypeChange);
  }

  _handleSortTypeChange(sortType) {
    this._currentSortType = sortType;
    this._sortEvents(sortType);
    this._clearContentList();
    this._renderEvents();
  }

  _sortEvents(sortType) {
    switch (sortType) {
      case SortType.EVENT:
        this._events.sort(sortByDate);
        break;
      case SortType.TIME:
        this._events.sort(sortByTime);
        break;
      case SortType.PRICE:
        this._events.sort(sortByPrice);
        break;
    }
  }

  _clearContentList() {

    Object.values(this._eventItemPresenter).forEach((presenter)=> {
      presenter.destroy();
    });
    this._eventItemPresenter = {};

    this._contentItems.forEach((item) => {
      item.getElement().remove();
      item.removeElement();
    });

    this._contentItems = [];
  }

  _renderEvents() {
    // отрисует весь список маршрутов
    if (this._events.length === 0) {
      this._renderNoEvent();
      return;
    }

    if (this._currentSortType === SortType.EVENT) {
      this._events = distributeEventsByDays(this._events);
      this._events.forEach((oneDayEvents, i) => {
        const {dayDate} = oneDayEvents[0].date;
        this._renderContentItem(oneDayEvents, dayDate, i);
      });
    } else {
      this._renderContentItem(this._events);
    }

    this._events = this._originalEvents.slice();
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

  _handlerEventChange(route) {
    this._events = updateElementOfArray(this._events, route);
    this._originalEvents = updateElementOfArray(this._originalEvents, route);
    this._eventItemPresenter[route.id].render(route);
  }

  _renderEvent(parentContainer, event) {
    const eventItemPresenter = new EventItemPresenter(parentContainer, this._handlerEventChange);
    this._eventItemPresenter[event.id] = eventItemPresenter;
    eventItemPresenter.render(event, this._offers);
  }

  _renderNoEvent() {
    render(this._contentList, this._noEvents, RenderPosition.BEFOREEND);
  }
}
