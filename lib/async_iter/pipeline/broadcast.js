"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.broadcast = void 0;

var _broadcast2 = require("../broadcast");

const broadcast = (...args) => source => (0, _broadcast2.broadcast)(source, ...args);

exports.broadcast = broadcast;