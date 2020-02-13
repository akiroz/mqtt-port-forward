"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.concatMap = void 0;

var _concat_map = require("../concat_map");

const concatMap = (...args) => source => (0, _concat_map.concatMap)(source, ...args);

exports.concatMap = concatMap;