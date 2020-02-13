"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.count = void 0;

var _get_iterator = require("./lib/get_iterator");

const count = (0, _get_iterator.syncType)(syncCount, asyncCount);
exports.count = count;

function syncCount(source) {
  let count = 0;

  for (const item of source) // eslint-disable-line no-unused-vars
  count++;

  return count;
}

async function asyncCount(source) {
  source = await (0, _get_iterator.asAsyncIterator)(source);
  let count = 0;

  for await (const item of source) // eslint-disable-line no-unused-vars
  count++;

  return count;
}