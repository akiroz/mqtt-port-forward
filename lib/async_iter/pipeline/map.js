"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.map = void 0;

var _map2 = require("../map");

const map = (...args) => source => (0, _map2.map)(source, ...args);

exports.map = map;