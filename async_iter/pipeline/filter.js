"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filter = void 0;

var _filter2 = require("../filter");

const filter = (...args) => source => (0, _filter2.filter)(source, ...args);

exports.filter = filter;