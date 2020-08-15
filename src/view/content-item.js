import {createElement} from '../utils';

const createContentItem = () => {

  return (
    `<li class="trip-events__item day"></li>`
  );
};

export default class ContentItem {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createContentItem();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }

}
