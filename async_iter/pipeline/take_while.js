"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.takeWhile = void 0;

var _take_while = require("../take_while");

const takeWhile = (...args) => source => (0, _take_while.takeWhile)(source, ...args);

exports.takeWhile = takeWhile;