import * as portfolioUtils from '../utils/portfolioUtils';

export const falseFunc = () => false;

/**
 *
 * @param {number} oldValue
 * @param {number} newValue
 */
export function calculatePercentChange(oldValue, newValue) {
  if (oldValue && newValue) {
    return (((newValue - oldValue) / oldValue) * 100).toFixed(2) + '%';
  } else {
    return 0;
  }
}

export function getNumberOfShares(index) {
  const portfolio = portfolioUtils.getPortfolio();
  if (portfolio) {
    const portfolioEntry = portfolio.lots[index];
    return portfolioEntry.boughtShares - portfolioEntry.soldShares;
  }
  return 0;
}
