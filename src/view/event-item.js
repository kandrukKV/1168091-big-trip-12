import AbstractView from './abstract';

const createEventItem = () => {
  return (
    `<li class="trip-events__item"></li>`
  );
};

export default class EventItem extends AbstractView {
  getTemplate() {
    return createEventItem();
  }
}
