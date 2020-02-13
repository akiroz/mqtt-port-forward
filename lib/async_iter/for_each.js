"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.forEach = void 0;

var _get_iterator = require("./lib/get_iterator");

const forEach = (0, _get_iterator.syncType)(syncForEach, asyncForEach);
exports.forEach = forEach;

function syncForEach(source, fn) {
  let index = 0;

  for (const item of source) fn(item, index++);
}

async function asyncForEach(source, fn) {
  source = await (0, _get_iterator.asAsyncIterator)(source);
  let index = 0;

  for await (const item of source) await fn(item, index++);
}