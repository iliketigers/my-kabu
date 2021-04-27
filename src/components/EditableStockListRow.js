import React, { Component } from 'react';
import { DatePicker } from 'antd';
import * as apiCalls from '../utils/apiCalls';
import * as dateUtils from '../utils/dateUtils';
import * as portfolioUtils from '../utils/portfolioUtils';
import * as utilities from '../utils/utilities';
import moment from 'moment';

export class EditableStockListRow extends Component {
  state = {};

  handlers = {
    delete: (id, ticker, shares) => {
      this.props.onDelete(id);
    },
    save: (id, ticker, shares, boughtDate, boughtPrice, broker) => {
      this.props.onSaveOrCancel(
        id,
        ticker,
        shares,
        boughtDate,
        boughtPrice,
        broker
      );
    },
    cancel: (id, ticker, shares) => {
      this.props.onSaveOrCancel();
    },
  };

  /**
   * @param {string} btnName
   * @param {string} id Unique id of the row that is being edited.
   * @param {string} ticker
   * @param {number} numShares
   */
  handleClick = (
    btnName,
    id,
    ticker,
    numShares,
    boughtDate,
    boughtPrice,
    broker
  ) => {
    this.handlers[btnName](
      id,
      ticker,
      numShares,
      boughtDate,
      boughtPrice,
      broker
    );
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleDateChange = (date) => {
    this.setState({ boughtDate: date.toDate() });
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

    return (
      <tr>
        {/* <td>
          ID
          {id}
        </td> */}
        <td>
          {/* Stock */}
          <input
            name="ticker"
            value={this.state.ticker || this.props.ticker}
            onChange={this.handleChange}
          />
        </td>
        <td>
          {/* Buy Date */}
          <DatePicker
            defaultValue={moment(this.props.boughtDate)}
            name="boughtDate"
            onChange={this.handleDateChange}
          />
        </td>
        <td>
          {/* Shares */}
          <input
            name="numShares"
            value={this.state.numShares || this.props.numShares}
            onChange={this.handleChange}
          />
        </td>
        <td>
          {/*Cost per share*/}
          <input
            name="boughtPrice"
            value={this.state.boughtPrice || this.props.boughtPrice}
            onChange={this.handleChange}
          />
        </td>
        <td>
          {/* Today's Close */}
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
        <td>
          {/* Broker */}
          <input
            name="broker"
            value={this.state.broker || this.props.broker}
            onChange={this.handleChange}
          />
        </td>
        <td>
          <button
            name="save"
            onClick={() => {
              this.handleClick(
                'save',
                id,
                this.state.ticker,
                this.state.numShares,
                this.state.boughtDate,
                this.state.boughtPrice,
                this.state.broker
              );
            }}
          >
            Save
          </button>
          <button
            name="cancel"
            onClick={() => {
              this.handleClick('cancel', id);
            }}
          >
            Cancel
          </button>
        </td>
        <td>
          <button name="delete" onClick={() => this.handleClick('delete', id)}>
            Delete
          </button>
        </td>
      </tr>
    );
  }
}
