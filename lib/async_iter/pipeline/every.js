"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.every = void 0;

var _every2 = require("../every");

const every = (...args) => source => (0, _every2.every)(source, ...args);

exports.every = every;