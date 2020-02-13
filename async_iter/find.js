"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.find = void 0;

var _get_iterator = require("./lib/get_iterator");

const find = (0, _get_iterator.syncType)(syncfind, asyncfind);
exports.find = find;

function syncfind(source, fn) {
  for (const item of source) if (fn(item)) return item;
}

async function asyncfind(source, fn) {
  source = await (0, _get_iterator.asAsyncIterator)(source);

  for await (const item of source) if (fn(item)) return item;
}