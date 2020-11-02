import { prototype } from 'chart.js';
import React, { Component } from 'react';
import * as Utilities from './utilities';

class StockList extends Component {
  state = { changed: false, editing: false, id: null };

  handleDeleteRequest = (id) => {
    Utilities.deleteLotFromPortfolio(id);
    this.setState({ changed: true });
  };

  handleEditRequest = (id) => {
    this.setState({ editing: true, id });
  };

  handleSaveRequest = (id, symbol, boughtShares) => {
    Utilities.updatePortfolio(id, symbol, boughtShares);
    this.setState({ editing: false, changed: true });
  };

  render() {
    const rows = [];
    const portfolio = JSON.parse(window.localStorage.getItem('portfolio'));
    if (portfolio) {
      for (const lot in portfolio.lots) {
        if (
          portfolio.lots[lot].id === this.state.id &&
          this.state.editing === true
        ) {
          rows.push(
            <EditableStockListRow
              lot={lot}
              key={lot}
              onDeleteRequest={this.handleDeleteRequest}
              onSaveRequest={this.handleSaveRequest}
            />
          );
        } else {
          rows.push(
            <StockListRow
              lot={lot}
              key={lot}
              onDeleteRequest={this.handleDeleteRequest}
              onEditRequest={this.handleEditRequest}
            />
          );
        }
      }
    }

    return (
      <div className="main">
        <table>
          <tbody>
            <tr>
              {/* // TODO: Delete 'ID" later */}
              <th>ID</th>
              <th>Stock</th>
              <th>Graph</th>
              <th>Today's close</th>
              <th>Change since...</th>
              <th>Shares</th>
              <th>Market Value</th>
              <th>Daily Gain</th>
              <th>Total Gain</th>
              <th>Delete</th>
              <th>Edit</th>
            </tr>
            {rows}
          </tbody>
        </table>
      </div>
    );
  }
}

class StockListRow extends Component {
  handleDeleteClick = (id) => {
    this.props.onDeleteRequest(id);
  };
  handleEditClick = (id) => {
    this.props.onEditRequest(id);
  };

  render() {
    const portfolio = JSON.parse(window.localStorage.getItem('portfolio'));
    const symbol = portfolio.lots[this.props.lot].symbol;
    const id = portfolio.lots[this.props.lot].id;
    const numShares = Utilities.getNumberOfShares(this.props.lot);
    const todaysPrice = Utilities.getTodaysPrice(symbol);
    const yesterdaysPrice = Utilities.getYesterdaysPrice(symbol);
    const yesterdaysValue = numShares * yesterdaysPrice;
    const todaysValue = numShares * todaysPrice;

    return (
      <tr>
        {/* ID TODO: delete later */}
        <td>{id}</td>
        {/* Stock */}
        <td>{symbol}</td>
        {/* Graph */}
        <td>Graph!</td>
        {/* Today's close */}
        <td>{todaysPrice ? `$${todaysPrice}` : null}</td>
        {/* Change since... */}
        <td>
          {todaysPrice
            ? `$${(todaysPrice - yesterdaysPrice).toFixed(2)}`
            : null}
          <br />
          {Utilities.calculatePercentChange(yesterdaysPrice, todaysPrice)}
        </td>
        {/* Shares */}
        <td>{numShares}</td>
        {/* Market value */}
        <td>{todaysValue ? `$${todaysValue.toFixed(2)}` : null}</td>
        {/* Daily gain */}
        <td>
          {todaysValue
            ? `$${(todaysValue - yesterdaysValue).toFixed(2)}`
            : null}
          <br />
          {Utilities.calculatePercentChange(yesterdaysValue, todaysValue)}
        </td>
        {/* Total gain */}
        <td></td>
        <td>
          <button onClick={() => this.handleDeleteClick(id)}>Delete</button>
        </td>
        <td>
          <button onClick={() => this.handleEditClick(id)}>Edit</button>
        </td>
      </tr>
    );
  }
}

class EditableStockListRow extends Component {
  state = {};
  handleDeleteClick = (id) => {
    this.props.onDeleteRequest(id);
  };
  handleSaveClick = (id, symbol, shares) => {
    this.props.onSaveRequest(id, symbol, shares);
  };
  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  render() {
    const portfolio = JSON.parse(window.localStorage.getItem('portfolio'));
    const symbol = portfolio.lots[this.props.lot].symbol;
    const id = portfolio.lots[this.props.lot].id;
    const numShares = Utilities.getNumberOfShares(this.props.lot);
    const todaysPrice = Utilities.getTodaysPrice(symbol);
    const yesterdaysPrice = Utilities.getYesterdaysPrice(symbol);
    const yesterdaysValue = numShares * yesterdaysPrice;
    const todaysValue = numShares * todaysPrice;
    const test = this.props.test;

    return (
      <tr>
        {/* ID TODO: delete later */}
        <td>{id}</td>
        {/* Stock */}
        <td>
          <input
            name="symbol"
            defaultValue={symbol}
            value={this.state.symbol}
            onChange={this.handleChange}
          />
        </td>
        {/* Graph */}
        <td>{test}</td>
        {/* Today's close */}
        <td>{todaysPrice ? `$${todaysPrice}` : null}</td>
        {/* Change since... */}
        <td>
          {todaysPrice
            ? `$${(todaysPrice - yesterdaysPrice).toFixed(2)}`
            : null}
          <br />
          {Utilities.calculatePercentChange(yesterdaysPrice, todaysPrice)}
        </td>
        {/* Shares */}
        <td>
          <input
            name="numShares"
            defaultValue={numShares}
            value={this.state.numShares}
            onChange={this.handleChange}
          />
        </td>
        {/* Market value */}
        <td>{todaysValue ? `$${todaysValue.toFixed(2)}` : null}</td>
        {/* Daily gain */}
        <td>
          {todaysValue
            ? `$${(todaysValue - yesterdaysValue).toFixed(2)}`
            : null}
          <br />
          {Utilities.calculatePercentChange(yesterdaysValue, todaysValue)}
        </td>
        {/* Total gain */}
        <td></td>
        <td>
          <button onClick={() => this.handleDeleteClick(id)}>Delete</button>
        </td>
        <td>
          <button
            onClick={() => {
              console.log('test', this.state.symbol);
              this.handleSaveClick(id, this.state.symbol, this.state.numShares);
            }}
          >
            Save
          </button>
        </td>
      </tr>
    );
  }
}

export default StockList;
