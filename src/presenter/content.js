
import ContentListView from '../view/content-list';
import ContentItemView from '../view/content-item';
import DayInfoView from '../view/day-info';
import EventListView from '../view/event-list';
import EventItemView from '../view/event-item';
import EventView from '../view/event';
import EventEditFormView from '../view/event-edit';
import NoEventsView from '../view/no-events';
import SortView from '../view/events-sort';
import {SortType} from '../const';
import {distributeEventsByDays, sortByDate, sortByTime, sortByPrice} from '../utils/events';
import {render, replace, RenderPosition} from '../utils/render';

export default class Content {

  constructor(parentContainer) {
    this._parentContainer = parentContainer;
    this._contentList = new ContentListView();
    this._noEvents = new NoEventsView();
    this._sortPanel = new SortView();
    this._currentSortType = SortType.EVENT;
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(routes) {
    this._originalRoutes = routes.slice();
    this._routes = routes.slice();
    render(this._parentContainer, this._contentList, RenderPosition.BEFOREEND);
    this._renderSort();
    this._sortEvents();
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
        this._routes.sort(sortByDate);
        break;
      case SortType.TIME:
        this._routes.sort(sortByTime);
        break;
      case SortType.PRICE:
        this._routes.sort(sortByPrice);
        break;
    }
  }

  _clearContentList() {
    this._contentList.getElement().innerHTML = ``;
  }

  _renderEvents() {
    // отрисует весь список маршрутов
    if (this._routes.length === 0) {
      this._renderNoEvent();
      return;
    }

    if (this._currentSortType === SortType.EVENT) {
      this._routes = distributeEventsByDays(this._routes);
      this._routes.forEach((oneDayEvents, i) => {
        const {dayDate} = oneDayEvents[0].date;
        this._renderContentItem(oneDayEvents, dayDate, i);
      });
    } else {
      this._renderContentItem(this._routes);
    }
    this._routes = this._originalRoutes.slice();
  }

  _renderContentItem(oneDayEvents, dayDate, dayNumber) {
    const contentItem = new ContentItemView();
    const dayInfo = new DayInfoView(dayDate, dayNumber + 1);
    const eventList = new EventListView();
    render(contentItem, dayInfo, RenderPosition.AFTERBEGIN);
    oneDayEvents.forEach((route) => {
      this._renderEvent(eventList, route);
    });
    render(contentItem, eventList, RenderPosition.BEFOREEND);
    render(this._contentList, contentItem, RenderPosition.BEFOREEND);
  }

  _renderEvent(parentContainer, route) {
    // отрисует отдну точку маршрута
    const eventItem = new EventItemView();
    const event = new EventView(route);
    const eventEditForm = new EventEditFormView(route);

    const replaceEventToForm = () => {
      replace(eventEditForm, event);
    };

    const replaceFormToEvent = () => {
      replace(event, eventEditForm);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        evt.preventDefault();
        replaceFormToEvent();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    event.setClickHandler(() => {
      replaceEventToForm();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    eventEditForm.setSubmitHandler(() => {
      replaceFormToEvent();
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    render(eventItem, event, RenderPosition.BEFOREEND);
    render(parentContainer, eventItem, RenderPosition.AFTERBEGIN);
  }

  _renderNoEvent() {
    // отрисует шаблон - пустышку
    render(this._contentList, this._noEvents, RenderPosition.BEFOREEND);
  }
}
