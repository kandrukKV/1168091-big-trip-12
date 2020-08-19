
import ContentListView from '../view/content-list';
import ContentItemView from '../view/content-item';
import DayInfoView from '../view/day-info';
import EventListView from '../view/event-list';
import EventItemView from '../view/event-item';
import EventView from '../view/event';
import EventEditFormView from '../view/event-edit';
import NoEventsView from '../view/no-events';
import {render, replace, RenderPosition} from '../utils/render';

export default class Content {

  constructor(parentContainer) {
    this._parentContainer = parentContainer;
    this._contentList = new ContentListView();
    this._noEvents = new NoEventsView();
  }

  init(routesByDay) {
    this._routesByDay = routesByDay.slice();
    render(this._parentContainer, this._contentList, RenderPosition.BEFOREEND);
    this._render(this._routesByDay);
  }

  _render(routesByDay) {
    // отрисует весь список маршрутов

    if (routesByDay.length === 0) {
      this._renderNoEvent();
      return;
    }

    routesByDay.forEach((oneDayRoute, i) => {
      const {dayDate} = oneDayRoute[0].date;
      const contentItem = new ContentItemView();
      const dayInfo = new DayInfoView(dayDate, i + 1);
      const eventList = new EventListView();

      render(contentItem, dayInfo, RenderPosition.AFTERBEGIN);

      oneDayRoute.forEach((route) => {
        this._renderEvent(eventList, route);
      });


      render(contentItem, eventList, RenderPosition.BEFOREEND);
      render(this._contentList, contentItem, RenderPosition.BEFOREEND);
    });
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
