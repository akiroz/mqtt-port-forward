"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toArray = void 0;

var _get_iterator = require("./lib/get_iterator");

const toArray = (0, _get_iterator.syncType)(syncToArray, asyncToArray);
exports.toArray = toArray;

function syncToArray(source) {
  const result = [];

  for (const item of source) result.push(item);

  return result;
}

async function asyncToArray(source) {
  source = await (0, _get_iterator.asAsyncIterator)(source);
  const result = [];

  for await (const item of source) result.push(item);

  return result;
}