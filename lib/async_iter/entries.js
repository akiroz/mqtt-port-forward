"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.entries = void 0;

var _get_iterator = require("./lib/get_iterator");

const entries = (0, _get_iterator.syncType)(syncEntries, asyncEntries);
exports.entries = entries;

function* syncEntries(source) {
  let index = 0;

  for (const item of source) yield [index++, item];
}

async function* asyncEntries(source) {
  source = await (0, _get_iterator.asAsyncIterator)(source);
  let index = 0;

  for await (const item of source) yield [index++, item];
}