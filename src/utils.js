const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const getPreposition = (type) => {
  return (type === `Check-in` || type === `Sightseeing` || type === `Restaurant`) ? ` in ` : ` to `;
};

export {render, getPreposition};
