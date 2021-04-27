import React, { Component } from 'react';
import * as apiCalls from '../utils/apiCalls';
import * as dateUtils from '../utils/dateUtils';
import * as portfolioUtils from '../utils/portfolioUtils';
import * as utilities from '../utils/utilities';

export class StockListRow extends Component {
  state = { todaysPrice: 0, yesterdaysPrice: 0 };

  handleClick = (name, id) => {
    if (name === 'delete') {
      this.props.onDelete(id);
    }
    if (name === 'edit') {
      this.props.onEdit(id);
    }
  };

  async componentDidMount() {
    const today = new Date();
    const todaysPrice = await apiCalls.getLastValidPrice(
      this.props.ticker,
      today
    );

    const yesterday = dateUtils.yesterday();
    const yesterdaysPrice = await apiCalls.getLastValidPrice(
      this.props.ticker,
      yesterday
    );

    this.setState({
      todaysPrice,
      yesterdaysPrice,
      boughtPrice: this.props.boughtPrice,
    });
  }

  render() {
    const portfolio = portfolioUtils.getPortfolio();
    const id = portfolio.lots[this.props.lot].id;
    let yesterdaysValue = 0;
    let todaysValue = 0;

    if (this.state.todaysPrice && this.state.yesterdaysPrice) {
      yesterdaysValue = this.props.numShares * this.state.yesterdaysPrice;
      todaysValue = this.props.numShares * this.state.todaysPrice;
    }
    const boughtDateObj = new Date(this.props.boughtDate);
    const formattedDate = `${boughtDateObj.getFullYear()}-${
      boughtDateObj.getMonth() + 1
    }-${boughtDateObj.getDate()}`;

    return (
      <tr>
        {/* <td>{id}</td> */}
        <td>{this.props.ticker}</td>
        <td>{formattedDate}</td>
        <td>{this.props.numShares}</td>
        <td>{this.props.boughtPrice}</td>
        <td>
          {/* today's close */}
          {this.state.todaysPrice ? `$${this.state.todaysPrice}` : 0}
        </td>
        <td>
          {/* {Market Value} */}
          {todaysValue ? `$${todaysValue.toFixed(2)}` : 0}
        </td>
        <td>
          {/* {Daily Gain} */}
          {todaysValue ? `$${(todaysValue - yesterdaysValue).toFixed(2)}` : 0}
          <br />
          {utilities.calculatePercentChange(yesterdaysValue, todaysValue)}
        </td>
        <td>
          {/* {Total gain} */}
          {this.state.todaysPrice
            ? `$${(this.state.todaysPrice - this.state.boughtPrice).toFixed(2)}`
            : 0}
          <br />
          {utilities.calculatePercentChange(
            this.state.boughtPrice,
            this.state.todaysPrice
          )}
        </td>
        <td>{this.props.broker}</td>
        <td>
          <button onClick={() => this.handleClick('edit', id)}>Edit</button>
        </td>
        <td>
          <button onClick={() => this.handleClick('delete', id)}>Delete</button>
        </td>
      </tr>
    );
  }
}
