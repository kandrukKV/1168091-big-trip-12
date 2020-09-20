import FiltersView from '../view/trip-filtres';
import {render, RenderPosition, replace, remove} from '../utils/render';
import {FilterType, UpdateType} from "../const.js";
import {filter} from "../utils/filter.js";

export default class Filter {
  constructor(filterContainer, filterModel, eventsModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._eventsModel = eventsModel;
    this._currentFilter = null;

    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._eventsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._currentFilter = this._filterModel.getFilter();

    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;


    this._filterComponent = new FiltersView(filters, this._currentFilter);
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._currentFilter === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _getFilters() {
    const events = this._eventsModel.getEvents();
    return [
      {
        name: FilterType.EVERYTHING,
        isActive: filter[FilterType.EVERYTHING](events).length > 0 ? true : false
      },
      {
        name: FilterType.FUTURE,
        isActive: filter[FilterType.FUTURE](events).length > 0 ? true : false
      },
      {
        name: FilterType.PAST,
        isActive: filter[FilterType.PAST](events).length > 0 ? true : false
      }
    ];
  }
}
