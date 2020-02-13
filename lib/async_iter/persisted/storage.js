"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.open = open;

var _path = require("path");

var _fs = _interopRequireDefault(require("fs"));

var _item_queue = require("./item_queue");

var _stop_flaging = require("./stop_flaging");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const fsp = _fs.default.promises;

function dirs(storeDirectory) {
  storeDirectory = (0, _path.resolve)(storeDirectory);
  const readDirectory = (0, _path.join)(storeDirectory, 'reading');
  const processingDirectory = (0, _path.join)(storeDirectory, 'processing');
  const writingDirectory = (0, _path.join)(storeDirectory, 'writing');
  return {
    readDirectory,
    processingDirectory,
    writingDirectory
  };
}

async function writeStopMarker(storeDirectory, readDirectory, writingDirectory, opts) {
  await (0, _item_queue.pushItem)(readDirectory, writingDirectory, '', { ...opts,
    maxBytes: 0
  });
  await (0, _stop_flaging.flagAsStop)(storeDirectory);
}

async function push(readDirectory, writingDirectory, opts, data) {
  return (0, _item_queue.pushItem)(readDirectory, writingDirectory, data, opts);
}

async function* getItems(readDirectory, processingDirectory, consumerStopped, opts) {
  try {
    while (true) {
      const {
        filename,
        item
      } = await (0, _item_queue.popItem)(readDirectory, processingDirectory, opts);

      if (item.length === 0) {
        await fsp.unlink(filename);
        break;
      }

      yield {
        value: item,
        completed: () => fsp.unlink(filename)
      };
    }
  } finally {
    consumerStopped();
  }
}

async function open(storeDirectory, opts) {
  const {
    readDirectory,
    processingDirectory,
    writingDirectory
  } = dirs(storeDirectory);
  let _consumerHasStopped = false;

  const consumerHasStopped = () => _consumerHasStopped;

  const consumerStopped = () => {
    _consumerHasStopped = true;
  };

  await Promise.all([fsp.mkdir(readDirectory, {
    recursive: true
  }), fsp.mkdir(processingDirectory, {
    recursive: true
  }), fsp.mkdir(writingDirectory, {
    recursive: true
  })]);
  await (0, _item_queue.restoreUnprocessedItems)(readDirectory, processingDirectory, opts);
  const items = getItems(readDirectory, processingDirectory, consumerStopped, opts);
  if (await (0, _stop_flaging.hasStoppedFlag)(storeDirectory)) if (!(await (0, _item_queue.isEmpty)(readDirectory))) {
    if (!opts.allowRestart) throw new Error('Attempt to restart when a previous stopped non-empty iteration exists');
    await (0, _stop_flaging.unflagAsStop)(storeDirectory);
    await (0, _item_queue.removeLast)(readDirectory);
  }
  return {
    push: data => push(readDirectory, writingDirectory, opts, data),
    stop: () => writeStopMarker(storeDirectory, readDirectory, writingDirectory, opts),
    consumerHasStopped,
    items
  };
}