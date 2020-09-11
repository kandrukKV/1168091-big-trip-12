import SmartView from './smart';
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {getMoneyStat, getTransportStat, getTimeSpentStat} from '../utils/statistic';

const BAR_HEIGHT = 55;

const createStatisticTemplate = () => {
  return (
    `<section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>
    <div class="statistics__item statistics__item--money">
      <canvas class="statistics__chart statistics__chart--money" width="900"></canvas>
    </div>
    <div class="statistics__item statistics__item--transport">
      <canvas class="statistics__chart statistics__chart--transport" width="900"></canvas>
    </div>
    <div class="statistics__item statistics__item--time-spend">
      <canvas class="statistics__chart statistics__chart--time" width="900"></canvas>
    </div>
  </section>`
  );
};

const renderChart = (ctx, title, labels, data, prefix) => {

  ctx.height = BAR_HEIGHT * labels.length;

  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: `#ECEBEB`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${prefix} ${val}`
        }
      },
      title: {
        display: true,
        text: title,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};


export default class StatisticView extends SmartView {
  constructor() {
    super();

    this._events = null;

    this._moneyChart = null;
    this._transportChart = null;
    this._timeSpendChart = null;

  }

  getTemplate() {
    return createStatisticTemplate();
  }

  setCharts(events) {
    this._events = events;
    const moneyCtx = this.getElement().querySelector(`.statistics__chart--money`);
    const transportCtx = this.getElement().querySelector(`.statistics__chart--transport`);
    const timeSpendCtx = this.getElement().querySelector(`.statistics__chart--time`);

    const moneyStatData = getMoneyStat(this._events);
    const transportStatData = getTransportStat(this._events);
    const timeSpentStatData = getTimeSpentStat(this._events);

    this._moneyChart = renderChart(moneyCtx, `MONEY`, moneyStatData.types, moneyStatData.values, `€`);
    this._transportChart = renderChart(transportCtx, `TRANSPORT`, transportStatData.types, transportStatData.values, `x`);
    this._timeSpendChart = renderChart(timeSpendCtx, `TIME SPENT`, timeSpentStatData.types, timeSpentStatData.values, `H`);
  }
}

