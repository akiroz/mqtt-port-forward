"use strict";

require("core-js/modules/es.symbol.description");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bufferGroupBy = bufferGroupBy;

var _get_iterator = require("./lib/get_iterator");

const True = true;

const delay = period => new Promise(res => setTimeout(res, period));
/**
```
import {bufferGroupBy} from 'async_iter/pipeline/buffer_group_by' # pipeline version
import {bufferGroupBy} from 'async_iter/buffer_group_by' # conventional version
```
 * Collect and group items as per a trigger function or a time period.  Emits an array of the batched items.
 * <br/>
 * Similar to the `bufferBy` only the batches emitted are as per the `selector` grouping function.
 * @param  {Iterable}         source        The source iteration to buffer
 * @param  {Function}         selector      A function that returns the key to be used to identify grouping
 * @param  {triggerCallback}  trigger       A function to indicate when a grouped items should be emitted
 * @param  {number}           maxWaitTime   The minimum period of time (ms), before any pending grouped items should be emitted
 * @return {Iterable} The buffered items
 * @name bufferGroupBy
 * @function
 * @see also {@link bufferBy}
 * @memberof module:Operators
 */


function bufferGroupBy(source, selector, trigger, maxWaitTime) {
  const state = {
    buffers: {},
    nextValue: undefined
  };

  function emit(key) {
    const value = state.buffers[key].data;
    delete state.buffers[key];
    return {
      value
    };
  }
  /* eslint complexity: ['error', 29] */


  return (0, _get_iterator.asAsyncIterator)({
    [Symbol.asyncIterator]() {
      return {
        async next() {
          while (True) {
            state.nextValue = state.nextValue || source.next();
            const timers = Object.values(state.buffers).map(t => t.timer);
            const {
              value,
              done,
              timed
            } = await Promise.race([state.nextValue, ...timers]);

            if (done) {
              const keys = Object.keys(state.buffers);
              if (keys.length === 0) return {
                done: true
              };
              return emit(keys[0]);
            }

            if (timed) return emit(timed);
            const groupKey = selector(value);
            if (!state.buffers[groupKey]) state.buffers[groupKey] = {
              timer: delay(maxWaitTime).then(() => ({
                timed: groupKey
              })),
              data: []
            };
            state.buffers[groupKey].data.push(value);
            state.nextValue = undefined;
            if (trigger(value, state.buffers[groupKey].data)) return emit(groupKey);
          }
        },

        async return() {
          state.buffers = {};
          state.nextValue = undefined;
          source.return();
          return {
            done: true
          };
        }

      };
    }

  });
}