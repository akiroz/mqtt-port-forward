"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.combineWhen = void 0;

var _combine_when = require("../combine_when");

const combineWhen = (...args) => source => (0, _combine_when.combineWhen)(source, ...args);

exports.combineWhen = combineWhen;