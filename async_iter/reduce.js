"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reduce = void 0;

var _get_iterator = require("./lib/get_iterator");

const reduce = (0, _get_iterator.syncType)(syncReduce, asyncReduce);
exports.reduce = reduce;

function syncReduce(source, fn, initialValue) {
  let index = 0;
  let accumulator = initialValue;

  for (const item of source) accumulator = fn(accumulator, item, index++);

  return accumulator;
}

async function asyncReduce(source, fn, initialValue) {
  source = await (0, _get_iterator.asAsyncIterator)(source);
  let index = 0;
  let accumulator = initialValue;

  for await (const item of source) accumulator = await fn(accumulator, item, index++);

  return accumulator;
}