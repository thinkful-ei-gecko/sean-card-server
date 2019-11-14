require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const SignServices = require('./sign-services');
const bodyParser = express.json();
const xss = require('xss');

const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.get('/sign', (req, res, next) => {
  SignServices.getAllSignatures(req.app.get('db'))
    .then(response => {
      console.log(response);
      return res.json(response);
    })
    .catch(next);
});

app.post('/sign', bodyParser, (req,res,next) => {
  let signature = req.body;
  let postIt = {name: xss(signature.name), message: xss(signature.message)};
  console.log(postIt);
  SignServices.signCard(req.app.get('db'),postIt)
    .then(response => {
      return res.json(response);
    })
    .catch(next);
});

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: {message: 'server error'} };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;