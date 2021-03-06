import { v4 as uuidv4 } from 'uuid';

export const portfolio = () => {
  return JSON.parse(window.localStorage.getItem('portfolio'));
};

/**
 *
 * @param {string} ticker
 * @param {number} boughtShares
 * @param {number} boughtPrice
 * @param {Date} boughtDate
 * @param {string} broker
 */
export function addLotToPortfolio(
  ticker,
  boughtShares,
  boughtPrice,
  boughtDate,
  broker
) {
  if (ticker) {
    let portfolio = JSON.parse(window.localStorage.getItem('portfolio'));
    if (!portfolio) {
      window.localStorage.setItem(
        'portfolio',
        JSON.stringify({
          name: 'To The Moon',
          lots: [],
        })
      );
      portfolio = JSON.parse(window.localStorage.getItem('portfolio'));
    }
    portfolio.lots.push({
      id: uuidv4(),
      ticker: ticker.toUpperCase(),
      boughtShares,
      boughtDate,
      boughtPrice,
      broker,
      soldShares: 0,
      soldDate: '',
      soldPrice: 0,
    });
    window.localStorage.setItem('portfolio', JSON.stringify(portfolio));
  }
}

export function deleteLotFromPortfolio(id) {
  const portfolio = portfolio();
  if (portfolio) {
    let index;
    for (let i = 0; i < portfolio.lots.length; i++) {
      if (id === portfolio.lots[i]['id']) {
        index = i;
      }
    }
    if (index >= 0) {
      portfolio.lots.splice(index, 1);
      window.localStorage.setItem('portfolio', JSON.stringify(portfolio));
    }
  }
}

export function updatePortfolio(
  id,
  ticker,
  boughtShares,
  boughtDate,
  boughtPrice,
  broker
) {
  const portfolio = portfolio();
  if (portfolio) {
    let index;
    for (let i = 0; i < portfolio.lots.length; i++) {
      if (id === portfolio.lots[i]['id']) {
        index = i;
      }
    }
    if (index >= 0) {
      if (ticker) {
        portfolio.lots[index].ticker = ticker;
      }
      if (boughtShares) {
        portfolio.lots[index].boughtShares = boughtShares;
      }
      if (boughtDate) {
        portfolio.lots[index].boughtDate = boughtDate;
      }
      if (boughtPrice) {
        portfolio.lots[index].boughtPrice = boughtPrice;
      }
      if (broker) {
        portfolio.lots[index].broker = broker;
      }
      window.localStorage.setItem('portfolio', JSON.stringify(portfolio));
    }
  }
}
