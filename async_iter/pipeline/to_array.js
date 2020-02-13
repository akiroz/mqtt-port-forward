"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toArray = void 0;

var _to_array = require("../to_array");

const toArray = (...args) => source => (0, _to_array.toArray)(source, ...args);

exports.toArray = toArray;