"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.backlogLimit = void 0;

var _backlog_limit = require("../backlog_limit");

const backlogLimit = (...args) => source => (0, _backlog_limit.backlogLimit)(source, ...args);

exports.backlogLimit = backlogLimit;