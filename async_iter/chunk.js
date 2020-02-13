"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.chunk = void 0;

var _get_iterator = require("./lib/get_iterator");

const chunk = (0, _get_iterator.syncType)(syncChunk, asyncChunk);
exports.chunk = chunk;

function* syncChunk(source, count) {
  const buffer = [];

  for (const item of source) {
    buffer.push(item);

    if (buffer.length === count) {
      yield [...buffer];
      buffer.length = 0;
    }
  }
}

async function* asyncChunk(source, count) {
  source = await (0, _get_iterator.asAsyncIterator)(source);
  const buffer = [];

  for await (const item of source) {
    buffer.push(item);

    if (buffer.length === count) {
      yield [...buffer];
      buffer.length = 0;
    }
  }
}