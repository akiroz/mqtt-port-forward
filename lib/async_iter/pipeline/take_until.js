"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.takeUntil = void 0;

var _take_until = require("../take_until");

const takeUntil = (...args) => source => (0, _take_until.takeUntil)(source, ...args);

exports.takeUntil = takeUntil;