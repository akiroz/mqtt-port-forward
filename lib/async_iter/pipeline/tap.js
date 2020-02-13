"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tap = void 0;

var _tap2 = require("../tap");

const tap = (...args) => source => (0, _tap2.tap)(source, ...args);

exports.tap = tap;