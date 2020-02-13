"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.take = void 0;

var _take2 = require("../take");

const take = (...args) => source => (0, _take2.take)(source, ...args);

exports.take = take;