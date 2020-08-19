import AbstractView from './abstract';

const createContentTemplate = () => {
  return (
    `<ul class="trip-days"></ul>`
  );
};

export default class ContentList extends AbstractView {
  getTemplate() {
    return createContentTemplate();
  }
}
