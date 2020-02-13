"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bufferBy = void 0;

var _buffer_by = require("../buffer_by");

const bufferBy = (...args) => source => (0, _buffer_by.bufferBy)(source, ...args);

exports.bufferBy = bufferBy;