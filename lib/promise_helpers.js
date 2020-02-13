"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.retryUntil = retryUntil;
exports.retryUntilTimeout = retryUntilTimeout;
exports.retryForeverUntil = retryForeverUntil;

const delay = period => new Promise(res => setTimeout(res, period));

async function retryUntil(fn, period = 4000) {
  const pausePeriod = 1;
  let count = period / pausePeriod;

  while (count > 0) {
    if (await fn()) return true;
    count--;
    await delay(pausePeriod);
  }

  return false;
}

async function retryUntilTimeout(fn, period = 4000) {
  const pausePeriod = 1;
  let count = period / pausePeriod;

  while (count > 0) {
    if (await fn()) return true;
    count--;
    await delay(pausePeriod);
  }

  throw new Error('Timeout');
}

const forever = true;

async function retryForeverUntil(fn) {
  while (forever) {
    if (await fn()) return true;
    await delay(10);
  }
}