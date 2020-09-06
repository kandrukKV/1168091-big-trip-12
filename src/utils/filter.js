import {FilterType} from "../const";

export const filter = {
  [FilterType.EVERYTHING]: (events) => events,
  [FilterType.FUTURE]: (events) => events.filter((event) => Date.parse(event.beginDate) > new Date().getTime()),
  [FilterType.PAST]: (events) => events.filter((event) => Date.parse(event.endDate) < new Date().getTime()),
};
