"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.last = void 0;

var _last2 = require("../last");

const last = (...args) => source => (0, _last2.last)(source, ...args);

exports.last = last;