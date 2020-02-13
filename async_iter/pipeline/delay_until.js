"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.delayUntil = void 0;

var _delay_until = require("../delay_until");

const delayUntil = (...args) => source => (0, _delay_until.delayUntil)(source, ...args);

exports.delayUntil = delayUntil;