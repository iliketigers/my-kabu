import moment from 'moment';
import * as apiCalls from './apiCalls';
import * as dateUtils from './dateUtils';
import * as portfolioUtils from '../utils/portfolioUtils';

/**
 * @param {Date} startDate
 * @param {Date} endDate
 */
export const getChartLabels = async (startDate, endDate) => {
  const portfolio = portfolioUtils.getPortfolio();
  if (!portfolio) {
    return { xAxisLabels: [], dataPoints: [] };
  }
  const dateRange = dateUtils.getDateRange(startDate, endDate);
  const promises = await fetchPortfolioValuePromises(dateRange, portfolio);
  const portfolioValues = await Promise.all(promises);
  const { xAxisLabels, dataPoints } = fillChartLabels(
    dateRange,
    portfolioValues
  );
  return { xAxisLabels, dataPoints };
};

/**
 * @param {Object} portfolio
 * @param {Date} dateObject
 */
export const fetchPortfolioValue = async (portfolio, dateObject) => {
  let portfolioValue = 0;
  for (let i = 0; i < 5; i++) {
    const promises = [];
    const boughtShares = [];
    for (const lotIndex in portfolio.lots) {
      const boughtDate = new Date(portfolio.lots[lotIndex].boughtDate);
      const dateIsInRange = boughtDate <= dateObject;
      if (dateIsInRange) {
        const stockPrices = new Promise(async (resolve, reject) => {
          const stockPrice = await apiCalls.getStockPrice(
            portfolio.lots[lotIndex].ticker,
            dateObject
          );
          resolve(stockPrice);
        });
        promises.push(stockPrices);
        boughtShares.push(portfolio.lots[lotIndex].boughtShares);
      }
    }
    const stockPrices = await Promise.all(promises);
    for (const [i, price] of stockPrices.entries()) {
      if (!isNaN(price)) {
        portfolioValue += price * boughtShares[i];
      }
    }
    if (!portfolioValue) {
      dateObject.setDate(dateObject.getDate() - 1);
    } else {
      portfolioValue = Math.round(portfolioValue * 100 + Number.EPSILON) / 100;
      return portfolioValue;
    }
  }
};

function fillChartLabels(dateRange, portfolioValues) {
  let prevValue = 0;
  const xAxisLabels = [];
  const dataPoints = [];
  dateRange.forEach((date, i) => {
    const value = portfolioValues[i];
    if (!isNaN(value)) {
      dataPoints.push(value);
      prevValue = value;
    } else {
      dataPoints.push(prevValue);
    }
    xAxisLabels.push(moment(date).format('YYYY-MM-DD'));
  });
  return { xAxisLabels, dataPoints };
}

export const fetchPortfolioValuePromises = async (dateRange, portfolio) => {
  const promises = [];

  dateRange.forEach((date) => {
    const dateObject = new Date(date);
    promises.push(
      new Promise(async (resolve) =>
        resolve(await fetchPortfolioValue(portfolio, dateObject))
      )
    );
  });
  return promises;
};

export const getChartData = async (range, startDate, endDate) => {
  let chartLabels;
  if (range) {
    chartLabels = await getChartLabels(range[0], range[1]);
  } else if (startDate && endDate) {
    chartLabels = await getChartLabels(startDate.toDate(), endDate.toDate());
  } else {
    const today = dateUtils.setTimeToNoon(new Date());
    let startDate = new Date();
    startDate.setHours(12, 0, 0, 0);
    startDate.setDate(startDate.getDate() - 6);
    chartLabels = await getChartLabels(startDate, today);
  }

  const chartData = {
    labels: chartLabels.xAxisLabels,
    datasets: [
      {
        label: 'Portfolio value over time',
        data: chartLabels.dataPoints,
        fill: false,
        borderColor: ['rgba(0, 200, 5, 1)'],
        borderWidth: 1,
        lineTension: 0,
      },
    ],
  };

  return chartData;
};
