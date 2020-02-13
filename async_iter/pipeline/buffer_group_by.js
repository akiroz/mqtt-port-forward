"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bufferGroupBy = void 0;

var _buffer_group_by = require("../buffer_group_by");

const bufferGroupBy = (...args) => source => (0, _buffer_group_by.bufferGroupBy)(source, ...args);

exports.bufferGroupBy = bufferGroupBy;