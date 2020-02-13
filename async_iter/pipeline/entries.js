"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.entries = void 0;

var _entries2 = require("../entries");

const entries = (...args) => source => (0, _entries2.entries)(source, ...args);

exports.entries = entries;