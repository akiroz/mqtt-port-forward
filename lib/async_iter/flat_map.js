"use strict";

require("core-js/modules/es.array.flat-map");

require("core-js/modules/es.array.unscopables.flat-map");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.flatMap = void 0;

var _concat_map = require("./concat_map");

const flatMap = _concat_map.concatMap;
exports.flatMap = flatMap;