const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');

dotenv.config();
const app = express();
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} on port ${PORT}: Hello there...`
      .bgBlue
  )
);
