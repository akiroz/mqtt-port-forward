"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rateLimit = rateLimit;

var _promise_helpers = require("./lib/promise_helpers");

var _get_iterator = require("./lib/get_iterator");

async function* rateLimit(source, maxAmount, perPeriod, counter = () => 1) {
  source = await (0, _get_iterator.asAsyncIterator)(source);
  let forBucketAboveZero = (0, _promise_helpers.promiseSignal)();
  forBucketAboveZero.res();
  let bucket = maxAmount;
  const inc = 100 / perPeriod * maxAmount;
  const interval = setInterval(() => {
    bucket = Math.min(maxAmount, bucket + inc);
    if (bucket >= 0) forBucketAboveZero.res();
  }, 100);

  try {
    while (true) {
      const item = await source.next();
      if (item.done) return;
      bucket = bucket - counter(item.value);

      if (bucket < 0) {
        forBucketAboveZero = (0, _promise_helpers.promiseSignal)();
        await forBucketAboveZero.promise;
      }

      yield item.value;
    }
  } finally {
    clearInterval(interval);
  }
}