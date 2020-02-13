"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.max = void 0;

var _get_iterator = require("./lib/get_iterator");

var _min_max_support = require("./lib/min_max_support");

const max = (0, _get_iterator.syncType)(syncMax, asyncMax);
exports.max = max;

const syncMaxBy = (source, fn) => (0, _min_max_support.syncBy)((a, b) => a < b, source, fn);

const syncMaxByComp = (source, fn) => (0, _min_max_support.syncByComp)(a => a > 0, source, fn);

const syncMaxValue = source => (0, _min_max_support.syncValue)((a, b) => a < b, source);

const asyncMaxBy = (source, fn) => (0, _min_max_support.asyncBy)((a, b) => a < b, source, fn);

const asyncMaxByComp = (source, fn) => (0, _min_max_support.asyncByComp)(a => a > 0, source, fn);

const asyncMaxValue = source => (0, _min_max_support.asyncValue)((a, b) => a < b, source);

function syncMax(source, fn) {
  if (!fn) return syncMaxValue(source);
  if (fn.length >= 2) return syncMaxByComp(source, fn);
  return syncMaxBy(source, fn);
}

async function asyncMax(source, fn) {
  source = await (0, _get_iterator.asAsyncIterator)(source);
  if (!fn) return asyncMaxValue(source);
  if (fn.length >= 2) return asyncMaxByComp(source, fn);
  return asyncMaxBy(source, fn);
}