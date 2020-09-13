import AbstractView from "./abstract.js";

const createNoTaskTemplate = () => {
  return `<p style="text-align: center;">
    Loading...
  </p>`;
};

export default class Loading extends AbstractView {
  getTemplate() {
    return createNoTaskTemplate();
  }
}
