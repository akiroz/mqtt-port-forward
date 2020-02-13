"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.last = void 0;

var _get_iterator = require("./lib/get_iterator");

const last = (0, _get_iterator.syncType)(syncLast, asyncLast);
exports.last = last;

function syncLast(source) {
  let currentItem;

  for (const item of source) currentItem = item;

  return currentItem;
}

async function asyncLast(source) {
  source = await (0, _get_iterator.asAsyncIterator)(source);
  let currentItem;

  for await (const item of source) currentItem = item;

  return currentItem;
}