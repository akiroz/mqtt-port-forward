"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.max = void 0;

var _max2 = require("../max");

const max = (...args) => source => (0, _max2.max)(source, ...args);

exports.max = max;