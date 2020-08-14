export const createDayInfoTemplate = (date, dayNumber) => {
  return (
    `<div class="day__info">
      <span class="day__counter">${dayNumber}</span>
      <time class="day__date" datetime="2019-03-18">${date}</time>
    </div>`
  );
};
