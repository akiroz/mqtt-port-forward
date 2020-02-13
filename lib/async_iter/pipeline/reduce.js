"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reduce = void 0;

var _reduce2 = require("../reduce");

const reduce = (...args) => source => (0, _reduce2.reduce)(source, ...args);

exports.reduce = reduce;