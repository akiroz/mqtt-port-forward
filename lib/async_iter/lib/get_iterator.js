"use strict";

require("core-js/modules/es.symbol.description");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.asAsyncIterator = asAsyncIterator;
exports.syncType = syncType;

/* eslint complexity: ['error', 5] */
async function* asAsyncIterator(source) {
  if (source.then) return yield* asAsyncIterator((await source));
  if (source.next) return yield* source;

  for await (const item of source) yield item;
}

function syncType(sync, async) {
  return (source, ...args) => {
    if (source[Symbol.iterator]) return sync(source, ...args);
    return async(source, ...args);
  };
}