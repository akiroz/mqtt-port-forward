"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pushItem = pushItem;
exports.popItem = popItem;
exports.removeLast = removeLast;
exports.restoreUnprocessedItems = restoreUnprocessedItems;
exports.isEmpty = isEmpty;

var _uuid = require("../lib/uuid");

var _path = require("path");

var _fs2 = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const fs = _fs2.default.promises;

const delay = period => new Promise(res => setTimeout(res, period));

function hasOverflowed(state) {
  return state.maxBytes !== 0 && state.maxBytes <= state.currentByteCount;
}

async function getOverflowItem(state) {
  if (state.overflow) return undefined;
  state.overflow = true;
  return await state.overFlowEvent();
}

function verifyDataType(data) {
  if (typeof data !== 'string' && !Buffer.isBuffer(data)) throw new Error(`Can only persist strings and buffers: ${typeof data}`);
}

async function pushItem(readDirectory, writingDirectory, data, state) {
  verifyDataType(data);

  if (hasOverflowed(state)) {
    data = await getOverflowItem(state);
    if (!data) return;
  }

  const id = process.hrtime.bigint().toString().padStart(14, '0');
  const name = `${id}-${(0, _uuid.uuidv4)()}`;
  const filename = (0, _path.join)(writingDirectory, name);
  state.currentByteCount = state.currentByteCount || 0;
  state.currentByteCount += data.length;
  await fs.writeFile(filename, data);
  await fs.rename(filename, (0, _path.join)(readDirectory, name));
}

function fsWatch(dir) {
  let watcher;
  return new Promise(res => watcher = _fs2.default.watch(dir, {}, (...args) => {
    watcher.close();
    res(args);
  }));
}

async function popItem(readDirectory, processingDirectory, state) {
  let x;

  do {
    x = await fs.readdir(readDirectory);
    if (x.length === 0) await Promise.race([delay(200), fsWatch(readDirectory)]);
  } while (x.length === 0);

  const name = x.sort()[0];
  const filename = (0, _path.join)(processingDirectory, name);
  await fs.rename((0, _path.join)(readDirectory, name), filename);
  const data = await fs.readFile(filename);
  state.currentByteCount -= data.length;
  state.overflow = false;
  return {
    filename,
    item: data
  };
}

async function removeLast(readDirectory) {
  const x = await fs.readdir(readDirectory);
  if (x.length === 0) return;
  const name = x.sort()[x.length - 1];
  const filename = (0, _path.join)(readDirectory, name);
  const item = await fs.readFile(filename);
  if (item.length === 0) await fs.unlink(filename);
}

async function restoreUnprocessedItems(readDirectory, processingDirectory, state) {
  const x = await fs.readdir(processingDirectory);
  await Promise.all(x.map(f => fs.rename((0, _path.join)(processingDirectory, f), (0, _path.join)(readDirectory, f))));
  const readFiles = await fs.readdir(readDirectory);
  const total = (await Promise.all(readFiles.map(f => fs.stat((0, _path.join)(readDirectory, f)).then(s => s.size)))).reduce((a, v) => a + v, 0);
  state.currentByteCount = total;
}

async function isEmpty(readDirectory) {
  return await fs.readdir(readDirectory).then(x => x.length === 0).catch(() => true);
}