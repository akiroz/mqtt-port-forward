"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.byLines = void 0;

var _by_lines = require("../by_lines");

const byLines = (...args) => source => (0, _by_lines.byLines)(source, ...args);

exports.byLines = byLines;