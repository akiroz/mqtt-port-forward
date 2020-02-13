"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tap = void 0;

var _get_iterator = require("./lib/get_iterator");

const tap = (0, _get_iterator.syncType)(syncTap, asyncTap);
exports.tap = tap;

function* syncTap(source, fn) {
  for (const item of source) {
    fn(item);
    yield item;
  }
}

async function* asyncTap(source, fn) {
  source = await (0, _get_iterator.asAsyncIterator)(source);

  for await (const item of source) {
    await fn(item);
    yield item;
  }
}