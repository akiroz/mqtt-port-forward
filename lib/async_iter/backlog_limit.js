"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.backlogLimit = backlogLimit;

var _pump = require("./pump");

var _promise_helpers = require("./lib/promise_helpers");

function backlogLimit(source, count) {
  const buffer = [];
  let isFinished = false;
  let signal = (0, _promise_helpers.promiseSignal)();
  process.nextTick(async () => {
    try {
      for await (const item of source) if (buffer.length < count) {
        buffer.push(item);
        signal.res();
      } else buffer[buffer.length - 1] = item;
    } finally {
      isFinished = true;
    }
  });
  return (0, _pump.pump)(async target => {
    await target.next();

    while (!isFinished || buffer.length > 0) if (buffer.length === 0) {
      await signal.promise;
      signal = (0, _promise_helpers.promiseSignal)();
    } else {
      const p = buffer.shift();
      await target.next((await p));
    }

    target.return();
  });
}