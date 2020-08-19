import AbstractView from './abstract';

const createContentItem = () => {

  return (
    `<li class="trip-events__item day"></li>`
  );
};

export default class ContentItem extends AbstractView {

  getTemplate() {
    return createContentItem();
  }

}
