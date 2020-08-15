import {createElement} from '../utils';

const createContentTemplate = () => {
  return (
    `<ul class="trip-days"></ul>`
  );
};

export default class ContentList {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createContentTemplate();
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
