"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.count = void 0;

var _count2 = require("../count");

const count = (...args) => source => (0, _count2.count)(source, ...args);

exports.count = count;