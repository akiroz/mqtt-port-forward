"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.asyncConcatMap = asyncConcatMap;
exports.syncConcatMap = syncConcatMap;
exports.concatMap = void 0;

var _get_iterator = require("./lib/get_iterator");

const concatMap = (0, _get_iterator.syncType)(syncConcatMap, asyncConcatMap);
exports.concatMap = concatMap;

async function* asyncConcatMap(source, fn) {
  source = await (0, _get_iterator.asAsyncIterator)(source);

  for await (const item of source) yield* await (0, _get_iterator.asAsyncIterator)((await fn(item)));
}

function* syncConcatMap(source, fn) {
  for (const item of source) yield* fn(item);
}