"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.forEach = void 0;

var _for_each = require("../for_each");

const forEach = (...args) => source => (0, _for_each.forEach)(source, ...args);

exports.forEach = forEach;