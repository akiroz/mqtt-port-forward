"use strict";

require("core-js/modules/es.symbol.description");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bufferBy = bufferBy;

var _promise_helpers = require("./lib/promise_helpers");

var _get_iterator = require("./lib/get_iterator");

const True = true;

function timeoutTrigger(state, period) {
  clearTimeout(state.timerHandle);
  const timeout = (0, _promise_helpers.promiseSignal)();
  state.timerHandle = setTimeout(() => timeout.res(), period);
  state.promise = timeout.promise.then(() => ({
    timed: true
  }));
}

function returnLastValue(state) {
  if (state.buffer.length > 0) {
    state.donedone = true;
    const emittedValue = state.buffer;
    state.buffer = [];
    return {
      value: emittedValue,
      done: false
    };
  }

  return {
    done: true
  };
}

function pushValue(state, value) {
  state.buffer.push(value);
  state.nextValue = undefined;
}

function packageNextEmit(state, period) {
  const emittedValue = state.buffer;
  state.buffer = [];
  timeoutTrigger(state, period);
  if (emittedValue.length > 0) return {
    value: emittedValue,
    done: false
  };
}
/**
```
import {bufferBy} from 'async_iter/pipeline/buffer_by' # pipeline version
import {bufferBy} from 'async_iter/buffer_by' # conventional version
```
 * Collect a set of items from source.  Emit as an array of those items.
 * <br/>
 * The batch is produced, when the <code>trigger</code> returns true, or the <code>maxWaitTime</code> has elasped since the last emitted value
 * @param  {Iterable}         source            The source iteration to buffer
 * @param  {triggerCallback}  trigger           Called for each item in the source iteration.  Return true to trigger a batch
 * @param  {Bumber}           maxWaitTime       period is milliseconds to trigger a batch, if no batch has been emitted and there are pending values
 * @return {Iterable} The buffered items
 * @name bufferBy
 * @function
 * @see also {@link bufferGroupBy}
 * @memberof module:Operators
 */


async function bufferBy(source, trigger, maxWaitTime) {
  const state = {
    buffer: [],
    nextValue: undefined,
    donedone: false,
    timeout: undefined
  };

  const _source = await (0, _get_iterator.asAsyncIterator)(source);
  /* eslint complexity: ['error', 9] */


  return (0, _get_iterator.asAsyncIterator)({
    [Symbol.asyncIterator]() {
      return {
        async next() {
          if (state.donedone) return {
            done: true
          };
          timeoutTrigger(state, maxWaitTime);

          while (True) {
            state.nextValue = state.nextValue || _source.next();
            const {
              value,
              done,
              timed
            } = await Promise.race([state.nextValue, state.promise]);
            if (done) return returnLastValue(state);
            let emittedValue = undefined;
            if (timed || trigger(value, [...state.buffer, value])) if (emittedValue = packageNextEmit(state, maxWaitTime)) return emittedValue;
            if (!timed) pushValue(state, value);
          }
        },

        async return() {
          _source.return();

          return {
            done: true
          };
        }

      };
    }

  });
}