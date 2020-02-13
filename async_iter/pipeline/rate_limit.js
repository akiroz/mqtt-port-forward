"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rateLimit = void 0;

var _rate_limit = require("../rate_limit");

const rateLimit = (...args) => source => (0, _rate_limit.rateLimit)(source, ...args);

exports.rateLimit = rateLimit;