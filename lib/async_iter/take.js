"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.take = void 0;

var _get_iterator = require("./lib/get_iterator");

const take = (0, _get_iterator.syncType)(syncTake, asyncTake);
exports.take = take;

function* syncTake(source, count) {
  if (count === 0) return;

  for (const x of source) {
    yield x;
    if (count-- <= 1) break;
  }
}

async function* asyncTake(source, count) {
  if (count === 0) return;
  source = await (0, _get_iterator.asAsyncIterator)(source);

  for await (const x of source) {
    yield x;
    if (count-- <= 1) break;
  }
}