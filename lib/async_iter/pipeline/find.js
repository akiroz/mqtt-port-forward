"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.find = void 0;

var _find2 = require("../find");

const find = (...args) => source => (0, _find2.find)(source, ...args);

exports.find = find;