"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.first = void 0;

var _first2 = require("../first");

const first = (...args) => source => (0, _first2.first)(source, ...args);

exports.first = first;