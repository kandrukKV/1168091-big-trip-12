import AbstractView from './abstract';
import {upFirstSymbol} from '../utils/events';

const createFiltersItem = (filter, currentFilter) => {
  return (
    ` <div class="trip-filters__filter">
      <input id="filter-${filter.name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter.name}" ${filter.name === currentFilter ? `checked` : ``} ${filter.isActive ? `` : `disabled`}>
      <label class="trip-filters__filter-label" for="filter-${filter.name}">${upFirstSymbol(filter.name)}</label>
    </div>`
  );
};

const createTripFiltresTemplate = (filtres, currentFilter) => {
  const filterInner = filtres.map((filter) => {
    return createFiltersItem(filter, currentFilter);
  }).join(``);

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterInner}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class FiltersMenu extends AbstractView {
  constructor(filters, currentFilter) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilter;
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createTripFiltresTemplate(this._filters, this._currentFilter);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`change`, this._filterTypeChangeHandler);
  }
}
