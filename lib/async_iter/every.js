"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.every = void 0;

var _get_iterator = require("./lib/get_iterator");

const every = (0, _get_iterator.syncType)(syncevery, asyncevery);
exports.every = every;

function syncevery(source, fn) {
  let index = 0;

  for (const item of source) if (!fn(item, index++)) return false;

  return true;
}

async function asyncevery(source, fn) {
  source = await (0, _get_iterator.asAsyncIterator)(source);
  let index = 0;

  for await (const item of source) if (!fn(item, index++)) return false;

  return true;
}