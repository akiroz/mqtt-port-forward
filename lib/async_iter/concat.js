"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.concat = void 0;

var _get_iterator = require("./lib/get_iterator");

const concat = (0, _get_iterator.syncType)(syncConcat, asyncConcat);
exports.concat = concat;

function* syncConcat(...sources) {
  for (const s of sources) yield* s;
}

async function* asyncConcat(...sources) {
  sources = sources.map(s => (0, _get_iterator.asAsyncIterator)(s));

  for await (const source of sources) yield* await source;
}