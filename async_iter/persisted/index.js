"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.persisted = persisted;

var _storage = require("./storage");

async function persisted(source, path, opts = {}) {
  opts = {
    allowRestart: false,
    maxBytes: 0,
    overFlowEvent: () => undefined,
    ...opts,
    overflow: false
  };
  const {
    push,
    stop,
    items,
    consumerHasStopped
  } = await (0, _storage.open)(path, opts);
  process.nextTick(async () => {
    let item = await source.next();

    try {
      while (!item.done) {
        if (consumerHasStopped()) break;
        await push(item.value);
        item = await source.next();
      }
    } catch (err) {
      source.throw(err);
    } finally {
      source.return();
      await stop();
    }
  });
  return items;
}