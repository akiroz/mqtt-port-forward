"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pump = pump;

var _promise_helpers = require("./lib/promise_helpers");

class ArgumentError extends Error {
  constructor() {
    super('pump callback function has not returned a promise');
    this.name = this.constructor.name;
    if (Error.captureStackTrace) Error.captureStackTrace(this, this.constructor.name);
  }

}
/**
```
import {pump} from 'async_iter/pump'
```
pump allows for the 'pushing' of values into an async iterator consumer

The `push` operation returns a promise, that resolves when the consuming iteration has consumed the item

This function follows the convention of a pushed iterator interface (next, throw, return).

If the code pushing values, does not await the return promise, the values are then queued
for processing by the consumer as it pulls in the values

The callback is not invoked, until the first item is pulled from the iteration

@param  {pumpCallback} fn        this is a function that will async pump values into the interator
@param  {String}   [marker=]
@return {Iteratable}         A standard async iterator that can consume the generated values

@example
import {pump} from 'async_iter'

// Create a push based iteration set
const items = await pump(target => {
  //Values can be push to the iteration
  await target.next(1) // if you dont 'await' the values will be queued.
  await target.next(2)
  await target.next(3)
  // If you want to push an 'error' to the consumer
  // await target.throw(new Error('This is an error'))
  await target.return()
})

for await (const item of items)
  console.log(item)

@memberof module:Generators
@name pump
@function
*/


function pump(fn, marker) {
  const myObject = new ArgumentError();
  return _pump(fn, marker, myObject);
}

async function* _pump(fn, marker, myObject) {
  let values = undefined;
  let keepAlive;
  let latch = (0, _promise_helpers.promiseSignal)();
  const unlatch = [];

  const keepAliveTimer = () => keepAlive = setTimeout(keepAliveTimer, 250);

  let hasStopped = false;
  const hasStoppedSignal = createStopSignal(fn.length >= 2);

  function createStopSignal(callbackRequestsStopSignal) {
    if (!callbackRequestsStopSignal) return;
    const hasStoppedSignal = (0, _promise_helpers.promiseSignal)();

    hasStoppedSignal.promise.now = () => {
      return hasStopped;
    };

    return hasStoppedSignal;
  }

  async function _next(item, options = {}) {
    if (hasStopped) return {
      value: undefined,
      done: true
    };
    options = {
      done: false,
      ...options
    };
    const p = unlatch.length === 0 ? {
      marker: 'none'
    } : unlatch[unlatch.length - 1];
    const newP = (0, _promise_helpers.promiseSignal)();
    unlatch.push(newP);
    await p.promise;
    values = { ...options,
      item
    };
    latch.res();
  }

  function _return() {
    return _next(undefined, {
      done: true
    });
  }

  function _throw(error) {
    return _next(undefined, {
      error
    });
  }

  async function untilNextValueAvailable() {
    await latch.promise;
    latch = (0, _promise_helpers.promiseSignal)({});
  }

  function unLatchNextValue() {
    const p = unlatch.shift();
    p.res();
  }

  function unlatchAll() {
    latch.res();

    for (const p of unlatch) p.res();

    unlatch.length = 0;
  }

  function extractNextValue() {
    const v = values;
    values = undefined;
    if (v.error) throw v.error;
    return v;
  }

  process.nextTick(() => {
    async function* _target() {
      let count = 0;

      try {
        while (!hasStopped) {
          const x = await (yield count++);
          await _next(x);
        }
      } catch (err) {
        _throw(err);
      } finally {
        await _return();
      }
    }

    const target = _target();

    let operation;
    if (hasStoppedSignal) operation = fn(target, hasStoppedSignal.promise);else operation = fn(target);
    if (operation && operation.catch) operation.catch(err => _throw(err));else return _throw(myObject);
  });
  keepAliveTimer();

  function terminateIteration(err) {
    hasStopped = true;
    if (hasStoppedSignal) if (err) {
      hasStoppedSignal.res(err);
    } else hasStoppedSignal.res();
    unlatchAll();
    clearTimeout(keepAlive);
    if (err) throw err;
  }

  try {
    while (true) {
      await untilNextValueAvailable();
      const {
        item,
        done
      } = extractNextValue();
      if (done) break;
      yield item;
      unLatchNextValue();
    }
  } catch (err) {
    terminateIteration(err);
  } finally {
    terminateIteration();
  }
}