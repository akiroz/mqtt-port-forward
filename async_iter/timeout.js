"use strict";

require("core-js/modules/es.symbol.description");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TimeoutCancel = TimeoutCancel;
exports.timeoutError = timeoutError;
exports.timeout = timeout;

var _pump = require("./pump");

var _promise_helpers = require("./lib/promise_helpers");

function TimeoutCancel() {
  const cancelHook = (0, _promise_helpers.promiseSignal)();

  const result = () => cancelHook.res();

  result.cancelHook = cancelHook;

  result.then = (...args) => cancelHook.promise.then(...args);

  return result;
}

class TimeoutIterationError extends Error {
  constructor() {
    super('Timeout Iteration');
  }

}

function timeoutError(period, cancelHook = undefined) {
  return timeout(period, cancelHook, new TimeoutIterationError());
}

const TimeoutSymbol = Symbol('Timeout');

function timeout(period, cancelHook = undefined, timeoutMarker = TimeoutSymbol) {
  return (0, _pump.pump)(async (target, hasStopped) => {
    await target.next();
    const timer = setTimeout(timerTest, period);

    function timerTest() {
      abortIteration(true);
    }

    function abortIteration(abort) {
      clearTimeout(timer);
      if (abort) if (timeoutMarker instanceof Error) target.throw(timeoutMarker);else target.next(timeoutMarker);
      target.return();
    }

    const p = cancelHook ? [hasStopped, cancelHook] : [hasStopped];
    Promise.race(p).then(() => abortIteration(false));
  });
}