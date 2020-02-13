"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.first = void 0;

var _get_iterator = require("./lib/get_iterator");

const first = (0, _get_iterator.syncType)(syncFirst, asyncFirst);
exports.first = first;

function syncFirst(source) {
  for (const item of source) return item;
}

async function asyncFirst(source) {
  source = await (0, _get_iterator.asAsyncIterator)(source);

  for await (const item of source) return item;
}