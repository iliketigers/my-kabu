import React, { useState } from 'react';
import { StockListRow } from './StockListRow';
import { EditableStockListRow } from './EditableStockListRow';
import * as portfolioUtils from '../utils/portfolioUtils';
import * as utilities from '../utils/utilities';

const StockList = (props) => {
  const [rerender, setRerender] = useState(false);
  const [editing, setEditing] = useState(false);
  const [id, setId] = useState();

  const deleteRow = (id) => {
    portfolioUtils.deleteLotFromPortfolio(id);
    props.rerender();
  };

  const editRow = (id) => {
    setEditing(true);
    setId(id);
  };

  const finishEditingRow = (
    id,
    ticker,
    boughtShares,
    boughtDate,
    boughtPrice,
    broker
  ) => {
    console.log(broker, ticker);
    if (id) {
      portfolioUtils.updatePortfolio(
        id,
        ticker,
        boughtShares,
        boughtDate,
        boughtPrice,
        broker
      );
    }
    setEditing(false);
    setRerender(true);
    props.rerender();
  };

  const rows = [];
  const portfolio = portfolioUtils.getPortfolio();

  if (portfolio) {
    for (const lot in portfolio.lots) {
      if (editing === true && portfolio.lots[lot].id === id) {
        rows.push(
          <EditableStockListRow
            key={portfolio.lots[lot].id}
            lot={lot}
            onDelete={deleteRow}
            onSaveOrCancel={finishEditingRow}
            ticker={portfolio.lots[lot].ticker}
            boughtDate={portfolio.lots[lot].boughtDate}
            numShares={utilities.getNumberOfShares(lot)}
            boughtPrice={portfolio.lots[lot].boughtPrice}
            broker={portfolio.lots[lot].broker}
          />
        );
      } else {
        rows.push(
          <StockListRow
            key={portfolio.lots[lot].id}
            lot={lot}
            onDelete={deleteRow}
            onEdit={editRow}
            ticker={portfolio.lots[lot].ticker}
            boughtDate={portfolio.lots[lot].boughtDate}
            numShares={utilities.getNumberOfShares(lot)}
            boughtPrice={portfolio.lots[lot].boughtPrice}
            broker={portfolio.lots[lot].broker}
          />
        );
      }
    }
  }

  return (
    <div className="main">
      <table id="stocklist">
        <tbody>
          <tr>
            {/* <th>ID</th> */}
            <th>Stock</th>
            <th>Buy Date</th>
            <th>Shares</th>
            <th>Cost per share</th>
            <th>Today's close</th>
            <th>Market Value</th>
            <th>Daily Gain</th>
            <th>Total Gain</th>
            <th>Broker</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
          {rows}
        </tbody>
      </table>
    </div>
  );
};

export default StockList;
