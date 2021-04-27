# My Kabu

"Kabu" is the word for "Stocks" in Japanese. This is a simple app that will show a chart of your stock portfolio's value over time.

View a [live version here](https://mykabu.s3-us-west-1.amazonaws.com/index.html).

Last update: 2021-04-27

## Features

- add a stock lot using the form to save it to your portfolio.
- edit an existing entry by clicking "edit".
- delete an existing entry by clicking "delete".
- select a date range for the graph to display.

## Notes

- weekends and other market holidays retain the same value as the last open market day. currently there isn't an indication on the chart.
- currently can only save one portfolio. data is stored locally in browser and not sent to any servers.

## Technology

- [REACT](http://reactjs.org/)
- [Ant Design](https://ant.design/) for style and input elements
- [Tiingo API](https://api.tiingo.com/) for stock data
- [Chart.js](https://www.chartjs.org/) for chart and graphs
- [Heroku](https://www.heroku.com/) for server hosting
- [Amazon Web Services](https://aws.amazon.com/) for site hosting
