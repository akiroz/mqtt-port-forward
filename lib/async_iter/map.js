"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.map = void 0;

var _get_iterator = require("./lib/get_iterator");

const map = (0, _get_iterator.syncType)(syncMap, asyncMap);
exports.map = map;

function* syncMap(source, fn) {
  let count = 0;

  for (const item of source) yield fn(item, count++);
}

async function* asyncMap(source, fn) {
  source = await (0, _get_iterator.asAsyncIterator)(source);
  let count = 0;

  for await (const item of source) yield fn(item, count++);
}