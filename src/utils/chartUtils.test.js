import * as chartUtils from './chartUtils';
import * as dateUtils from './dateUtils';
import * as portfolioUtils from '../utils/portfolioUtils';

const testPortfolio = JSON.stringify({
  name: 'To The Moon',
  lots: [
    {
      id: 1234,
      ticker: 'AMZN',
      boughtShares: 1,
      boughtDate: '2020-06-16',
      broker: 'Robinhood',
      boughtPrice: 2619.97,
      soldShares: 1,
      soldDate: '2020-07-13',
      soldPrice: 3175.0,
    },
    {
      id: 2345,
      ticker: 'MSFT',
      boughtShares: 5,
      boughtDate: '2020-07-14',
      broker: 'Robinhood',
      boughtPrice: 107.97,
      soldShares: 0,
      soldDate: '',
      soldPrice: 0,
    },
  ],
});

jest.mock('uuid', () => {
  return {
    v4: jest.fn(() => 1234),
  };
});

function populatePortfolio() {
  window.localStorage.setItem('portfolio', testPortfolio);
}

// to prevent unneeded API calls
function populateStockPrices() {
  window.localStorage.setItem(
    'AMZN-2020-12-10T00:00:00.000Z',
    JSON.stringify(3101.49)
  );
  window.localStorage.setItem(
    'AMZN-2020-12-11T00:00:00.000Z',
    JSON.stringify(3116.42)
  );
  window.localStorage.setItem(
    'AMZN-2020-12-12T00:00:00.000Z',
    JSON.stringify('')
  );
  window.localStorage.setItem(
    'AMZN-2020-12-13T00:00:00.000Z',
    JSON.stringify('')
  );
  window.localStorage.setItem(
    'AMZN-2020-12-14T00:00:00.000Z',
    JSON.stringify(3156.97)
  );
  window.localStorage.setItem(
    'AMZN-2020-12-29T00:00:00.000Z',
    JSON.stringify(3322)
  );
  window.localStorage.setItem(
    'MSFT-2020-12-10T00:00:00.000Z',
    JSON.stringify(210.52)
  );
  window.localStorage.setItem(
    'MSFT-2020-12-11T00:00:00.000Z',
    JSON.stringify(213.26)
  );
  window.localStorage.setItem(
    'MSFT-2020-12-12T00:00:00.000Z',
    JSON.stringify('')
  );
  window.localStorage.setItem(
    'MSFT-2020-12-13T00:00:00.000Z',
    JSON.stringify('')
  );
  window.localStorage.setItem(
    'MSFT-2020-12-14T00:00:00.000Z',
    JSON.stringify(214.2)
  );
  window.localStorage.setItem(
    'MSFT-2020-12-29T00:00:00.000Z',
    JSON.stringify(224.15)
  );
}

describe('getChartLabels', () => {
  // `todayMock` has non-noon time to mock `new Date()`
  const todayMock = new Date('2020-12-15T01:24:29.000Z');
  const startDate = new Date('2020-12-10T20:00:00.000Z');

  afterEach(() => {
    window.localStorage.clear();
  });

  it('returns data for chart', async () => {
    populatePortfolio();
    populateStockPrices();
    const data = await chartUtils.getChartLabels(startDate, todayMock);
    expect(data.dataPoints).toStrictEqual([
      4154.09,
      4182.72,
      4182.72,
      4182.72,
      4227.97,
    ]);
    expect(data.xAxisLabels).toStrictEqual([
      '2020-12-10',
      '2020-12-11',
      '2020-12-12',
      '2020-12-13',
      '2020-12-14',
    ]);
  });

  it('no portfolio found', async () => {
    window.localStorage.clear();
    const data = await chartUtils.getChartLabels(startDate, todayMock);
    expect(data).toStrictEqual({ xAxisLabels: [], dataPoints: [] });
  });
});

describe('fetchPortfolioValuePromises', () => {
  beforeEach(() => {
    populatePortfolio();
    populateStockPrices();
  });
  afterEach(() => {
    window.localStorage.clear();
  });

  it('happy path', async () => {
    const startDate = new Date('2020-12-10T20:00:00.000Z');
    const endDate = new Date(
      'Mon Dec 14 2020 12:00:00 GMT-0800 (Pacific Standard Time)'
    );
    const dateRange = dateUtils.getDateRange(startDate, endDate);
    const portfolio = portfolioUtils.getPortfolio();
    const promises = await chartUtils.fetchPortfolioValuePromises(
      dateRange,
      portfolio
    );
    const portfolioValues = await Promise.all(promises);
    expect(portfolioValues).toStrictEqual([
      4154.09,
      4182.72,
      4182.72,
      4182.72,
      4227.97,
    ]);
  });
});

describe('fetchPortfolioValue', () => {
  beforeEach(() => {
    populatePortfolio();
    populateStockPrices();
  });
  afterEach(() => {
    window.localStorage.clear();
  });

  it('datepicker', async () => {
    const date = new Date('2020-12-10T20:00:00.000Z');
    const portfolio = portfolioUtils.getPortfolio();
    const data = await chartUtils.fetchPortfolioValue(portfolio, date);
    expect(data).toBe(4154.09);
  });

  it('today', async () => {
    const date = new Date(
      'Tue Dec 29 2020 17:24:29 GMT-0800 (Pacific Standard Time)'
    );
    const portfolio = portfolioUtils.getPortfolio();
    const data = await chartUtils.fetchPortfolioValue(portfolio, date);
    expect(data).toBe(4442.75);
  });
});
