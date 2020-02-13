"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.syncFilterWhen = syncFilterWhen;
exports.asyncFilterWhen = asyncFilterWhen;
exports.filterWhen = void 0;

var _get_iterator = require("./lib/get_iterator");

const filterWhen = (0, _get_iterator.syncType)(syncFilterWhen, asyncFilterWhen);
/* eslint complexity: ['error', 6] */

exports.filterWhen = filterWhen;

function* syncFilterWhen(source, fn, missingValueFn = (a, b) => b) {
  let currentState = true;
  let firstDropped = undefined;
  let lastItem = undefined;

  for (const x of source) {
    lastItem = x;
    const newState = fn(x);
    if (currentState) {
      if (newState) yield x;else {
        firstDropped = x;
        currentState = false;
      }
    } else if (newState) {
      currentState = true;
      yield missingValueFn(firstDropped, x);
      firstDropped = undefined;
    }
  }

  if (!currentState) yield missingValueFn(firstDropped, lastItem);
}

async function* asyncFilterWhen(source, fn, missingValueFn = (a, b) => b) {
  source = await (0, _get_iterator.asAsyncIterator)(source);
  let currentState = true;
  let firstDropped = undefined;
  let lastItem = undefined;

  for await (const x of source) {
    lastItem = x;
    const newState = await fn(x);
    if (currentState) {
      if (newState) yield x;else {
        firstDropped = x;
        currentState = false;
      }
    } else if (newState) {
      currentState = true;
      yield missingValueFn(firstDropped, x);
      firstDropped = undefined;
    }
  }

  if (!currentState) yield missingValueFn(firstDropped, lastItem);
}