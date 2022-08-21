const express = require('express');
const {
  fixedWindowCounter,
  slidingLogs,
  slidingWindowCounter,
} = require('./rateLimiter.js');

const app = express();

app.get('/', fixedWindowCounter, (req, res, next) => {
  res.status(200).send({ msg: 'Hello World!' });
});

// Handle 404
app.use(function (req, res, next) {
  // console.log('req.query: ', req.query);
  console.log('404', req.url);
  return res.status(404).json({ error: 'error: 404' });
});

//Handle 500
app.use(function (err, req, res, next) {
  console.log('error handler: ', err);
  return res.status(500).render('error', { msg: 'error: 500' });
});

app.listen('3000', () => {
  console.log('Server started on port 3000!');
});

module.exports = app;
