"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.min = void 0;

var _min2 = require("../min");

const min = (...args) => source => (0, _min2.min)(source, ...args);

exports.min = min;