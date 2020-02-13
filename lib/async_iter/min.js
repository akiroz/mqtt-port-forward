"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.min = void 0;

var _get_iterator = require("./lib/get_iterator");

var _min_max_support = require("./lib/min_max_support");

const min = (0, _get_iterator.syncType)(syncMin, asyncMin);
exports.min = min;

const syncMinBy = (source, fn) => (0, _min_max_support.syncBy)((a, b) => a > b, source, fn);

const syncMinByComp = (source, fn) => (0, _min_max_support.syncByComp)(a => a < 0, source, fn);

const syncMinValue = source => (0, _min_max_support.syncValue)((a, b) => a > b, source);

const asyncMinBy = (source, fn) => (0, _min_max_support.asyncBy)((a, b) => a > b, source, fn);

const asyncMinByComp = (source, fn) => (0, _min_max_support.asyncByComp)(a => a < 0, source, fn);

const asyncMinValue = source => (0, _min_max_support.asyncValue)((a, b) => a > b, source);

function syncMin(source, fn) {
  if (!fn) return syncMinValue(source);
  if (fn.length >= 2) return syncMinByComp(source, fn);
  return syncMinBy(source, fn);
}

async function asyncMin(source, fn) {
  source = await (0, _get_iterator.asAsyncIterator)(source);
  if (!fn) return asyncMinValue(source);
  if (fn.length >= 2) return asyncMinByComp(source, fn);
  return asyncMinBy(source, fn);
}