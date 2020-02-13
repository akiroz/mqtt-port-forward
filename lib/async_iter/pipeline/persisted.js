"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.persisted = void 0;

var _persisted2 = require("../persisted");

const persisted = (...args) => source => (0, _persisted2.persisted)(source, ...args);

exports.persisted = persisted;