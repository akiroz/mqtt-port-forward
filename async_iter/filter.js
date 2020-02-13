"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filter = void 0;

var _get_iterator = require("./lib/get_iterator");

var _filter_when = require("./filter_when");

const filter = (0, _get_iterator.syncType)(syncFilter, asyncFilter);
exports.filter = filter;

function* syncFilter(source, fn, missingValueFn = undefined) {
  if (missingValueFn !== undefined) return yield* (0, _filter_when.syncFilterWhen)(source, fn, missingValueFn);

  for (const x of source) if (fn(x)) yield x;
}

async function* asyncFilter(source, fn, missingValueFn = undefined) {
  if (missingValueFn !== undefined) return yield* (0, _filter_when.asyncFilterWhen)(source, fn, missingValueFn);
  source = await (0, _get_iterator.asAsyncIterator)(source);

  for await (const x of source) if (await fn(x)) yield x;
}