"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.delay = void 0;

var _delay2 = require("../delay");

const delay = (...args) => source => (0, _delay2.delay)(source, ...args);

exports.delay = delay;