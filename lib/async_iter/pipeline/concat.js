"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.concat = void 0;

var _concat2 = require("../concat");

const concat = (...args) => source => (0, _concat2.concat)(source, ...args);

exports.concat = concat;