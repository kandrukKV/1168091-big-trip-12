import AbstractView from './abstract';

const createNoEventsTemplate = () => {
  return (
    `<p class="trip-events__msg" style="color: #000000">Click New Event to create your first point</p>`
  );
};

export default class NoEvents extends AbstractView {
  getTemplate() {
    return createNoEventsTemplate(this._date, this._dayNumber);
  }
}
