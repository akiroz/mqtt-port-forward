"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.merge = void 0;

var _merge2 = require("../merge");

const merge = (...args) => source => (0, _merge2.merge)(source, ...args);

exports.merge = merge;