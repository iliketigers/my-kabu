import React, { Component } from 'react';
import { PortfolioChart } from './PortfolioChart';
import * as chartUtils from '../utils/chartUtils';
import * as dateUtils from '../utils/dateUtils';
import * as portfolioUtils from '../utils/portfolioUtils';
import * as utilities from '../utils/utilities';

class PortfolioSummary extends Component {
  state = { submitted: false, todaysValue: 0, yesterdaysValue: 0, dayGain: 0 };

  setSubmittedState = (state) => {
    this.setState({ submitted: state });
  };

  fetchPortfolioValue = async (date = new Date()) => {
    const portfolio = portfolioUtils.getPortfolio();
    if (!portfolio) {
      return 0;
    }
    const dateCopy = dateUtils.setTimeToNoon(date);
    return await chartUtils.fetchPortfolioValue(portfolio, dateCopy);
  };

  async componentDidMount() {
    const todaysValue = await this.fetchPortfolioValue();
    let yesterday = dateUtils.yesterday();
    const yesterdaysValue = await this.fetchPortfolioValue(yesterday);
    const dayGain = todaysValue - yesterdaysValue;
    utilities.calculatePercentChange(yesterdaysValue, todaysValue);

    this.setState({
      todaysValue,
      yesterdaysValue,
      dayGain: dayGain.toFixed(2),
    });
  }

  render() {
    const portfolio = portfolioUtils.getPortfolio();

    return (
      <div className="main">
        <div>
          <h2>{portfolio && portfolio.name}</h2>
          Current value: ${this.state.todaysValue}
        </div>
        <div>
          Day Gain: ${this.state.dayGain} (+
          {this.state.yesterdaysValue > 0
            ? ((this.state.dayGain / this.state.yesterdaysValue) * 100).toFixed(
                2
              )
            : 0}
          %)
          <br />
          {/* Total Gain: ${totalGain} (
          {((totalGain / depositValue) * 100).toFixed(2)}%) */}
        </div>
        <PortfolioChart submitted={this.setSubmittedState} />
      </div>
    );
  }
}

export default PortfolioSummary;
