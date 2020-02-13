"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.combineWhen = void 0;

var _get_iterator = require("./lib/get_iterator");

const combineWhen = (0, _get_iterator.syncType)(syncCombineWhen, asyncCombineWhen);
exports.combineWhen = combineWhen;

function* syncCombineWhen(source, fn, combine = (a, b) => b + a) {
  let currentPending = undefined;
  let pending = false;

  for (const x of source) {
    if (fn(x)) {
      if (pending) yield currentPending;
      currentPending = x;
    } else currentPending = combine(x, currentPending);

    pending = true;
  }

  yield currentPending;
}

async function* asyncCombineWhen(source, fn, combine = (a, b) => b + a) {
  source = await (0, _get_iterator.asAsyncIterator)(source);
  let currentPending = undefined;
  let pending = false;

  for await (const x of source) {
    if (await fn(x)) {
      if (pending) yield currentPending;
      currentPending = x;
    } else currentPending = await combine(x, currentPending);

    pending = true;
  }

  yield currentPending;
}