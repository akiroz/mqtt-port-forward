"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.takeWhile = void 0;

var _get_iterator = require("./lib/get_iterator");

const takeWhile = (0, _get_iterator.syncType)(syncTakeWhile, asyncTakeWhile);
exports.takeWhile = takeWhile;

function* syncTakeWhile(source, fn) {
  for (const x of source) {
    if (!fn(x)) return;
    yield x;
  }
}

async function* asyncTakeWhile(source, fn) {
  source = await (0, _get_iterator.asAsyncIterator)(source);

  for await (const x of source) {
    if (!(await fn(x))) return;
    yield x;
  }
}