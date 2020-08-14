import {createDayInfoTemplate} from './day-info';
import {createEventTemplate} from './event-template';

export const createContentItem = (routes, idx) => {

  if (routes.length === 0) {
    return ``;
  }

  const {dayDate} = routes[0].date;

  let events = [];

  routes.forEach((route) => {
    events.push(createEventTemplate(route));
  });

  events = events.map((item) => {
    return (
      `<li class="trip-events__item">
        ${item}
      </li>`
    );
  });

  return (
    `<li class="trip-events__item day">
      ${createDayInfoTemplate(dayDate, idx + 1)}
      <ul class="trip-events__list">
        ${events.join(``)}
      </ul>
    </>`
  );
};
