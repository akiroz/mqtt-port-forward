"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.takeUntil = void 0;

var _get_iterator = require("./lib/get_iterator");

const takeUntil = (0, _get_iterator.syncType)(syncTakeUntil, asyncTakeUntil);
exports.takeUntil = takeUntil;

function* syncTakeUntil(source, fn) {
  for (const x of source) {
    if (fn(x)) return;
    yield x;
  }
}

async function* asyncTakeUntil(source, fn) {
  source = await (0, _get_iterator.asAsyncIterator)(source);

  for await (const x of source) {
    if (await fn(x)) return;
    yield x;
  }
}