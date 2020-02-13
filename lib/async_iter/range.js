"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.range = range;

function* forwardRange({
  start,
  end = Infinity,
  step
}) {
  for (let i = start; i <= end; i += step) yield i;
}

function* reverseRange({
  start,
  end = -Infinity,
  step
}) {
  for (let i = start; i >= end; i += step) yield i;
}
/* eslint complexity: ['error', 7] */

/**
```
import {range} from 'async_iter/range' # conventional version
```
Returns an iterator that iterates from start to end (inclusive) by step amounts
 * @param  {Object} [opts] the optional start, end and step values for the generation
 * @param  {Object} [opts.start=0] the starting number for the iteration
 * @param  {Object} [opts.end=Number.POSITIVE_INFINITY] the end number for the iteration
 * @param  {Object} [opts.step=1] the increment for the iteration
 * @return {Iterable} An iteration for the specified range
 * @function
 * @memberof module:Generators
 * @name range
 */


function range(opts) {
  if (typeof opts === 'number') opts = {
    end: opts
  };
  opts = {
    start: 0,
    ...opts
  };
  if (!opts.end && !opts.step) opts.end = Infinity;
  if (!opts.step) opts.step = opts.start < opts.end ? 1 : -1;
  return opts.step > 0 ? forwardRange(opts) : reverseRange(opts);
}