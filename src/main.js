"use strict";

const Promise = require('bluebird');
const parseCsv = require('./parseCsv').parseCsv;
var readFile = Promise.promisify(require("fs").readFile);

readFile("./data/HourList201403.csv", "utf8")
  .then(content => {
    const wages = parseCsv(content, ',');
  });