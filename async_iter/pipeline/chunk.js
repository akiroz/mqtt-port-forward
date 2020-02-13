"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.chunk = void 0;

var _chunk2 = require("../chunk");

const chunk = (...args) => source => (0, _chunk2.chunk)(source, ...args);

exports.chunk = chunk;