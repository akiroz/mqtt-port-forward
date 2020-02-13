"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterWhen = void 0;

var _filter_when = require("../filter_when");

const filterWhen = (...args) => source => (0, _filter_when.filterWhen)(source, ...args);

exports.filterWhen = filterWhen;