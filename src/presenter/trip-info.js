import TripInfoView from '../view/trip-info';
import {render, RenderPosition, replace, remove} from '../utils/render';

export default class TripInfoPresenter {
  constructor(parentContainer, eventsModel) {
    this._parentContainer = parentContainer;
    this._eventsModel = eventsModel;
    this._tripInfoComponent = null;
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._eventsModel.addObserver(this._handleModelEvent);
  }

  init() {
    const events = this._eventsModel.getEvents();
    const prevTripInfoComponent = this._tripInfoComponent;

    this._tripInfoComponent = new TripInfoView(events);
    if (prevTripInfoComponent === null) {
      render(this._parentContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this._tripInfoComponent, prevTripInfoComponent);
    remove(prevTripInfoComponent);

  }

  _handleModelEvent() {
    this.init();
  }
}
